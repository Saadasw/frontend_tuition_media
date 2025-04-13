/*
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Temporary mock signup - stores in localStorage
    localStorage.setItem('token', 'dummy-token')
    localStorage.setItem('user', JSON.stringify({ email }))
    router.push('/dashboard')
  }
*/

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import axios from 'axios'

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Hello")

       e.preventDefault();
       await authApi.signup(email, password);
          // Prepare the form data for submission
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    // Post login request to FastAPI
    const response = await axios.post(
      'http://127.0.0.1:8000/login', 
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',  // Sending form data
        },
      }
    );
      
      // Store the token
      localStorage.setItem('token', response.data.access_token);
      router.push('/dashboard');
    
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  )
}