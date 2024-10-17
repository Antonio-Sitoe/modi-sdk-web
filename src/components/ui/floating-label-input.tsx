import * as React from 'react';

import { cn } from '@/lib/utils';
import { Inputt } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Inputt
        placeholder=" "
        className={cn('peer', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
FloatingInput.displayName = 'FloatingInput';

const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      className={cn(
        'peer-focus:secondary peer-focus:dark:secondary absolute start-2 top-1.5 z-40 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-white rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-disabled:opacity-100',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = 'FloatingLabel';

type FloatingLabelInputProps = InputProps & {
  label?: string;
  isInterative?: boolean;
};

const FloatingLabelInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, value, isInterative = false, onChange, ...props }, ref) => {
  const handleClear = () => {
    if (onChange) {
      onChange({
        target: {
          value: '',
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
    const input = document.querySelector('#' + id) as HTMLInputElement;
    if (input) {
      input?.focus();
      input.value = '';
    }
  };
  return (
    <div className="relative">
      <FloatingInput
        ref={ref}
        id={id}
        value={value}
        onChange={onChange}
        {...props}
      />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
      {isInterative && (
        <>
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </>
      )}
    </div>
  );
});
FloatingLabelInput.displayName = 'FloatingLabelInput';

export { FloatingInput, FloatingLabel, FloatingLabelInput };
