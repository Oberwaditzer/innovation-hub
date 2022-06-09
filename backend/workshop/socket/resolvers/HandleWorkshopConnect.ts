import {
    getModuleReview,
    getModuleUserData,
    getUsersFinished,
    getUsersOnline, getWorkshopInResults,
    getWorkshopStep,
} from '../../RedisAdapter';
import {WorkshopAddOutput, WorkshopUser,} from '../../../../definitions/WorkshopDataTypes';
import {WorkshopSocketEvents} from '../../../../definitions/WorkshopSocketEvents';
import {SocketServerHandlerType} from '../SockerServer';
import {JsonObject} from 'type-fest';
import { PrismaClient, WorkshopPrivacyLevel, WorkshopStep } from '@prisma/client';
import {RemoveUserForPrivateWorkshop} from "../../../Mapper/RemoveUserForPrivateWorkshop";

type WorkshopSocketInitialData = {
    name: string;
    users: WorkshopUser[];
    steps: WorkshopStep[];
    moduleData?: {
        userInput: WorkshopAddOutput[];
        previousData: WorkshopAddOutput[];
    }
    currentStep?: number;
    isReview: boolean;
    privacyLevel: WorkshopPrivacyLevel;
    isResults: boolean;
};

const HandleWorkshopConnect = async ({
                                         socket,
                                         workshopId,
                                         userId,
                                     }: SocketServerHandlerType<null>) => {
    const prisma = new PrismaClient();
    const usersOnline = await getUsersOnline(workshopId);
    let currentStep = await getWorkshopStep(workshopId);
    const workshop = await prisma.workshop.findUnique({
        where: {
            id: workshopId,
        },
        include: {
            users: {
                include: {
                    user: true,
                },
            },
            template: {
                include: {
                    steps: {
                        where: {
                            step: currentStep ?? 1,
                        },
                    },
                },
            },
            steps: {
                orderBy: {
                  step: 'asc'
                },
                include: {
                    data: {
                        where: {
                            relevantForNextModule: true
                        }
                    }
                }
            }
        },
    });

    if(!workshop) return;

    let previousData: WorkshopAddOutput[] | [] = []

    if (workshop?.steps && currentStep !== null) {
        previousData = workshop.steps.find(e => e.step === currentStep! - 1)?.data.map(e => ({
            ...e,
            data: e.data as JsonObject,
            userId
        })) ?? [];
    }

    const isReview = await getModuleReview(workshopId);
    const moduleUserData = (await getModuleUserData(workshopId))!;
    let moduleData;

    if (isReview) {
        moduleData = RemoveUserForPrivateWorkshop(moduleUserData, workshop!.privacyLevel)
    } else {
        moduleData = RemoveUserForPrivateWorkshop(
            moduleUserData,
            workshop!.privacyLevel,
            userId,
        );
    }

    const finishedUsers = await getUsersFinished(workshopId);
    const initialData: WorkshopSocketInitialData = {
        users: workshop!.users.map((user) => ({
            ...user.user,
            isOnline: usersOnline.includes(user.user.id),
            isFacilitator: user.admin,
            isFinished: finishedUsers.includes(user.userId) ?? false,
        })),
        name: workshop!.title,
        steps: workshop!.steps,
        moduleData: currentStep ? {
            userInput: moduleData,
            previousData: RemoveUserForPrivateWorkshop(previousData, workshop!.privacyLevel)
        } : undefined,
        currentStep: currentStep || undefined,
        isReview: isReview,
        privacyLevel: workshop!.privacyLevel,
        isResults: await getWorkshopInResults(workshopId)
    };
    socket.emit(WorkshopSocketEvents.WorkshopConnect, initialData);
};

export type {WorkshopSocketInitialData};

export default HandleWorkshopConnect;
