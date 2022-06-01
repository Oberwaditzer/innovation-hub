import React, {useContext} from 'react';
import {useRecoilValue} from 'recoil';
import {workshopModule,} from '../../../../state/atoms/workshop';
import {TextField} from '../../../input/TextField';
import {WorkshopContext} from '../../../../context/WorkshopContext';
import {BrainstormingResults} from './Results';
import {WorkshopSocketEvents} from '../../../../../definitions/WorkshopSocketEvents';
import {userState} from '../../../../state/atoms/user';
import {reviewModeState} from '../../../../state/atoms/reviewMode';
import {WorkshopAddInputBrainstorming} from "../../../../../definitions/WorkshopDataTypes";

const BrainstormingModule = () => {
    const module = useRecoilValue(workshopModule);
    const user = useRecoilValue(userState);
    const {sendData} = useContext(WorkshopContext);
    const isReview = useRecoilValue(reviewModeState);
    if (!module) {
        return null;
    }
    return (
        <div className={'w-full h-full flex flex-initial flex-col items-center'}>
            <p className={'font-semibold text-2xl mt-32 w-128 text-center'}>
                {module.title}
            </p>
            <p className={'mt-5 w-128 text-center'}>
               {module.description}
            </p>
            {!isReview && (
                <TextField
                    className={'mt-16 w-1/3'}
                    clearOnSubmit={true}
                    placeholder={'Type your thoughts'}
                    onSubmit={(userInput) => {
                        const output: WorkshopAddInputBrainstorming = {
                            data: {
                                text: userInput,
                            },
                           relevantForNextModule: true
                        };
                        sendData(WorkshopSocketEvents.WorkshopUserAdd, output);
                    }}
                />
            )}

            <div className={'flex w-full mt-16 justify-center mb-16'}>
                <div className="w-1/2 h-[1px] bg-gray-300"/>
            </div>
            <BrainstormingResults/>
        </div>
    );
};


export {BrainstormingModule};
