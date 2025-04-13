'use client'
import Link from 'next/link'
import CircularCard from '@/components/circulars/CircularCard'

// Mock data
const mockCirculars = [
  { id: 1, title: 'Math Tutor Needed', user_email: 'parent@example.com' },
  { id: 2, title: 'Science Homework Help', user_email: 'student@example.com' },
]

export default function Dashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <Link href="/circulars/new" className="bg-green-500 text-white px-4 py-2 rounded">
          Create New
        </Link>
      </div>
      <div className="space-y-4">
        {mockCirculars.map(circular => (
          <CircularCard key={circular.id} circular={circular} />
        ))}
      </div>
    </div>
  )
}