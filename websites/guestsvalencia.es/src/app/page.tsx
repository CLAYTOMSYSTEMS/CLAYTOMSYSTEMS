export default function Page(){
  return (
    <section className="grid gap-6">
      <div className="rounded-xl p-8 border">
        <h2 className="text-2xl font-semibold mb-2">Bienvenido a Get Valencia</h2>
        <p>Reserva alojamientos y habla con <strong>Sandra</strong>, nuestra IA conversacional.</p>
        <div className="mt-4 flex gap-3">
          <a href="/alojamientos" className="px-4 py-2 rounded bg-black text-white">Ver alojamientos</a>
          <a href="/sandra" className="px-4 py-2 rounded border">Hablar con Sandra</a>
        </div>
      </div>
      <div className="rounded-xl p-8 border">
        <h3 className="font-medium mb-1">Búsqueda con IA</h3>
        <form method="GET" action="/sandra" className="grid gap-2 max-w-xl">
          <input name="q" placeholder="Ej: piso con terraza cerca de Ruzafa" className="border rounded px-3 py-2 w-full" />
          <button className="px-4 py-2 rounded bg-black text-white" type="submit">Buscar con IA</button>
        </form>
      </div>
    </section>
  );
}
