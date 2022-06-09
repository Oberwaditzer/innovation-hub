import React, { useContext, useState } from 'react';
import { TextField } from '../../../input/TextField';
import { useRecoilValue } from 'recoil';
import { modulePreviousUserData, moduleUserDataState } from '../../../../state/atoms/workshop';
import { WorkshopContext } from '../../../../context/WorkshopContext';
import { WorkshopAddInputRephrasing, WorkshopAddOutputWithText } from '../../../../../definitions/WorkshopDataTypes';
import { WorkshopSocketEvents } from '../../../../../definitions/WorkshopSocketEvents';
import classNames from 'classnames';
import { userState } from '../../../../state/atoms/user';
import { reviewModeState } from '../../../../state/atoms/reviewMode';
import { ArrowForwardOutlined, DoneOutlined } from '@material-ui/icons';

const RephrasingList = () => {
   const previousData = useRecoilValue(modulePreviousUserData);
   const currentData = useRecoilValue(moduleUserDataState);
   const { isFacilitator } = useRecoilValue(userState);
   const isReview = useRecoilValue(reviewModeState);
   return (
      <div className={'w-full'}>
         {
            previousData.map((e, i) => (
               <RephrasingListElement data={currentData as WorkshopAddOutputWithText[]} key={i.toString()}
                                      isFacilitator={isFacilitator}
                                      isReview={isReview}
                                      previousElement={e as WorkshopAddOutputWithText} />
            ))
         }
      </div>
   );
};

type RephrasingListElementProps = {
   previousElement: WorkshopAddOutputWithText
   data: WorkshopAddOutputWithText[]
   isFacilitator: boolean
   isReview: boolean
}

const RephrasingListElement = ({ previousElement, data, isFacilitator, isReview }: RephrasingListElementProps) => {
   const isElementAdded = data.find(newElement => newElement.data.dataId === previousElement.id);
   const { sendData: send } = useContext(WorkshopContext);
   const [textValue, setTextValue] = useState(isElementAdded?.data.text ?? previousElement.data.text as string ?? '');
   const hasElementChanged = isElementAdded?.data.text !== textValue;

   const sendData = () => {
      const data: WorkshopAddInputRephrasing = {
         relevantForNextModule: true,
         data: {
            dataId: previousElement.id,
            text: textValue,
            original: previousElement.data.text,
         },
      };

      if (isElementAdded) {
         data.id = isElementAdded.id;
         send(WorkshopSocketEvents.WorkshopUserChange, data);
      } else {
         send(WorkshopSocketEvents.WorkshopUserAdd, data);
      }
   };

   return (
      <div className={classNames('w-full p-4 rounded-3xl flex flex-row items-center', {
         'bg-gray-100': !isElementAdded || hasElementChanged,
         'bg-green-100': isElementAdded && !hasElementChanged,
      })}>
         <div className={'flex-1'}>
            {previousElement.data.text}
         </div>
         <div className={'mx-3'}>
            <ArrowForwardOutlined className={'w-5 h-5 text-blue-500'} />
         </div>
         <div className={'flex-1'}>
            {
               isFacilitator && !isReview &&
               <TextField buttonDisabled={isElementAdded && !hasElementChanged}
                          onSubmit={sendData} textValue={textValue} onChange={setTextValue}
                          placeholder={previousElement.data.text} clearOnSubmit={true}
                          icon={<DoneOutlined className={'w-5 h-5'} />} />
            }
            {
               !isFacilitator || isReview &&
               <p>{isElementAdded?.data.text ?? previousElement.data.text as string ?? ''}</p>
            }
         </div>
      </div>
   );
};

export { RephrasingList };