#!/bin/bash
# CTS Monitor - Sistema de monitoreo continuo

LOG_DIR="C:\Users\clayt\source\repos\CLAYTOMSYSTEMS\.cts\logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Crear log de sesión
echo "=== CTS MONITOR SESSION START: $TIMESTAMP ===" >> "$LOG_DIR/monitor.log"

# Monitorear estado del sistema
echo "[MONITOR] Verificando integridad sistema ClayTomSystems..." >> "$LOG_DIR/monitor.log"

# Verificar archivos críticos
CRITICAL_FILES=(
    "C:\Users\clayt\source\repos\CLAYTOMSYSTEMS\CLAUDE.md"
    "C:\Users\clayt\source\repos\CLAYTOMSYSTEMS\.claude\settings.json"
    "C:\Users\clayt\source\repos\CLAYTOMSYSTEMS\.cts\workflow.json"
    "C:\ProgramData\ClaudeCode\managed-settings.json"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "[OK] $file" >> "$LOG_DIR/monitor.log"
    else
        echo "[ERROR] Missing: $file" >> "$LOG_DIR/monitor.log"
    fi
done

# Verificar estado Git
cd "C:\Users\clayt\source\repos\CLAYTOMSYSTEMS"
git status --porcelain >> "$LOG_DIR/git_status.log"

echo "[MONITOR] Monitoreo completado: $TIMESTAMP" >> "$LOG_DIR/monitor.log"

