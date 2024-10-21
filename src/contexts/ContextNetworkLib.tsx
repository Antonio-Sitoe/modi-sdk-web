'use client'
// offline
import 'offline-js'
import 'offline-js/themes/offline-theme-chrome.css'
import 'offline-js/themes/offline-language-portuguese-brazil.css'

import { useEffect } from 'react'
import { useNDAModi } from './step-state'

function ContextNetworkLib() {
  const { setIsOnline } = useNDAModi()

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof Offline !== 'undefined') {
      const handleOnline = () => {
        console.log('Online')
        setIsOnline(true)
      }

      const handleOffline = () => {
        console.log('Offline')
        setIsOnline(false)
      }

      Offline.options = {
        checkOnLoad: true,
        interceptRequests: true,
        reconnect: {
          initialDelay: 3,
          delay: 10,
        },
      }

      Offline.on('up', handleOnline)
      Offline.on('down', handleOffline)

      return () => {
        Offline.off('up', handleOnline)
        Offline.off('down', handleOffline)
      }
    }
  }, [setIsOnline])
  return <div />
}

export default ContextNetworkLib
