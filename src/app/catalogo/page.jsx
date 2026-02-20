"use client"

import { useState, useEffect } from "react"
import AddPecas from "@/components/AddPecas"
import NavHome from "@/components/NavHome"

function Catalogo() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUser()
    }, [])

    async function fetchUser() {
        try {
            const response = await fetch('/api/v1/auth/session', {
                credentials: 'include',
            })
            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
            }
        } catch (error) {
            console.error('Failed to fetch user:', error)
        } finally {
            setLoading(false)
        }
    }

    const isAdmin = user?.role === 'admin'

    return ( 
        <>
             <NavHome />
             {isAdmin && !loading && <AddPecas />}
             
        </>
     )
}

export default Catalogo