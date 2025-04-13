'use client'
import Link from 'next/link'
import CircularCard from '@/components/circulars/CircularCard'
import { Circular, circularApi } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        const data = await circularApi.getAll()
        setCirculars(data.data)
      } catch (err) {
        setError('Failed to load circulars')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCirculars()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <Link 
          href="/circulars/new" 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create New
        </Link>
      </div>
      <div className="space-y-4">
        {circulars.map((circular: Circular) => (
          <CircularCard key={circular.id} circular={circular} />
        ))}
      </div>
    </div>
  )
}