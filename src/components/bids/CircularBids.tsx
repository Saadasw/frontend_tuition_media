import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Bid {
  id: number;
  circular_id : number;
  tutor_email: string;
  proposal: string;
  status: string;
}

interface BidsDisplayProps {
  circularId: number;
}

export default function BidsDisplay({ circularId }: BidsDisplayProps) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/circulars/${circularId}/bids`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setBids(response.data);
      } catch (err: any) {
        setError('Could not load bids');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [circularId]);

  if (loading) return <div>Loading bids...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (bids.length === 0) return <div>No bids found for this circular.</div>;

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-3">Bids</h2>
      <div className="space-y-3">
        {bids.map(bid => (
          <div key={bid.id} className="border p-3 rounded">
            <p><strong>Bid ID:</strong> {bid.id}</p>
            <p><strong>Circular ID:</strong> {bid.circular_id}</p>
            <p><strong>From:</strong> {bid.tutor_email}</p>
            <p><strong>Proposal:</strong> {bid.proposal}</p>
            <p><strong>Status:</strong> {bid.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}