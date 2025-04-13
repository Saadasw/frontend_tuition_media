/*
import Link from 'next/link'

interface Circular {
  id: number
  title: string
  user_email: string
  description: string
}

export default function CircularCard({ circular }: { circular: Circular }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">{circular.title}</h2>
      <p className="text-gray-600 text-sm">Posted by: {circular.user_email}</p>
      <p className="text-gray-600 text-sm">Posted by: {circular.description}</p>
      <Link 
        href={`/circulars/${circular.id}`}
        className="mt-2 inline-block text-blue-500 hover:underline"
      >
        View Details
      </Link>
    </div>
  )
}*/
// components/circulars/CircularCard.tsx
import { Circular } from '@/lib/api'
import Link from 'next/link'

interface Props {
  circular: Circular
}

export default function CircularCard({ circular }: Props) {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">{circular.title}</h3>
      {circular.description && (
        <p className="text-gray-600 mt-2">{circular.description}</p>
      )}
      <div className="mt-3 flex justify-between text-sm text-gray-500">
        <span>Posted by: {circular.user_email}</span>
        <Link 
          href={`/circulars/${circular.id}`}
          className="text-blue-500 hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}