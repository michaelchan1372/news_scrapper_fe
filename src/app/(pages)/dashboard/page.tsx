'use client';
import { SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  useEffect(() => {
    fetch(`${process.env.remote_connection || process.env.local_connection}/navigation/dashboard`, 
      {credentials: "include"})
      .then((res) => res.json())
      .then((res) => {
          router.push(res[0].path)
        }
      )
      .catch(console.error);
  }, []);
  return <div>
      Loading...
    </div>
}