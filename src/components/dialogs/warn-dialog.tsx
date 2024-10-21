'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useNDAModi } from '@/contexts/step-state'
import { useSystem } from '@/contexts/useSystem'

import { TypegrapthH1, Typegrapth } from '../ui/Typography'

interface WarnDialogProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function WarnDialog({ isOpen, setIsOpen }: WarnDialogProps) {
  function handleClose() {
    setIsOpen(false)
  }
  const { modiConfig } = useSystem()
  const { isOnline } = useNDAModi()

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[540px] w-10/12 p-10 px-8 sm:px-14 sm:h-auto  z-50 rounded-sm">
        <div className="text-center mx-auto">
          {isOnline && (
            <img
              width={60}
              height={60}
              src={modiConfig.assets.warnIcon}
              alt="information"
              className=" sm:w-14 sm:h-14 w-8 h-8"
            />
          )}
        </div>
        <div>
          <TypegrapthH1
            className="mb-3 font-bold text-base sm:text-2xl text-center"
            text={modiConfig.workflowSteps.show_data.data.warnDialog.title}
          />

          <Typegrapth
            className="mb-3 text-center text-sm sm:text-base"
            text={modiConfig.workflowSteps.show_data.data.warnDialog.subtitle}
          />

          <Typegrapth
            className="text-center text-sm sm:text-base"
            text={modiConfig.workflowSteps.show_data.data.warnDialog.text}
          />

          {modiConfig.workflowSteps.show_data.data.warnDialog.img && (
            <div className="grid gap-3 mt-10">
              <p className="text-sm sm:text-base">Exemplo</p>
              <img
                width="500"
                height={40}
                src={modiConfig.workflowSteps.show_data.data.warnDialog.img}
                alt="Image exemple"
              />
            </div>
          )}
        </div>
        <Button
          onClick={() => handleClose()}
          onTouchEnd={() => handleClose()}
          variant="outline"
          className="mt-3 text-sm"
        >
          {modiConfig.workflowSteps.show_data.data.warnDialog.buttonText}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
