'use client'

import { useEffect, useState } from 'react'
import { requestForToken, onMessageListener } from '@/lib/firebase'
import { toast } from 'sonner'

export function useNotifications() {
    const [notification, setNotification] = useState<{ title: string; body: string } | null>(null)

    useEffect(() => {
        // Solicitar permissão e pegar token ao montar
        if (typeof window !== 'undefined' && 'Notification' in window) {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    requestForToken()
                }
            })
        }

        // Ouvinte de mensagens em primeiro plano
        const listen = async () => {
            const payload: any = await onMessageListener()
            if (payload) {
                setNotification({
                    title: payload.notification.title,
                    body: payload.notification.body
                })
                
                toast.info(payload.notification.title, {
                    description: payload.notification.body,
                })
            }
        }

        listen()
    }, [])

    return { notification }
}
