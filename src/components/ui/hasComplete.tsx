import React from 'react'
import { Button } from './button'
import { useSystem } from '@/contexts/useSystem'
import { Typegrapth, TypegrapthH1 } from './Typography'

function HasCompleteProcess({
  goPrev,
  goNext,
  title = 'Processo concluído!',
  description = 'Seu pedido foi processado com sucesso.',
}: {
  goPrev(): void
  goNext(): void
  title?: string
  description?: string
}) {
  const { modiConfig } = useSystem()
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col items-center justify-center h-full bg-background px-4 py-12">
        <div className="max-w-[300px] w-full">
          <img
            src={modiConfig.assets.sucessIcon}
            width={80}
            height={80}
            alt="Process Complete"
            className="mx-auto"
          />
          <div className="mt-6 text-center">
            <TypegrapthH1 text={title} />
            <Typegrapth text={description} className="mt-2" />
          </div>
        </div>
      </div>
      <div className="max-w-lg mx-auto w-full grid grid-cols-2 gap-6 mt-10">
        <Button onClick={goPrev} onTouchEnd={goPrev} variant="outline">
          Voltar
        </Button>
        <Button onClick={goNext} onTouchEnd={goNext}>
          Continuar
        </Button>
      </div>
    </div>
  )
}

export { HasCompleteProcess }
