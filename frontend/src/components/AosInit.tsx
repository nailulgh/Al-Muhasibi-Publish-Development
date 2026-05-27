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
            })
        };
        initAOS();
    }, [])
    return null
}
