export default function Admin(){
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Panel Admin (demo)</h2>
      <ul className="list-disc ml-5">
        <li>Propietarios / Alojamientos</li>
        <li>Precios dinámicos</li>
        <li>Integración Supabase</li>
        <li>Logs de Sandra / llamadas / tickets</li>
      </ul>
      <p className="mt-3 text-sm text-gray-600">Conecta SUPABASE_URL y SUPABASE_ANON_KEY para activar DB.</p>
    </div>
  );
}
