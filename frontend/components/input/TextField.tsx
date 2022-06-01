import React, { ChangeEvent, KeyboardEventHandler, useState } from 'react';
import { Button } from '../button/Button';
import { MdAdd } from 'react-icons/md';
import classNames from 'classnames';

type TextFieldProps = {
   className?: string;
   onChange?: (output: string) => void;
   onSubmit?: (output: string) => void;
   placeholder?: string
   clearOnSubmit?: boolean
   icon?: React.ReactNode
   textValue?: string
   disabled?: boolean
   buttonDisabled?: boolean
}

const TextField = ({ className, onChange, placeholder, onSubmit, clearOnSubmit, icon, textValue, disabled = false, buttonDisabled = false }: TextFieldProps) => {
   const [value, setValue] = useState(textValue ?? '');

   const submit = () => {
      if(!value && !textValue) {
         return;
      }
      if (clearOnSubmit) {
         setValue('');
      }
      if (onSubmit) {
         onSubmit(value);
      }
   };

   const change = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      if (onChange) {
         onChange(e.target.value);
      }
   };

   //@ts-ignore
   const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === 'Enter' && !event.shiftKey) {
         event.preventDefault();
         submit();
      }
   };

   return (
      <div
         className={classNames('bg-gray-50 p-3 rounded-md flex flex-row items-center focus:border-blue-600 focus:ring-0', className)}>
            <textarea
               disabled={disabled}
               value={textValue ?? value}
               name='name'
               id='name'
               className='block w-full bg-transparent border-0 border-transparent min-h-[100px] sm:text-sm'
               placeholder={placeholder}
               onKeyDown={handleKeyDown}
               onChange={change}
            />
         <Button className={'p-2'} onClick={submit} rounded={true} disabled={(!textValue && !value) || disabled || buttonDisabled}>
            {
               icon ?
                  icon :
                  <MdAdd className={'w-5 h-5'} />
            }
         </Button>
      </div>
   );
};

export { TextField };