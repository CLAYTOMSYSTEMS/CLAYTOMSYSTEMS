#!/bin/bash
# CTS Rollback Script - Emergency Restore

echo "[CTS-ROLLBACK] Iniciando rollback de emergencia..."

# Verificar si estamos en el repo correcto
if [ ! -f "CLAUDE.md" ]; then
    echo "[ERROR] No estamos en el directorio ClayTomSystems"
    exit 1
fi

# Guardar cambios actuales por seguridad
git add -A
git commit -m "Respaldo antes de rollback - $(date)"

# Restaurar desde backup
git checkout code-soldier-backup

echo "[CTS-ROLLBACK] Rollback completado exitosamente"
echo "[CTS-ROLLBACK] Configuración CODE Soldier Engineer restaurada"

