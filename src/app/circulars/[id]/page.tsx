'use client'
import BidsDisplay from '../../../components/bids/CircularBids';
import { useParams } from 'next/navigation'


export default function CircularPage() {
  // Get the circular ID from whatever source (URL params, props, etc.)
  const params = useParams();
  const circularId = Number(params.id); // Replace with actual ID source
  
  return (
    <div>
      <h1>Circular Details</h1>
      {/* Other circular details */}
      
      <BidsDisplay circularId={circularId} />
    </div>
  );
}