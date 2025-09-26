export default function Aloj(){
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Alojamientos (demo)</h2>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({length:6}).map((_,i)=>(
          <li key={i} className="border rounded p-4">
            <div className="h-36 bg-gray-200 rounded mb-2" />
            <div className="font-medium">Apartamento Demo #{i+1}</div>
            <div className="text-sm text-gray-600">2 hab · 1 baño · Centro</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
