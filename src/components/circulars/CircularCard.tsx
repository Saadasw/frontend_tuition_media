import Link from 'next/link'

interface Circular {
  id: number
  title: string
  user_email: string
}

export default function CircularCard({ circular }: { circular: Circular }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">{circular.title}</h2>
      <p className="text-gray-600 text-sm">Posted by: {circular.user_email}</p>
      <Link 
        href={`/circulars/${circular.id}`}
        className="mt-2 inline-block text-blue-500 hover:underline"
      >
        View Details
      </Link>
    </div>
  )
}