import {WorkshopSocketEvents} from '../../../../definitions/WorkshopSocketEvents';
import {SocketServerHandlerType} from '../SockerServer';
import {
    clearUsersFinished, getModuleUserData,
    getWorkshopStep,
    incrementWorkshopStep,
    setModuleReview, setModuleStartTime,
} from '../../RedisAdapter';
import {PrismaClient, WorkshopStep} from '@prisma/client';

type WorkshopSocketModuleNext = WorkshopStep & {};

const HandleModuleNext = async ({
                                    io,
                                    workshopId,
                                }: SocketServerHandlerType<null>) => {
    const prisma = new PrismaClient();
    let currentStep = await getWorkshopStep(workshopId);
    if (currentStep !== null) {
        currentStep++;
    } else {
        currentStep = 1;
    }
    const workshop = await prisma.workshop.findUnique({
        where: {
            id: workshopId,
        },
        include: {
            template: {
                include: {
                    steps: {
                        where: {
                            step: currentStep,
                        },
                    },
                },
            },
        },
    });
    if (!workshop) return;

    // ToDo Set the correct Step Information
    if (currentStep !== 1) {
        const userData = await getModuleUserData(workshopId);

        await prisma.workshop.update({
            where: {
                id: workshopId
            },
            data: {
                steps: {
                    create: [
                        {
                            title: 'test',
                            description: 'description',
                            type: 'BRAINSTORMING',
                            durationSeconds: 300,
                            step: currentStep - 1,
                            data: {
                                createMany: {
                                    data: userData!.map(data => ({
                                        data: data.data,
                                        createTime: data.dateTime,
                                        timeInWorkshop: data.millisecondsInWorkshop,
                                        userId: data.userId!
                                    })),
                                    skipDuplicates: true
                                },
                            }
                        }
                    ]
                }
            }
        })
    }


    const workshopStep = workshop!.template!.steps[0];
    await incrementWorkshopStep(workshopId);
    await setModuleReview(workshopId, false);
    await clearUsersFinished(workshopId);
    await setModuleStartTime(workshopId, new Date().getTime());
    io.in(workshopId).emit(
        WorkshopSocketEvents.WorkshopModuleNext,
        workshopStep,
    );
};

export type {WorkshopSocketModuleNext};

export default HandleModuleNext;
