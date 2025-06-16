'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { setUser, clearUser } from '@/store/userSlice';
import { useDispatch } from 'react-redux';
import BackToLogin from '@/app/(components)/backToLogin';

export default function Page() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useDispatch()
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new URLSearchParams()
    const origin = window.location.origin;
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('domain', origin)
    try {
      const res = await fetch(`${process.env.remote_connection || process.env.local_connection}/auth/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Account creation failed')
      }

      setError('')
      setSuccess('Account created! Redirecting to login...')
      dispatch(setUser({ email:  email, username: username }))
      setTimeout(() => router.push('/verification'), 1500)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPassword = (pw: string) => /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(pw)
  useEffect(()=>{
    if (!email || !password || !confirmPassword || !username){
      setError('')
      setIsFormValid(false);
    }
    else if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsFormValid(false);
    }
    else if (!isValidEmail(email)){
      setError('Email is not valid')
      setIsFormValid(false);
    }
    else if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters, contain an uppercase letter, and a special character.')
      setIsFormValid(false);
    }
    else if (isValidEmail(username)){
      setError('Username should not be an email')
      setIsFormValid(false);
    }
    else{
      setError('')
      setIsFormValid(true)
    }
  },[password, confirmPassword, email, username])


  return (
    <div className='flex flex-col w-full content-center items-center'>
      <div className='bg-white px-10 py-10 rounded-2xl flex flex-col'>
        <h1 className='text-green-800 font-bold'>Create a new account</h1>
        <form className="flex flex-col space-y-6 my-10 md:w-md" onSubmit={handleCreateAccount}>
        <input
          className="px-2 border-solid border rounded-lg py-2 border-teal-700 placeholder-teal-900"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="px-2 border-solid border rounded-lg py-2 border-teal-700 placeholder-teal-900"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="px-2 border-solid border rounded-lg py-2 border-teal-700 placeholder-teal-900"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          className="px-2 border-solid border rounded-lg py-2 border-teal-700 placeholder-teal-900"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
        />
        <button
          disabled={!isFormValid}
          className="bg-teal-500 enabled:hover:bg-teal-700 disabled:opacity-50 text-white flex flex-row py-1 px-3 mb-2 rounded-lg items-center justify-center"
          type="submit"
        >
          Create Account
        </button>
        {error && <p className='text-teal-900'>{error}</p>}
        {success && <p className='text-green-700'>{success}</p>}
        </form>
        <div className='md:w-md my-10'>
          <BackToLogin></BackToLogin>
        </div>
      </div>
      
    </div>
  )
}
