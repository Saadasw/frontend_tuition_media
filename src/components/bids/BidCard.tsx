interface Bid {
    id: number
    proposal: string
    tutor_email: string
  }
  
  export default function BidCard({ bid }: { bid: Bid }) {
    return (
      <div className="p-4 border rounded-lg">
        <p className="text-gray-800">{bid.proposal}</p>
        <p className="text-sm text-gray-500 mt-1">From: {bid.tutor_email}</p>
        <button className="mt-2 text-sm bg-green-100 text-green-800 px-3 py-1 rounded">
          Accept Bid
        </button>
      </div>
    )
  }