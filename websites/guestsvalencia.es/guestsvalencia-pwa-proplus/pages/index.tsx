import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Guests Valencia</title>
        <meta name="description" content="Alojamientos turísticos y Sandra IA" />
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a Guests Valencia</h1>
        <p className="mb-6 text-lg text-center">
          Descubre nuestros alojamientos turísticos en Valencia y disfruta de Sandra IA.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md">
          Explorar Alojamientos
        </button>
      </main>
    </div>
  )
}
