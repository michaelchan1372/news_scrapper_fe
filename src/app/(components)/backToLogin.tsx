import { useRouter } from 'next/navigation'
export default function BackToLogin() {
    const router = useRouter()
    const backToLogin = () => {
    router.push('/login')
  }
    return <button 
        onClick={backToLogin}
        className={`w-full bg-teal-500 hover:bg-teal-700 text-white
        flex flex-row py-1 px-3 mb-2 rounded-lg bg-blue items-center justify-center dark:bg-blueDark`}>
        Back to Login
    </button>
}