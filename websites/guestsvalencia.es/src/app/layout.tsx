import "../styles/globals.css";
export const metadata = { title: "Get Valencia", description: "Alojamientos y Sandra IA" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <h1 className="font-bold">Get Valencia</h1>
            <nav className="flex gap-4 text-sm">
              <a href="/" className="hover:underline">Inicio</a>
              <a href="/alojamientos" className="hover:underline">Alojamientos</a>
              <a href="/sandra" className="hover:underline">Sandra</a>
              <a href="/admin" className="hover:underline">Admin</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
