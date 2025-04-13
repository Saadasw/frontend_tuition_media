'use client'
import { useParams } from 'next/navigation'
import BidCard from '@/components/bids/BidCard'

// Mock data
const mockBids = [
  { id: 1, proposal: 'I can help with math', tutor_email: 'tutor1@example.com' },
  { id: 2, proposal: 'Math expert here', tutor_email: 'tutor2@example.com' },
]

export default function CircularPage() {
  const params = useParams()
  const circularId = params.id

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Circular #{circularId}</h1>
      <div className="space-y-4">
        {mockBids.map(bid => (
          <BidCard key={bid.id} bid={bid} />
        ))}
      </div>
    </div>
  )
}