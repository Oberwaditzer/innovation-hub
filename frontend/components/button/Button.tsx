import React from 'react';

type ButtonProps = {
    children?: React.ReactNode,
    text?: string,
    onClick: () => void
}

/**
 * A basic button implementation
 * Needs text or children to get rendered
 * @param children
 * @param text
 * @param onClick
 * @constructor
 */
const Button = ({ children, text, onClick } : ButtonProps) => {

    if (text == undefined && children == undefined) {
        console.error('Button needs a child or an text to get rendered');
        return null;
    }

    return (
        <button
            onClick={onClick}
            type="button"
            className="inline-flex justify-center items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            { children ?? text }
        </button>
    )
}

export { Button }