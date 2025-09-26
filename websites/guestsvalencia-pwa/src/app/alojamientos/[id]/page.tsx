import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ApartmentDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  bedrooms: number;
  maxGuests: number;
  features: string[];
  amenities: string[];
  location: {
    address: string;
    district: string;
    nearbyAttractions: string[];
  };
  checkIn: string;
  checkOut: string;
}

const apartments: Record<number, ApartmentDetail> = {
  1: {
    id: 1,
    title: 'Apartamento Centro Premium',
    description: 'Moderno apartamento completamente renovado en el corazón histórico de Valencia. Ubicado a pocos minutos de la Catedral, el Mercado Central y las principales atracciones turísticas. Perfecto para explorar la ciudad a pie.',
    price: 85,
    images: ['/alojamientos/apartment1.jpg', '/alojamientos/apartment2.jpg'],
    bedrooms: 2,
    maxGuests: 4,
    features: ['WiFi Premium 100Mbps', 'Aire Acondicionado', 'Cocina Completa', 'Check-in Automático'],
    amenities: ['Smart TV 55"', 'Lavavajillas', 'Lavadora/Secadora', 'Plancha', 'Secador de pelo', 'Ropa de cama premium'],
    location: {
      address: 'Calle del Centro, 15',
      district: 'Ciutat Vella',
      nearbyAttractions: ['Catedral de Valencia (200m)', 'Mercado Central (300m)', 'Lonja de la Seda (400m)', 'Plaza de la Virgen (250m)']
    },
    checkIn: '15:00',
    checkOut: '11:00'
  },
  2: {
    id: 2,
    title: 'Estudio Moderno Valencia',
    description: 'Acogedor estudio de diseño moderno, ideal para parejas o viajeros de negocios. Totalmente equipado con todas las comodidades necesarias para una estancia perfecta en Valencia.',
    price: 65,
    images: ['/alojamientos/apartment2.jpg', '/alojamientos/apartment1.jpg'],
    bedrooms: 1,
    maxGuests: 2,
    features: ['WiFi Premium', 'Smart TV', 'Zona de Trabajo', 'Ubicación Céntrica'],
    amenities: ['Escritorio ergonómico', 'Cafetera Nespresso', 'Microondas', 'Nevera', 'Caja fuerte', 'Ducha de lluvia'],
    location: {
      address: 'Avenida del Puerto, 28',
      district: 'El Carmen',
      nearbyAttractions: ['Torres de Serranos (150m)', 'Jardín del Turia (100m)', 'IVAM (300m)', 'Plaza del Carmen (200m)']
    },
    checkIn: '16:00',
    checkOut: '11:00'
  }
};

export default function ApartmentDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const apartment = apartments[id];

  if (!apartment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-500">Inicio</Link>
            <span>→</span>
            <Link href="/alojamientos" className="hover:text-primary-500">Alojamientos</Link>
            <span>→</span>
            <span className="text-gray-900">{apartment.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Images */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  {apartment.images.map((image, index) => (
                    <div key={index} className="aspect-video bg-gradient-to-r from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                      <span className="text-6xl">🏠</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title and Description */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{apartment.title}</h1>
                <div className="flex items-center gap-4 text-gray-600 mb-6">
                  <span>{apartment.bedrooms} habitación{apartment.bedrooms > 1 ? 'es' : ''}</span>
                  <span>•</span>
                  <span>Hasta {apartment.maxGuests} huéspedes</span>
                  <span>•</span>
                  <span>{apartment.location.district}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 mb-6">
                  ⭐⭐⭐⭐⭐
                  <span className="text-gray-600 ml-2">(4.9) • 127 reseñas</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{apartment.description}</p>
              </div>

              {/* Features and Amenities */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Características y Comodidades</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Características Destacadas</h3>
                    <ul className="space-y-3">
                      {apartment.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Comodidades</h3>
                    <ul className="space-y-3">
                      {apartment.amenities.map((amenity, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ubicación</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{apartment.location.address}</h3>
                    <p className="text-gray-600">{apartment.location.district}, Valencia</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Atracciones Cercanas</h4>
                    <ul className="space-y-2">
                      {apartment.location.nearbyAttractions.map((attraction, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-700">
                          <span className="text-primary-500">📍</span>
                          {attraction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">€{apartment.price}</div>
                  <div className="text-gray-600">por noche</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                      <input type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                      <div className="text-xs text-gray-500 mt-1">Desde las {apartment.checkIn}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                      <input type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                      <div className="text-xs text-gray-500 mt-1">Hasta las {apartment.checkOut}</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Huéspedes</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      {Array.from({ length: apartment.maxGuests }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} huésped{i > 0 ? 'es' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button className="w-full btn btn-primary py-4 text-lg font-semibold mb-4">
                  Reservar Ahora
                </button>

                <div className="text-center text-sm text-gray-600 mb-4">
                  No se cobrará hasta confirmar
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>€{apartment.price} x 3 noches</span>
                    <span>€{apartment.price * 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasas de limpieza</span>
                    <span>€25</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t pt-2">
                    <span>Total</span>
                    <span>€{apartment.price * 3 + 25}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                  <div className="flex items-center gap-3 text-primary-700">
                    <span className="text-lg">🤖</span>
                    <div>
                      <p className="font-medium">¿Necesitas ayuda?</p>
                      <p className="text-sm">Sandra IA puede resolver tus dudas</p>
                    </div>
                  </div>
                  <Link href="/sandra" className="btn btn-primary w-full mt-3 text-sm">
                    Hablar con Sandra IA
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}