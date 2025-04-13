'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { circularApi } from '@/lib/api';

export default function NewCircularPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      //const { data } = await circularApi.create(title, description);
      
      await circularApi.create(title, description);
      const  data  = await circularApi.getAll();
      console.log(data.data);
      
      //router.push(`/circulars/${data.id}`);
    } catch (err) {
      //setError(err.response?.data?.detail || 'Failed to create circular');
      console.log("Error in getAll circulars");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Circular</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title*</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md min-h-[120px]"
            maxLength={500}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Circular
          </button>
        </div>
      </form>
    </div>
  );
}