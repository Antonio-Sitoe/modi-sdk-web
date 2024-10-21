import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useNDAModi } from '@/contexts/step-state'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { useSystem } from '@/contexts/useSystem'
import { TypegrapthH1 } from '../ui/Typography'

const FormSchema = z.object({
  type: z.enum(['1', '2', '3'], {
    required_error: 'Selecione o documento',
  }),
})

export function DocumentDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  cancel: () => void
  setIsOpen: (a: boolean) => void
}) {
  const documentTypeList = useSystem().modiConfig.document_type
  const { setDocumentTypeId } = useNDAModi()
  const { previousPage, modiConfig } = useSystem()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: '1',
    },
  })

  function handleClose() {
    setIsOpen(false)
  }
  function onSubmit(data: z.infer<typeof FormSchema>) {
    setDocumentTypeId(data.type)
  }
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[540px] w-full h-full py-14 sm:h-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full h-full mt-4 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-3">
              <section>
                <img
                  src={modiConfig.workflowSteps.ocr.data?.documentDialog?.img}
                  width={70}
                  height={70}
                  alt="Picture of the author"
                  className="mx-auto mt-3"
                />
                <TypegrapthH1
                  className="text-base text-center font-montSerrat max-w-72 mx-auto mt-3"
                  text={
                    modiConfig.workflowSteps.ocr.data?.documentDialog?.title
                  }
                />
              </section>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel className="font-montSerrat text-sm sm:text-base font-normal">
                      {
                        modiConfig?.workflowSteps?.ocr?.data?.documentDialog
                          ?.label
                      }
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-3"
                      >
                        {documentTypeList.map(({ id, name }) => {
                          return (
                            <FormItem
                              className="flex items-center space-x-3 space-y-0"
                              key={id}
                            >
                              <FormControl>
                                <RadioGroupItem value={String(id)} />
                              </FormControl>
                              <FormLabel className="font-montSerrat text-sm sm:text-base font-normal">
                                {name}
                              </FormLabel>
                            </FormItem>
                          )
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="grid grid-cols-2 gap-4 w-full">
              <Button
                variant="outline"
                className="font-montSerrat font-medium"
                onClick={() => {
                  previousPage()
                }}
                onTouchEnd={() => {
                  previousPage()
                }}
                type="button"
              >
                voltar
              </Button>
              <Button
                variant="default"
                type="submit"
                className="font-montSerrat text-white font-normal"
                onTouchEnd={handleClose}
                onClick={handleClose}
              >
                Iniciar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
