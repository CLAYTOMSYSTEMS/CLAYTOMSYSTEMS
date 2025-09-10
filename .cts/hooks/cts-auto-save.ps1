@echo off
echo [CTS-AUTO-SAVE] Guardando cambios automaticamente...
git add -A
git commit -m "Auto-save: %DATE% %TIME% - CODE Soldier Engineer"
echo [CTS-AUTO-SAVE] Cambios guardados exitosamente

