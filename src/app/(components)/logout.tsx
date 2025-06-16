'use client'

import Button from "./button"

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch(`${process.env.remote_connection || process.env.local_connection}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Important so cookies are sent
    })
    window.location.href = '/login'
  }

  return <Button onClick={handleLogout} text="Logout"></Button>
}