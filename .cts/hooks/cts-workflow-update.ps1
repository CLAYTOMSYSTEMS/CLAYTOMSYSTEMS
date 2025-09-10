@echo off
echo [CTS-WORKFLOW] Actualizando estado workflow...
powershell -Command "$workflow = Get-Content \"C:\Users\clayt\source\repos\CLAYTOMSYSTEMS\.cts\workflow.json\" | ConvertFrom-Json; $workflow.last_update = (Get-Date).ToString(\"o\"); $workflow.last_action = \"Cambios aplicados por CODE\"; $workflow | ConvertTo-Json | Set-Content \"C:\Users\clayt\source\repos\CLAYTOMSYSTEMS\.cts\workflow.json\""
echo [CTS-WORKFLOW] Estado actualizado

