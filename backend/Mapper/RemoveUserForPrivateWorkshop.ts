import { WorkshopPrivacyLevel } from '@prisma/client';
import { WorkshopAddOutput } from '../../definitions/WorkshopDataTypes';

const RemoveUserForPrivateWorkshop = (data: WorkshopAddOutput[], privacyLevel: WorkshopPrivacyLevel, userId?: string) => {
   // Keeps only the data for this specific user
   if (userId) {
      return data
         .filter((data) => {
            if (
               privacyLevel === 'FULL_VISIBLE' ||
               privacyLevel === 'VISIBLE_WITHOUT_USER_INFORMATION'
            )
               return true;
            return data.userId === userId;

         })
         .map((data) => ({
            ...data,
            userId:
               privacyLevel === 'VISIBLE_WITHOUT_USER_INFORMATION' &&
               data.userId !== userId
                  ? null
                  : data.userId,
         }));
   }
   return data.map((d) => ({
      ...d,
      userId: privacyLevel === 'FULL_VISIBLE' ? d.userId : null,
   }));
};

export { RemoveUserForPrivateWorkshop };