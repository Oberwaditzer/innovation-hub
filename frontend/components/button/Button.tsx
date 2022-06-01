import React from 'react';
import classNames from 'classnames';

type ButtonProps = {
   children?: React.ReactNode,
   text?: string,
   onClick?: () => void,
   rounded?: boolean,
   className?: string
   disabled?: boolean
   colorName?: string
}

const Button = ({ children, text, onClick, rounded, className, disabled = false, colorName = 'blue' }: ButtonProps) => {

   if (text == undefined && children == undefined) {
      console.error('Button needs a child or an text to get rendered');
      return null;
   }

   return (
      <button
         disabled={disabled}
         onClick={onClick}
         type='button'
         className={classNames(`inline-flex justify-center items-center border border-transparent text-xs font-medium shadow-sm text-white bg-${colorName}-600 hover:bg-${colorName}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${colorName}-500 ` + className, {
            'rounded-full p-3': rounded,
            'rounded px-2.5 py-1.5': !rounded,
            'bg-gray-200 hover:bg-gray-200': disabled
         })}
      >
         {children ?? text}
      </button>
   );
};

export { Button };