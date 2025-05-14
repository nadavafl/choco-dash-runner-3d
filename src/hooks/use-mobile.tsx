
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Function to check if device is mobile
    const checkIsMobile = () => {
      // Check for touch capabilities
      const hasTouchCapability = 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - For older browsers
        navigator.msMaxTouchPoints > 0
      
      // Check screen width - either small screen or has touch capability
      const isMobileDevice = window.innerWidth < MOBILE_BREAKPOINT || hasTouchCapability
      
      setIsMobile(isMobileDevice)
      console.log("Device detected as:", isMobileDevice ? "mobile" : "desktop", 
                  "Width:", window.innerWidth, 
                  "Touch capable:", hasTouchCapability,
                  "User agent:", navigator.userAgent)
    }

    // Check initially
    checkIsMobile()
    
    // Set up listeners for changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", checkIsMobile)
    
    // Clean up
    return () => mql.removeEventListener("change", checkIsMobile)
  }, [])

  return !!isMobile
}
