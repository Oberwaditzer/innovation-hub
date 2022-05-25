import React, {useContext} from 'react';
import Masonry from 'react-masonry-css';
import {useRecoilValue} from 'recoil';
import {moduleUserDataState, workshopUsers,} from '../../../../state/atoms/workshop';
import {Avatar} from '../../../avatars/Avatar';
import {Button} from '../../../button/Button';
import {MdRemove} from 'react-icons/md';
import {
    WorkshopAddOutput,
    WorkshopAddOutputBrainstorming,
    WorkshopUser
} from '../../../../../definitions/WorkshopDataTypes';
import {WorkshopContext} from '../../../../context/WorkshopContext';
import {WorkshopSocketEvents} from '../../../../../definitions/WorkshopSocketEvents';
import {userState} from '../../../../state/atoms/user';

const BrainstormingResults = () => {
    const users = useRecoilValue(workshopUsers);
    const moduleUserData = useRecoilValue(moduleUserDataState);
    return (
        <Masonry
            breakpointCols={3}
            className={'flex w-3/4 overflow-scroll pt-3'}
            columnClassName={'w-auto pl-5 pr-5'}
        >
            {moduleUserData.map((e) => (
                <ResultElement
                    key={e.id}
                    data={e as WorkshopAddOutputBrainstorming}
                    user={users?.find((u) => u.id === e.userId)}
                />
            ))}
        </Masonry>
    );
};

type ResultElementProps = {
    data: WorkshopAddOutputBrainstorming;
    user?: WorkshopUser;
};

const ResultElement = ({user, data}: ResultElementProps) => {
    const {sendData} = useContext(WorkshopContext);
    const currentUser = useRecoilValue(userState);

    const removeData = () => {
        sendData(WorkshopSocketEvents.WorkshopUserRemove, {id: data.id});
    };

    return (
        <div
            className={
                'bg-gray-100 p-4 flex flex-initial flex-row items-center mb-3 rounded-2xl relative w-full'
            }
        >
            {(currentUser.isFacilitator || currentUser.userId === data.userId) && (
                <Button
                    className={'absolute -top-3 -right-3 p-1'}
                    rounded={true}
                    onClick={removeData}
                >
                    <MdRemove className={'h-5 w-5'}/>
                </Button>
            )}

            <Avatar src={user?.profilePictureURL}/>
            <p className={'ml-3 break-all'}>{data.data?.text?.toString() || ''}</p>
        </div>
    );
};

export {BrainstormingResults};
