import { useSystem } from '@/contexts/useSystem'
import { cn } from '@/lib/utils'
import React, { CSSProperties } from 'react'

// Tipagem para os props do componente Typegrapth
interface TypegrapthProps {
  text: string
  className?: string
  style?: CSSProperties
}

// Tipagem para os props do componente TypegrapthH1
interface TypegrapthH1Props {
  text: string
  className?: string
}

function Typegrapth({ text, className, style }: TypegrapthProps) {
  return (
    <p style={style} className={className}>
      {text}
    </p>
  )
}

function TypegrapthH1({ text, className }: TypegrapthH1Props) {
  const { theme } = useSystem()
  return (
    <h1
      style={{
        color: theme.text,
      }}
      className={cn('font-montSerrat text-lg font-normal', className)}
    >
      {text}
    </h1>
  )
}

export { Typegrapth, TypegrapthH1 }
