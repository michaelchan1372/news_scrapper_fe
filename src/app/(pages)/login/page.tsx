'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { setUser, clearUser } from '@/store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function Page() {
  const router = useRouter()
  const user = useSelector((state: RootState) => state.user)
  const [username, setUsername] = useState(user.email || user.username)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useDispatch()
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPassword = (pw: string) => /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(pw)
  useEffect(()=>{
      if ( !password || !username){
        setError('')
        setIsFormValid(false);
      }
      else if (!isValidPassword(password)) {
        setIsFormValid(false);
      }
      else{
        setIsFormValid(true)
      }
    },[password, username])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!isValidEmail(username)) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    const body = new URLSearchParams({
      username,
      password,
    }).toString()

    try {
      const res = await fetch(`${process.env.remote_connection || process.env.local_connection}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
        credentials: 'include',
      })
    
      if (!res.ok) {
        if(res.status == 429) {
          throw new Error('Too many request, please wait ');
        }
        const data = await res.json()
        if(data.detail == "user not active"){
          dispatch(setUser({ email:  username, username: username }))
          setTimeout(() => router.push('/verification'), 1500)
        }
        else {
          throw new Error(data.detail || 'Login failed')
        }
      }
      setError("")
      router.push('/dashboard')
    } catch (err: any) {
      console.log(err)
      setError(err.message)
    }
  }

  const routeCreateAccount = () => {
    router.push('/create_account')
  }
  const routeVerification = () => {
    router.push('/verification')
  }

  return <div className='flex flex-col w-full content-center items-center'>
    <div className='bg-white px-10 py-10 rounded-2xl flex flex-col'>
        <div className='flex flex-row'>
          <h1 className='text-green-800 font-bold basis-1/2'>Welcome!</h1>
          <div className='basis-1/2 flex flex-row-reverse'>
            <button 
            onClick={routeVerification}
            className={`
            text-xs
            px-2
            rounded
            bg-teal-500
            hover:bg-teal-700
            text-white
            py-1 rounded bg-blue 
            dark:bg-blueDark`}>
            Verfiy your account
            </button>
          </div>
        </div>
        
        <form className="flex flex-col space-y-6 my-10 md:w-md" onSubmit={handleLogin} >
        <input 
        className="px-2 border-solid border rounded-lg py-2 border-teal-700 placeholder-teal-900"
        value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input 
          className="px-2 border-solid border rounded-lg py-2 border-teal-700 placeholder-teal-900"
          type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button 
        disabled={!isFormValid}
        className={`
          bg-teal-500
          enabled:hover:bg-teal-700 
          disabled:opacity-50
          text-white
          flex flex-row py-1 px-3 mb-2 rounded-lg bg-blue items-center justify-center dark:bg-blueDark`}
        type="submit">Login</button>
        
        {error && <p className='text-teal-900'>{error}</p>}
      </form>
      <hr className='md:w-md border-t-1 border-solid py-2 border-teal-700 '/>
      <div className='md:w-md my-10'>
        <button 
        onClick={routeCreateAccount}
        className={`
          w-full
          bg-teal-500
          hover:bg-teal-700
          text-white
          flex flex-row py-1 px-3 mb-2 rounded-lg bg-blue items-center justify-center dark:bg-blueDark`}
        >Create Account
        </button>
      </div>
    </div>
  </div>
}
