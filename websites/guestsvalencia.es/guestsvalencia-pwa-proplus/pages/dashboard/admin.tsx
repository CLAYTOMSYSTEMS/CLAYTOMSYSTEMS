import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminDashboard() {
  const [listings, setListings] = useState<any[]>([])

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase.from('listings').select('*')
      setListings(data || [])
    }
    fetchListings()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <ul>
        {listings.map(listing => (
          <li key={listing.id} className="border-b py-2">
            {listing.title} - {listing.price}€
          </li>
        ))}
      </ul>
    </div>
  )
}
