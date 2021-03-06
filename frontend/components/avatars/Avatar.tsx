import React from 'react';
import classNames from 'classnames';

type AvatarProps = {
    src?: string | null;
    className?: string;
    isOffline?: boolean;
    size?: 'l'
};

const Avatar = ({src, className, isOffline = false, size}: AvatarProps) => {
    if (!src) {
        return (
            <span
                className={
                    'inline-block h-6 w-6 rounded-full overflow-hidden bg-gray-100 ' +
                    className
                }
            >
            <svg
                className="h-full w-full text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
               <path
                   d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
         </span>
        );
    }

    return (
        <img
            className={classNames(
                'inline-block rounded-full ', className,
                {
                    'opacity-50': isOffline,
                    'h-14 w-13': size === 'l',
                    'h-10 w-10': !size
                },
            )}
            src={src}
            alt=""
            referrerPolicy={'no-referrer'}
        />
    );
};

export {Avatar};
