import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Bid {
  id: number;
  circular_id: number;
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
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);

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

  const handleAcceptBid = async (bidId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/circulars/${circularId}/bids/${bidId}/accept`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBids(bids.map(bid => bid.id === bidId ? { ...bid, status: 'accepted' } : bid));
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeclineBid = async (bidId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/circulars/${circularId}/bids/${bidId}/decline`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBids(bids.map(bid => bid.id === bidId ? { ...bid, status: 'declined' } : bid));
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleShowDetails = (bid: Bid) => {
    setSelectedBid(bid);
  };

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
            <button onClick={() => handleAcceptBid(bid.id)}>Accept</button>
            <button onClick={() => handleDeclineBid(bid.id)}>Decline</button>
            <button onClick={() => handleShowDetails(bid)}>Show Details</button>
          </div>
        ))}
      </div>
      {selectedBid && (
        <div className="mt-4">
          <h3>Bid Details</h3>
          <p><strong>Bid ID:</strong> {selectedBid.id}</p>
          <p><strong>Circular ID:</strong> {selectedBid.circular_id}</p>
          <p><strong>From:</strong> {selectedBid.tutor_email}</p>
          <p><strong>Proposal:</strong> {selectedBid.proposal}</p>
          <p><strong>Status:</strong> {selectedBid.status}</p>
        </div>
      )}
    </div>
  );
}


/*
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
  */