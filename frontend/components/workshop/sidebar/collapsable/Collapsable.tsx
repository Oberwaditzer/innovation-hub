import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { workshopSidebarExpandedState } from '../../../../state/atoms/workshopSidebar';
import classNames from 'classnames';

type CollapsableProps = {
   children: React.ReactNode;
   width?: boolean;
   height?: boolean;
};

const Collapsable = ({ children, width, height }: CollapsableProps) => {
   const isExpanded = useRecoilValue(workshopSidebarExpandedState);
   const containerRef = useRef<HTMLDivElement>(null);

   const [maxWidth, setMaxWidth] = useState(0);
   const [maxHeight, setMaxHeight] = useState(0);
   console.log('maxwidth', maxWidth);

   useEffect(() => {
      if (
         isExpanded &&
         containerRef.current?.offsetWidth &&
         maxWidth === 0 &&
         maxHeight === 0
      ) {
         setMaxWidth(containerRef.current.offsetWidth);
         setMaxHeight(containerRef.current.clientHeight);
      }
   }, [isExpanded, containerRef, maxWidth, maxHeight]);

   return (
      <div
         ref={containerRef}
         style={{
            maxWidth: isExpanded && width ? maxWidth : undefined,
            maxHeight: isExpanded && height ? maxHeight : undefined,
         }}
         className={classNames('transition-opacity overflow-hidden', {
            'transition-max-width': width,
            'transition-max-height ': height,
            [`opacity-100`]: isExpanded,
            'max-w-0 max-h-0 opacity-0': !isExpanded,
         })}
      >
         {children}
      </div>
   );
};

export { Collapsable };
