export default function OwnerDashboard() {
  // Fake revenue data
  const revenueData = [
    { month: 'Enero', revenue: 12450, occupancy: 78 },
    { month: 'Febrero', revenue: 15200, occupancy: 85 },
    { month: 'Marzo', revenue: 18950, occupancy: 92 },
    { month: 'Abril', revenue: 22100, occupancy: 89 },
    { month: 'Mayo', revenue: 25800, occupancy: 94 },
    { month: 'Junio', revenue: 28450, occupancy: 97 },
  ];

  const properties = [
    { name: 'Apartamento Centro Premium', occupancy: 94, revenue: 8450, rating: 4.9 },
    { name: 'Estudio Moderno Valencia', occupancy: 89, revenue: 5200, rating: 4.8 },
    { name: 'Apartamento Familiar', occupancy: 87, revenue: 9800, rating: 4.7 },
    { name: 'Loft Moderno Ciudad', occupancy: 92, revenue: 4900, rating: 4.9 },
  ];

  const optimizationSuggestions = [
    { type: 'pricing', message: 'Incrementar precios fin de semana en un 15%', impact: '+€1,200/mes' },
    { type: 'availability', message: 'Reducir estancia mínima en temporada baja', impact: '+12% ocupación' },
    { type: 'marketing', message: 'Activar promoción para estancias largas', impact: '+€800/mes' },
    { type: 'maintenance', message: 'Mejorar calificación WiFi aumentará reservas', impact: '+€400/mes' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Propietario</h1>
              <p className="text-gray-600">Gestión de ingresos y optimización de propiedades</p>
            </div>
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option>Últimos 6 meses</option>
                <option>Último año</option>
                <option>Todo el período</option>
              </select>
              <button className="btn btn-primary">
                Solicitar Pago
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Ingresos Totales</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                +18%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">€28,450</div>
            <p className="text-sm text-gray-600">Este mes</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Ocupación Media</h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                +5%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">91%</div>
            <p className="text-sm text-gray-600">Promedio mensual</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Precio Medio</h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">€87</div>
            <p className="text-sm text-gray-600">Por noche</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Evolución de Ingresos</h2>
              <p className="text-gray-600 text-sm">Ingresos y ocupación por mes</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium text-gray-600">
                        {data.month}
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-[200px]">
                        <div 
                          className="bg-primary-500 h-2 rounded-full" 
                          style={{ width: `${data.occupancy}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {data.occupancy}%
                      </div>
                    </div>
                    <div className="text-right ml-8">
                      <div className="font-semibold text-gray-900">€{data.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sandra IA Suggestions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  🤖
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Sandra IA</h2>
                  <p className="text-gray-600 text-sm">Sugerencias de optimización</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {optimizationSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                    <div className="flex items-start gap-3">
                      <div className="text-lg">
                        {suggestion.type === 'pricing' ? '💰' :
                         suggestion.type === 'availability' ? '📅' :
                         suggestion.type === 'marketing' ? '📢' : '🔧'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {suggestion.message}
                        </p>
                        <p className="text-xs text-green-700 font-medium">
                          {suggestion.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 btn btn-primary text-sm">
                Ver Más Sugerencias
              </button>
            </div>
          </div>
        </div>

        {/* Properties Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Rendimiento por Propiedad</h2>
            <p className="text-gray-600 text-sm">Métricas individuales de cada alojamiento</p>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {properties.map((property, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-4">{property.name}</h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{property.occupancy}%</div>
                      <div className="text-xs text-gray-600">Ocupación</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">€{property.revenue}</div>
                      <div className="text-xs text-gray-600">Ingresos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{property.rating}</div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 btn btn-secondary text-sm">Ver Detalles</button>
                    <button className="flex-1 btn btn-primary text-sm">Optimizar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn btn-primary p-4 text-left">
            <div className="text-lg mb-1">💰</div>
            <div className="font-medium">Solicitar Pago</div>
          </button>
          
          <button className="btn btn-secondary p-4 text-left">
            <div className="text-lg mb-1">📊</div>
            <div className="font-medium">Reporte Mensual</div>
          </button>
          
          <button className="btn btn-secondary p-4 text-left">
            <div className="text-lg mb-1">🎯</div>
            <div className="font-medium">Optimizar Precios</div>
          </button>
          
          <button className="btn btn-secondary p-4 text-left">
            <div className="text-lg mb-1">🤖</div>
            <div className="font-medium">Consultar Sandra IA</div>
          </button>
        </div>
      </div>
    </div>
  );
}