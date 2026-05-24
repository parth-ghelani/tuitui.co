import { useEffect } from 'react'
import Lenis from 'lenis'

export function useLenis() {
  useEffect(() => {
    // Disable smooth scroll on macOS/iOS devices as they have native, hardware-accelerated momentum trackpad/touch scrolling.
    const isMac = typeof window !== 'undefined' && 
      (navigator.platform?.toUpperCase().indexOf('MAC') >= 0 || 
       navigator.userAgent?.indexOf('Mac') !== -1 ||
       /iPad|iPhone|iPod/.test(navigator.userAgent))
    
    if (isMac) return

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    })

    // Expose for components that need to temporarily pause/resume smooth scrolling.
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      ;(window as unknown as { __lenis?: Lenis }).__lenis = undefined
    }
  }, [])
}
