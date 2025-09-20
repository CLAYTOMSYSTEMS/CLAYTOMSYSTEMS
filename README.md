# Claytom MCP (integración GitHub App + GPT-5)

Resumen:
- Middleware que recibe webhooks de GitHub desde una GitHub App, verifica la firma, consulta GPT-5 y publica respuestas/acciones en el repo.

Instrucciones para crear la GitHub App:
1. En GitHub: Settings → Developer settings → GitHub Apps → New GitHub App.
2. Nombre sugerido: Claytom MCP (o similar).
3. Webhook URL: https://TU_DOMINIO/webhook  (o ngrok durante desarrollo).
4. Webhook secret: elige un secreto y guarda.
5. Permisos recomendados:
   - Issues: Read & Write (para comentar issues).
   - Repository contents: Read-only (si sólo lees).
   - Pull requests: Read & Write (si quieres comentar PRs).
6. Eventos a suscribir: Issues, Pull requests, Issue comment (según necesidades).
7. Genera y descarga la clave privada (.pem). Copia el App ID.
8. Instala la App en el repositorio GUESTVALENCIA/CLAYTOMSYSTEMS (botón "Install App").

Añadir secretos al repositorio:
- GITHUB_APP_ID
- GITHUB_PRIVATE_KEY  (en GitHub Secrets, reemplaza saltos de línea por \n si es necesario)
- GITHUB_INSTALLATION_ID
- WEBHOOK_SECRET
- OPENAI_API_KEY

Despliegue:
1. Compilar: npm run build
2. Construir imagen: docker build -t claytom-mcp .
3. Ejecutar con variables de entorno: docker run -e OPENAI_API_KEY=... -e GITHUB_APP_ID=... -e GITHUB_PRIVATE_KEY="..." -e GITHUB_INSTALLATION_ID=... -e WEBHOOK_SECRET="..." -p 3000:3000 claytom-mcp

Notas de seguridad:
- No incluyas la clave privada en texto plano en repositorios públicos.
- Usa secrets del proveedor de CI/despliegue o GitHub Secrets.

End of files.