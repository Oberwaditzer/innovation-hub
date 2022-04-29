import React from 'react';
import Masonry from 'react-masonry-css';
import { useRecoilValue } from 'recoil';
import {
   moduleUserDataState,
   workshopUsers,
} from '../../../../state/atoms/workshop';
import { Avatar } from '../../../avatars/Avatar';
import { User } from '@prisma/client';
import { WorkshopUserInputTypes } from '../../../../../definitions/WorkshopUserInputTypes';
import { Button } from '../../../button/Button';
import { MdRemove } from 'react-icons/md';
import { WorkshopUser } from '../../../../../definitions/WorkshopDataTypes';

const BrainstormingResults = () => {
   const users = useRecoilValue(workshopUsers);
   const moduleUserData = useRecoilValue(moduleUserDataState);
   return (
      <Masonry
         breakpointCols={3}
         className={'flex w-3/4 overflow-scroll pt-3'}
         columnClassName={'w-auto pl-5 pr-5'}
      >
         {moduleUserData.map((e, i) => (
            <ResultElement
               key={i.toString()}
               data={e}
               user={users?.find((u) => u.id === e.userId)}
            />
         ))}
      </Masonry>
   );
};

type ResultElementProps = {
   key: string;
   data: WorkshopUserInputTypes;
   user?: WorkshopUser;
};

const ResultElement = ({ key, user, data }: ResultElementProps) => {
   return (
      <div
         key={key}
         className={
            'bg-gray-100 p-4 flex flex-initial flex-row items-center mb-3 rounded-2xl relative w-full'
         }
      >
         <Button className={'absolute -top-3 -right-3 p-1'} rounded={true}>
            <MdRemove className={'h-5 w-5'} />
         </Button>
         <Avatar src={user?.profilePictureURL} />
         <p className={'ml-3 break-all'}>{data.data?.text?.toString()}</p>
      </div>
   );
};

export { BrainstormingResults };
