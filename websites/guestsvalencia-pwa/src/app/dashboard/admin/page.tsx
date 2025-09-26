export default function AdminDashboard() {
  // Fake KPI data
  const kpis = [
    { label: 'Reservas Activas', value: '47', change: '+12%', trend: 'up' },
    { label: 'Ocupación Media', value: '87%', change: '+5%', trend: 'up' },
    { label: 'Ingresos Mes', value: '€18,450', change: '+23%', trend: 'up' },
    { label: 'Consultas Sandra IA', value: '1,247', change: '+34%', trend: 'up' },
  ];

  const recentActivities = [
    { time: '14:30', event: 'Nueva reserva - Apartamento Centro Premium', type: 'booking' },
    { time: '13:45', event: 'Check-in automático completado - Estudio Moderno', type: 'checkin' },
    { time: '12:20', event: 'Consulta resuelta por Sandra IA - Soporte WiFi', type: 'support' },
    { time: '11:15', event: 'Pago procesado - €255', type: 'payment' },
    { time: '10:30', event: 'Nueva consulta propietario - Optimización precios', type: 'owner' },
  ];

  const chatbotStats = [
    { name: 'Clientes', queries: 342, satisfaction: 94 },
    { name: 'Check-in/out', queries: 128, satisfaction: 98 },
    { name: 'Soporte', queries: 89, satisfaction: 91 },
    { name: 'Propietarios', queries: 67, satisfaction: 96 },
    { name: 'Monitoreo', queries: 23, satisfaction: 100 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrador</h1>
              <p className="text-gray-600">Panel de control y métricas operativas</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ● Sistema Operativo
              </div>
              <button className="btn btn-primary">
                Generar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{kpi.label}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  kpi.trend === 'up' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sandra IA Stats */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Estadísticas Sandra IA</h2>
              <p className="text-gray-600 text-sm">Rendimiento de los 5 chatbots especializados</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {chatbotStats.map((bot, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">
                          {bot.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{bot.name}</h3>
                        <p className="text-sm text-gray-600">{bot.queries} consultas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">{bot.satisfaction}%</div>
                      <div className="text-xs text-gray-600">Satisfacción</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
              <p className="text-gray-600 text-sm">Últimos eventos del sistema</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'booking' ? 'bg-blue-500' :
                      activity.type === 'checkin' ? 'bg-green-500' :
                      activity.type === 'support' ? 'bg-yellow-500' :
                      activity.type === 'payment' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.event}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Estado del Sistema</h2>
            <p className="text-gray-600 text-sm">Monitoreo de servicios y APIs</p>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">OpenAI API</p>
                  <p className="text-sm text-gray-600">Operativo • 99.9%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">ElevenLabs</p>
                  <p className="text-sm text-gray-600">Operativo • 99.7%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Deepgram</p>
                  <p className="text-sm text-gray-600">Operativo • 99.8%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Twilio</p>
                  <p className="text-sm text-gray-600">Degradado • 95.2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn btn-primary p-4 text-left">
            <div className="text-lg mb-1">🔄</div>
            <div className="font-medium">Reiniciar Servicios</div>
          </button>
          
          <button className="btn btn-secondary p-4 text-left">
            <div className="text-lg mb-1">📊</div>
            <div className="font-medium">Exportar Métricas</div>
          </button>
          
          <button className="btn btn-secondary p-4 text-left">
            <div className="text-lg mb-1">⚙️</div>
            <div className="font-medium">Configuración</div>
          </button>
          
          <button className="btn btn-secondary p-4 text-left">
            <div className="text-lg mb-1">🔔</div>
            <div className="font-medium">Alertas</div>
          </button>
        </div>
      </div>
    </div>
  );
}