import React, {ChangeEvent, KeyboardEventHandler, useState} from 'react';
import {Button} from "../button/Button";
import {MdAdd} from 'react-icons/md'

type TextFieldProps = {
    className?: string;
    onChange?: (output: string)=>void;
    onSubmit?: (output: string) => void;
    placeholder?: string
    clearOnSubmit?: boolean
}

const TextField = ({ className, onChange, placeholder, onSubmit, clearOnSubmit }: TextFieldProps) => {
    const [value, setValue] = useState('');

    const submit = () => {
        if (clearOnSubmit) {
            setValue('');
        }
        if (onSubmit) {
            onSubmit(value);
        }
    }

    const change = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        if(onChange) {
            onChange(e.target.value);
        }
    }

    //@ts-ignore
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        if(event.key === 'Enter' && ! event.shiftKey) {
            event.preventDefault();
            submit();
        }
    }

    return (
        <div className={"bg-gray-50 p-3 rounded-md flex flex-row focus:border-blue-600 focus:ring-0 w-128 "+className}>
            <textarea
                value={value}
                name="name"
                id="name"
                className="block w-full bg-transparent border-0 border-transparent sm:text-sm"
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                onChange={change}
            />
            <Button className={'p-2'} onClick={submit} rounded={true}><MdAdd className={'w-5 h-5'}/></Button>
        </div>
    )
}

export {TextField}