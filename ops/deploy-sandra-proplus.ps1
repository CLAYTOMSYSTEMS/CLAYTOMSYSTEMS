param(
  [string]$BaseDir = "websites/guestsvalencia.es",
  [string]$ZipPath = "imports/guestsvalencia-bundle.zip"
)

$ErrorActionPreference = 'Stop'
function Log($m){ Write-Host ("[DEPLOY] " + $m) }

if (!(Test-Path .git)) { throw "Ejecuta desde la raíz del repo" }

$branch = "deploy/sandra-proplus-merge"
$current = git rev-parse --abbrev-ref HEAD 2>$null
if ($current -ne $branch) {
  Log "Checkout/crear rama $branch"; git checkout -B $branch | Out-Null
}

if (!(Test-Path $BaseDir)) { throw "No existe $BaseDir" }
$timestamp = Get-Date -Format yyyyMMdd-HHmmss
Set-Location $BaseDir

# Backup estáticos sólo si no se ha hecho
$backupDir = "_backup_static_$timestamp"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$toMove = @('*.html','*.js','*.css','assets','public','sw.js','manifest.json','audio','data','ops','sandra-app.js')
foreach($p in $toMove){ Get-Item $p -ErrorAction SilentlyContinue | Move-Item -Destination $backupDir -Force -ErrorAction SilentlyContinue }
Log "Backup hecho en $BaseDir/$backupDir"

# Scaffold mínimo si faltan directorios clave (idempotente)
New-Item -ItemType Directory -Force -Path src/app/api | Out-Null
New-Item -ItemType Directory -Force -Path src/lib | Out-Null
New-Item -ItemType Directory -Force -Path public | Out-Null

# Asegurar package.json con dependencias (merge si ya existe)
$pkgPath = Join-Path (Get-Location) 'package.json'
$json = @{}
if (Test-Path $pkgPath) { try { $json = Get-Content $pkgPath -Raw | ConvertFrom-Json } catch { $json = @{} } }
$json.name = 'guestsvalencia-pwa'
$json.private = $true
$json.type = 'module'
if (-not $json.scripts) { $json | Add-Member -NotePropertyName scripts -NotePropertyValue (@{}) }
$json.scripts.dev = 'next dev -p 5173'
$json.scripts.build = 'next build'
$json.scripts.start = 'next start'
$depsNeeded = @{
  '@netlify/plugin-nextjs'='^5.2.0';
  '@supabase/supabase-js'='^2.45.4';
  '@deepgram/sdk'='^3.7.0';
  'next'='14.2.5';
  'openai'='^4.56.0';
  'react'='18.3.1';
  'react-dom'='18.3.1';
  'twilio'='^4.22.0';
  'xmlbuilder2'='^3.1.1'
}
if (-not $json.dependencies) { $json | Add-Member -NotePropertyName dependencies -NotePropertyValue (@{}) }
foreach($k in $depsNeeded.Keys){ if (-not $json.dependencies.$k) { $json.dependencies.$k = $depsNeeded[$k] } }
$devNeeded = @{'autoprefixer'='^10.4.20';'postcss'='^8.4.47';'tailwindcss'='^3.4.10';'typescript'='^5.5.4';'@types/node'='^20.11.30';'@types/react'='^18.3.3';'@types/react-dom'='^18.3.0'}
if (-not $json.devDependencies) { $json | Add-Member -NotePropertyName devDependencies -NotePropertyValue (@{}) }
foreach($k in $devNeeded.Keys){ if (-not $json.devDependencies.$k) { $json.devDependencies.$k = $devNeeded[$k] } }
$json | ConvertTo-Json -Depth 6 | Out-File $pkgPath -Encoding UTF8

# Import ZIP
Set-Location ..\..\..  # volver raíz repo
if (!(Test-Path $ZipPath)) { Log "ZIP no encontrado en $ZipPath (continuo sin importar)" } else {
  $absSite = Resolve-Path $BaseDir
  $importsRoot = Join-Path $absSite "_imports"
  New-Item -ItemType Directory -Force -Path $importsRoot | Out-Null
  $importTarget = Join-Path $importsRoot $timestamp
  New-Item -ItemType Directory -Force -Path $importTarget | Out-Null
  Log "Extrayendo ZIP en $importTarget"
  Expand-Archive -Path $ZipPath -DestinationPath $importTarget -Force
  # Copias idempotentes
  robocopy "$importTarget\public" "$absSite\public" /E /NFL /NDL /NJH /NJS /NP | Out-Null 2>$null
  robocopy "$importTarget\src\components" "$absSite\src\components" /E /NFL /NDL /NJH /NJS /NP | Out-Null 2>$null
  robocopy "$importTarget\src\lib" "$absSite\src\lib" /E /NFL /NDL /NJH /NJS /NP | Out-Null 2>$null
  robocopy "$importTarget\src\app\api" "$absSite\src\app\api" /E /NFL /NDL /NJH /NJS /NP | Out-Null 2>$null
  Log "ZIP importado"
}

Set-Location $BaseDir
Log "Instalando dependencias"
npm install --no-audit --no-fund
Log "Compilando"
npm run build

Set-Location ..\..\..
Log "Commit y push"
git add $BaseDir
$commitMsg = "Deploy: Sandra PWA Pro+ (ZIP avatars+automations) [$timestamp]"
try { git commit -m $commitMsg } catch { Log "Nada que commitear" }
git push -u origin $branch
Log "Listo. Crea PR y haz merge a main para gatillar Netlify."