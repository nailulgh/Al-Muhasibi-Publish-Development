"use client"
import { useEffect } from 'react'
import 'aos/dist/aos.css'

export const AosInit = () => {
    useEffect(() => {
        const initAOS = async () => {
            const AOS = (await import('aos')).default;
            AOS.init({
                duration: 800,
                once: true,
                offset: 50,
                easing: 'ease-out-cubic',
            })
        };
        
        if (typeof window !== 'undefined') {
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(initAOS, { timeout: 2000 })
            } else {
                setTimeout(initAOS, 200)
            }
        }
    }, [])
    return null
}
