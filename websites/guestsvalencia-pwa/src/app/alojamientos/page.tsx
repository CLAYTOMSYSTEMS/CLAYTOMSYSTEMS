import Link from 'next/link';

interface Apartment {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  bedrooms: number;
  maxGuests: number;
  features: string[];
}

const apartments: Apartment[] = [
  {
    id: 1,
    title: 'Apartamento Centro Premium',
    description: 'Moderno apartamento en el corazón de Valencia con todas las comodidades',
    price: 85,
    image: '/alojamientos/apartment1.jpg',
    bedrooms: 2,
    maxGuests: 4,
    features: ['WiFi Premium', 'Aire Acondicionado', 'Cocina Completa', 'Check-in Automático']
  },
  {
    id: 2,
    title: 'Estudio Moderno Valencia',
    description: 'Acogedor estudio perfecto para parejas o viajeros de negocios',
    price: 65,
    image: '/alojamientos/apartment2.jpg',
    bedrooms: 1,
    maxGuests: 2,
    features: ['WiFi Premium', 'Smart TV', 'Zona de Trabajo', 'Ubicación Céntrica']
  },
  {
    id: 3,
    title: 'Apartamento Familiar',
    description: 'Espacioso apartamento ideal para familias con todas las comodidades',
    price: 120,
    image: '/alojamientos/apartment1.jpg',
    bedrooms: 3,
    maxGuests: 6,
    features: ['WiFi Premium', 'Balcón', 'Lavadora', 'Parking Incluido']
  },
  {
    id: 4,
    title: 'Loft Moderno Ciudad',
    description: 'Loft de diseño con vistas panorámicas de Valencia',
    price: 95,
    image: '/alojamientos/apartment2.jpg',
    bedrooms: 1,
    maxGuests: 3,
    features: ['Terraza Privada', 'Diseño Moderno', 'Vistas Ciudad', 'Check-in Automático']
  }
];

export default function AlojamientosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nuestros Alojamientos
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Apartamentos premium en Valencia con tecnología avanzada y atención personalizada
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>Todas las habitaciones</option>
                <option>1 habitación</option>
                <option>2 habitaciones</option>
                <option>3+ habitaciones</option>
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>Cualquier precio</option>
                <option>€50 - €75</option>
                <option>€75 - €100</option>
                <option>€100+</option>
              </select>
              
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>Huéspedes</option>
                <option>1-2 personas</option>
                <option>3-4 personas</option>
                <option>5+ personas</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              {apartments.length} alojamientos encontrados
            </div>
          </div>
        </div>
      </section>

      {/* Apartments Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apartments.map((apartment) => (
              <Link 
                key={apartment.id}
                href={`/alojamientos/${apartment.id}`}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-r from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-4xl">🏠</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                    €{apartment.price}/noche
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {apartment.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {apartment.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{apartment.bedrooms} hab • hasta {apartment.maxGuests} huéspedes</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {apartment.features.slice(0, 2).map((feature, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {apartment.features.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{apartment.features.length - 2} más
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-500">
                      ⭐⭐⭐⭐⭐
                      <span className="text-sm text-gray-600 ml-1">(4.9)</span>
                    </div>
                    <div className="text-primary-500 font-medium group-hover:text-primary-600 transition-colors">
                      Ver detalles →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesitas ayuda para elegir?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Sandra IA puede ayudarte a encontrar el alojamiento perfecto
          </p>
          <Link 
            href="/sandra" 
            className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Hablar con Sandra IA 🤖
          </Link>
        </div>
      </section>
    </div>
  );
}