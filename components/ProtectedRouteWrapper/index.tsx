import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/authContext'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push('/signin')
        }
    }, [router, user])

    return <>{user ? children : null}</>
}

export default ProtectedRoute
