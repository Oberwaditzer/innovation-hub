import React from 'react';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { workshopUsers } from '../../../../state/atoms/workshop';
import { Avatar } from '../../../avatars/Avatar';
import { resultsModeState } from '../../../../state/atoms/inResults';

const UserList = () => {
   const users = useRecoilValue(workshopUsers);
   const isResult = useRecoilValue(resultsModeState);
   return (
      <div className={classNames('w-full')}>
         {users?.map((user, index) => (
            <div
               key={index.toString()}
               className={classNames(
                  'w-full my-3 bg-blue-200 p-3 rounded-2xl flex flex-row',
                  {
                     'bg-white': user.isOnline && !user.isFinished,
                     'bg-green-200': user.isFinished,
                     'bg-gray-200': !user.isOnline,
                  },
               )}
            >
               <Avatar src={user.profilePictureURL} />{' '}
               <div className={'flex flex-col ml-3 justify-center'}>
                  <p>{`${user.firstName} ${user.lastName}`}</p>
                  <p className={'text-xs text-gray-500'}>
                     {isResult ? 'Checking results' : user.isFinished ? 'finished' : 'in progress'}
                  </p>
               </div>
            </div>
         ))}
      </div>
   );
};

const UsersFinished = () => {
   const users = useRecoilValue(workshopUsers);
   return (
      <p className={'text-gray-500 text-xs'}>{`${
         users?.filter((u) => u.isFinished).length
      }/${users?.length}`}</p>
   );
};

export { UserList, UsersFinished };
