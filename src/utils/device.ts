'use client'

export function isMobile() {
  if (typeof window !== 'undefined') {
    const userAgent = navigator.userAgent || navigator.vendor

    if (/android/i.test(userAgent)) {
      return true
    }
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return true
    }
    if (/windows phone/i.test(userAgent)) {
      return true
    }
    if (
      /Mobile|Tablet|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Silk|Opera Mini|Fennec|Windows Phone|Kindle/i.test(
        userAgent,
      )
    ) {
      return true
    }
  }
  return false
}
