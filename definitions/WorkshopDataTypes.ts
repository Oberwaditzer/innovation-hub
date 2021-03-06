import { User } from '@prisma/client';
import { JsonObject } from 'type-fest';

type WorkshopInitialDataTypes = {
	name: string;
};

type WorkshopInitialDataServerTypes = WorkshopInitialDataTypes & {
	users: WorkshopUser[];
};

type WorkshopUser = User & {
	isFacilitator: boolean;
	isOnline: boolean;
	isFinished: boolean;
};

type WorkshopRemoveInput = {
	id: string;
};

type WorkshopAddInput = {
	data: JsonObject;
	relevantForNextModule: boolean;
	type?: string | null;
	id?: string | null
};

type WorkshopAddInputWithText = WorkshopAddInput & {
	data: {
		text: string
	}
}

type WorkshopAddOutput = WorkshopAddInput & {
	userId: string | null;
	id: string;
	timeInWorkshop: number;
	createTime: Date;
};

type WorkshopAddOutputWithText = WorkshopAddOutput & WorkshopAddInputWithText;

type WorkshopAddInputBrainstorming = WorkshopAddInputWithText;

type WorkshopAddOutputBrainstorming = WorkshopAddOutput &
	WorkshopAddInputBrainstorming;

type WorkshopAddInputRephrasing = WorkshopAddInputWithText & {
	data: {
		original: string,
		dataId: string
	}
}

type WorkshopAddInputVoting = WorkshopAddInput & {
	type: 'voting' | 'select';
};

type WorkshopAddInputVotingTypeVote = WorkshopAddInputVoting & {
	data: {
		dataId: string;
		isUp: boolean;
	};
};

type WorkshopAddInputVotingTypeSelect = WorkshopAddInputVoting &
	WorkshopAddInputWithText & {
		data: {
			id: string;
		};
	};

type WorkshopAddOutputVotingTypeSelect = WorkshopAddOutput &
	WorkshopAddInputVotingTypeSelect &
	WorkshopAddInputBrainstorming;

type WorkshopAddOutputVotingTypeVote = WorkshopAddOutput &
	WorkshopAddInputVotingTypeVote;

export type {
	WorkshopInitialDataTypes,
	WorkshopInitialDataServerTypes,
	WorkshopUser,
	WorkshopRemoveInput,
	WorkshopAddInput,
	WorkshopAddOutput,
	WorkshopAddInputBrainstorming,
	WorkshopAddOutputBrainstorming,
	WorkshopAddInputVoting,
	WorkshopAddInputVotingTypeVote,
	WorkshopAddOutputVotingTypeVote,
	WorkshopAddOutputVotingTypeSelect,
	WorkshopAddInputVotingTypeSelect,
	WorkshopAddInputRephrasing,
	WorkshopAddInputWithText,
	WorkshopAddOutputWithText
};
