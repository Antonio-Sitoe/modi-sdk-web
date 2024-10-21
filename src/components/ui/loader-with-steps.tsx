'use client'

import { cn } from '@/lib/utils'
import { useNDAModi } from '@/contexts/step-state'
import { Button } from './button'
import { cancelTokenManager } from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useSystem } from '@/contexts/useSystem'

interface Props {
  open?: boolean
  title?: string
}

function LoaderRoot({
  open,
  children,
}: {
  open: boolean
  children: React.ReactNode
}) {
  const [showCancelButton, setShowCancelButton] = useState(false)
  const { setIsLoading, isOnline } = useNDAModi()
  const poweredBy = useSystem()?.modiConfig?.assets?.poweredBy
  const companyLogo = useSystem()?.modiConfig?.assets?.logo
  const theme = useSystem()?.theme

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (open) {
      timer = setTimeout(() => {
        setShowCancelButton(true)
      }, 5000) // 5 segundos em milissegundos
    } else {
      setShowCancelButton(false)
    }

    return () => {
      clearTimeout(timer)
      setShowCancelButton(false)
    }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 bg-white cursor-wait pointer-events-auto z-1000">
      <div className="loader-container fixed inset-0 flex flex-col h-full justify-center items-center z-100">
        <div className="fixed top-9 z-100 rounded-full w-full flex items-center justify-center">
          {isOnline && (
            <img
              width={100}
              height={80}
              src={companyLogo}
              alt="company logotipo"
            />
          )}
        </div>
        <div className="gap-3 h-full flex flex-col justify-center">
          <div className="loading-text text-black font-medium mt-8 grid gap-4 px-3">
            {children}
            <div
              style={{
                borderColor: theme.primary,
                borderTopColor: 'white',
              }}
              className="loader border-[3px] border-t-transparent rounded-full w-6 h-6 animate-spin mx-auto mt-6"
            />
          </div>
          <span
            style={{
              color: theme.textAlt,
              borderTopColor: 'white',
            }}
            className="text-sm text-center mt-24"
          >
            Esse processo pode demorar alguns minutos
          </span>
          {showCancelButton && (
            <Button
              variant="outline"
              type="button"
              className="mt-8 w-full sm:max-w-full max-w-48 mx-auto"
              style={{
                color: theme?.destructive,
              }}
              onClick={() => {
                cancelTokenManager.cancelAll()
                setIsLoading({ isLoad: false, title: '' })
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
        <div className="fixed bottom-6 z-1000 rounded-full w-full flex items-center justify-center">
          {isOnline && (
            <img width={160} height={80} src={poweredBy} alt="powered logo" />
          )}
        </div>
      </div>
    </div>
  )
}

function LoadImage({ img }: { img?: string }) {
  const { isOnline } = useNDAModi()
  return (
    <div className="text-center mx-auto mb-5 sm:hidden flex">
      {isOnline && (
        <img src={img || '/WarnQuestion.svg'} width={40} height={40} alt="" />
      )}
    </div>
  )
}
function LoadCheck({ check, title }: { check: boolean; title: string }) {
  const { isOnline } = useNDAModi()
  const checkimg = useSystem().modiConfig.assets.check

  return (
    <p className="text-black font-normal flex items-start gap-3">
      <div
        className={cn(
          'w-6 h-6 border-[#888888] bg-white rounded-full flex items-center justify-center',
          !check && 'border',
        )}
      >
        {check && (
          <>
            {isOnline && <img src={checkimg} width={20} height={20} alt="" />}
          </>
        )}
      </div>
      {title}
    </p>
  )
}

function LoadTitle({ children }: { children: string }) {
  return <h3 className="text-center mb-5">{children}</h3>
}

function Loader({ open, title = 'Carregando dados' }: Props) {
  const { isLoading } = useNDAModi()
  const isOpen = isLoading.isLoad || open
  if (isOpen)
    return (
      <LoaderRoot open={isOpen}>
        <LoadImage />
        <LoadTitle>{isLoading.title || title}</LoadTitle>
      </LoaderRoot>
    )
  else return null
}

export { LoaderRoot, LoadTitle, LoadCheck, LoadImage, Loader }
