/* eslint-disable @typescript-eslint/ban-ts-comment */
import './globals.css'

import { useEffect, useState, StrictMode } from 'react'
import { SystemStorage } from '@/contexts/useSystem'
import { getCompanySettings } from '@/actions/server'
import NotFoundSubscriber from './not-found'

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './app'
import Register from './register_aditional_data'
import ShowData from './show_data'
import FaceRecogntianLiveness from './liveness'
import { SystemConfiguration } from '@/@types/types'
import Loading from './loading'
import ChooseFlowPage from './scanQrcode'
import Message from './message'
import FaceAndDocs from './ocr'

export function RootLayout() {
  const params = new URLSearchParams(window.location.search)
  const companyId = params.get('companyId')

  console.log(companyId)
  const [data, setData] = useState<null | SystemConfiguration>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchCompanySettings(companyId: string) {
      const { data, error } = await getCompanySettings(companyId)

      if (error || !data) {
        setError(true)
        return
      }
      if (data) {
        setData(data)
      }
    }
    if (companyId) {
      fetchCompanySettings(companyId)
    }
  }, [companyId])

  useEffect(() => {
    if (data) {
      const docScript = document.createElement('script')
      // @ts-ignore
      docScript.src = data?.apiEndpoints?.ocrSdk
      docScript.type = 'module'
      docScript.crossOrigin = 'anonymous'
      document.head.appendChild(docScript)

      const livenessScript = document.createElement('script')
      // @ts-ignore
      livenessScript.src = data?.apiEndpoints?.livenessSdk
      livenessScript.type = 'module'
      livenessScript.crossOrigin = 'anonymous'
      document.head.appendChild(livenessScript)

      return () => {
        document.head.removeChild(docScript)
        document.head.removeChild(livenessScript)
      }
    }
  }, [data])

  if (error || !companyId) {
    return <NotFoundSubscriber />
  }

  if (!data) {
    return <Loading />
  }

  return (
    <BrowserRouter>
      <SystemStorage systemConfig={data} companyId={companyId}>
        <div className={`font-montSerrat h-dvh`}>
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="liveness" element={<FaceRecogntianLiveness />} />
            <Route path="show_data" element={<ShowData />} />
            <Route path="scanQrcode" element={<ChooseFlowPage />} />
            <Route path="ocr" element={<FaceAndDocs />} />
            <Route path="message" element={<Message />} />
            <Route path="register_aditional_data" element={<Register />} />
            <Route path="*" element={<NotFoundSubscriber />} />
          </Routes>
        </div>
      </SystemStorage>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootLayout />
  </StrictMode>
)
