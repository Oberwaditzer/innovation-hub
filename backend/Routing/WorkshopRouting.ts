import { getWorkshopInResults, getWorkshopStep } from '../workshop/RedisAdapter';

enum RedirectToCorrectWorkshopPageEnum {
   START,
   INDEX,
   RESULT
}

const redirectToCorrectWorkshopPage = async (workshopId: string, currentPage: RedirectToCorrectWorkshopPageEnum) => {
   if (workshopId) {
      const workshopStep = await getWorkshopStep(workshopId);
      const inResults = await getWorkshopInResults(workshopId);

      if (inResults && currentPage !== RedirectToCorrectWorkshopPageEnum.RESULT) {
         return {
            redirect: {
               permanent: false,
               destination: `/workshop/${workshopId}/results`,
            },
         };
      }

      if (!workshopStep && currentPage !== RedirectToCorrectWorkshopPageEnum.START) {
         return {
            redirect: {
               permanent: false,
               destination: `/workshop/${workshopId}/start`,
            },
         };
      }
   }
   return null;
};

export { redirectToCorrectWorkshopPage, RedirectToCorrectWorkshopPageEnum };
