import React from 'react';
import { WorkshopUser } from '../../../../definitions/WorkshopDataTypes';
import { Avatar } from '../../avatars/Avatar';
import classNames from 'classnames';

type UserProps = {
   key: string;
   user: WorkshopUser;
};

const UserItem = ({ key, user }: UserProps) => {
   console.log(user);
   return (
      <div
         key={key}
         className={classNames(
            'flex flex-1 flex-row p-3 rounded-3xl items-center w-full mb-2',
            {
               'bg-blue-100': user.isOnline,
               'bg-gray-100': !user.isOnline,
            },
         )}
      >
         <Avatar
            src={user.profilePictureURL}
            className={'mr-3'}
            isOffline={!user.isOnline}
         />
         <p>{user.isOnline ? 'online' : 'not online yet'}</p>
      </div>
   );
};

export { UserItem };
