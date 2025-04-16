import React, { useState } from 'react';
import axios from 'axios';

interface PlaceBidButtonProps {
  circularId: number;
  onBidPlaced?: () => void;
  className?: string;
}

export default function PlaceBidButton({ circularId, onBidPlaced, className = '' }: PlaceBidButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [proposal, setProposal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      await api.post(`/circulars/${circularId}/bids`, {
        proposal: proposal
      });
      
      setProposal('');
      setIsOpen(false);
      if (onBidPlaced) onBidPlaced();
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Circular not found');
      } else if (err.response?.status === 401) {
        setError('You must be logged in to place a bid');
      } else {
        setError(err.response?.data?.detail || 'Failed to place bid');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Place Bid
        </button>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium mb-2">Submit Your Proposal</h4>
          <form onSubmit={handleSubmit}>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Describe your proposal..."
              className="w-full p-2 border rounded mb-3 min-h-24"
              required
            />
            
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Bid'}
              </button>
              
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}