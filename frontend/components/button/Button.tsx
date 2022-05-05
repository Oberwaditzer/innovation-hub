import React from 'react';
import classNames from "classnames";

type ButtonProps = {
    children?: React.ReactNode,
    text?: string,
    onClick?: () => void,
    rounded?: boolean,
    className?: string
}

/**
 * A basic button implementation
 * Needs text or children to get rendered
 * @param children
 * @param text
 * @param onClick
 * @constructor
 */
const Button = ({ children, text, onClick, rounded, className} : ButtonProps) => {

    if (text == undefined && children == undefined) {
        console.error('Button needs a child or an text to get rendered');
        return null;
    }

    return (
        <button
            onClick={onClick}
            type="button"
            className={classNames("inline-flex justify-center items-center  border border-transparent text-xs font-medium shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 "+className, {
                'rounded-full p-3': rounded,
                'rounded px-2.5 py-1.5': !rounded
            })}
        >
            { children ?? text }
        </button>
    )
}

export { Button }