'use client';

import { useState } from 'react';

export default function SearchIA() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Buscar: ${query}` }],
          role: 'search'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResults([data.content]);
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setResults(['Error al realizar la búsqueda']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar alojamientos, servicios, información..."
            className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-2 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              '🔍'
            )}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Resultados de búsqueda</h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{result}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Search Suggestions */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Búsquedas populares:</h4>
        <div className="flex flex-wrap gap-2">
          {[
            'Apartamentos centro Valencia',
            'Check-in automático',
            'Precios temporada alta',
            'Servicios incluidos',
            'Disponibilidad fin de semana'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setQuery(suggestion)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}