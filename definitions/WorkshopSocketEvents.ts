export enum WorkshopSocketEvents {
	WorkshopConnect = 'workshop:connect',
	WorkshopData = 'workshop:data',
	WorkshopUserOnline = 'workshop:user:online',
	WorkshopUserOffline = 'workshop:user:offline',
	WorkshopUserFinished = 'workshop:user:finished',
	WorkshopUserAdd = 'workshop:user:add',
	WorkshopUserRemove = 'workshop:user:remove',
	WorkshopUserChange = 'workshop:user:change',
	WorkshopModuleNext = 'workshop:module:next',
	WorkshopModuleReview = 'workshop:module:review',
	WorkshopModuleTimeIncrease = 'workshop:module:time:increase',
}
