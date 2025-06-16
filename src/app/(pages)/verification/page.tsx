'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import { setUser, clearUser } from '@/store/userSlice';
import { useDispatch, useSelector } from 'react-redux'
import BackToLogin from '@/app/(components)/backToLogin';

export default function Page() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user)

  const [email, setEmail] = useState(user.email);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [error2, setError2] = useState('');

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = JSON.stringify({
      email,
      code,
    }).toString();

    try {
      const res = await fetch(`${process.env.remote_connection || process.env.local_connection}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        if(data.detail == "ALREADY_ACTIVATED"){
          setError('This account is already activated, going back to login page');
          setTimeout(() => router.push('/dashboard'), 3000)
        }
        else {
          throw new Error(data.message || 'Verification failed');
        }
      }
      else {
        setError('');
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    }
    
  };

  const isEnteredCode = () => {
    return code.length >= 6
  }

  const resendVerificationCode = async () => {
    const body = JSON.stringify({
      email
    }).toString();

    try {
      const res = await fetch(`${process.env.remote_connection || process.env.local_connection}/auth/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
        credentials: 'include',
      });

      if (!res.ok) {
        if(res.status == 429) {
          setError2('Too many request, please wait ');
        }
        const data = await res.json();
        throw new Error(data.message || 'Resend verification code failed, please check your email entered.');
      }
      else {
        setError2('');
      }
    } catch (err: any) {
      
      setError2(err.message);
    }
    
  };

  return (
    <div className='flex flex-col w-full content-center items-center'>
      <div className='bg-white px-10 py-10 rounded-2xl flex flex-col'>
        <div className='md:w-md'>
        <h1 className='text-green-800 font-bold basis-1/2'>Your account is not activated, please enter your verification code sent to your email to activate your account.</h1>
        </div>
        <form className="flex flex-col space-y-6 mt-5 mb-10 md:w-md" onSubmit={handleVerify}>
          <input
            className="px-2 border-solid border rounded-lg py-2 border-teal-700 placeholder-teal-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
          />
          <input
            className="px-2 border-solid border rounded-lg py-2 border-teal-700 placeholder-teal-900"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Verification Code"
          />
          <button
            disabled={!isEnteredCode() || !isValidEmail(email)}
            className={`
              bg-teal-500
              disabled:opacity-50
              enabled:hover:bg-teal-700
              text-white
              flex flex-row py-1 px-3 mb-2 rounded-lg bg-blue items-center justify-center dark:bg-blueDark`}
            type="submit"
          >
            Verify
          </button>
          {error && <p className='text-teal-900'>{error}</p>}
        </form>
        
        <div className='md:w-md'>
          <button
            onClick={resendVerificationCode}
            disabled={!isValidEmail(email)}
            className={`
              w-full
              bg-teal-500
              disabled:opacity-50
              enabled:hover:bg-teal-700
              text-white
              flex flex-row py-1 px-3 mb-2 rounded-lg bg-blue items-center justify-center dark:bg-blueDark`}
          >
            Resend Verification Code
          </button>
          <BackToLogin></BackToLogin>
          {error2 && <p className='text-teal-900'>{error2}</p>}
        </div>
      </div>
      
    </div>
  );
}
