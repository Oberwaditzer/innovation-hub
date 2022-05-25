export enum WorkshopSocketEvents {
	WorkshopConnect = 'workshop:connect',
	WorkshopData = 'workshop:data',
	WorkshopUserOnline = 'workshop:user:online',
	WorkshopUserOffline = 'workshop:user:offline',
	WorkshopUserFinished = 'workshop:user:finished',
	WorkshopUserAdd = 'workshop:user:add',
	WorkshopUserRemove = 'workshop:user:remove',
	WorkshopUserUpdate = 'workshop:user:update',
	WorkshopModuleNext = 'workshop:module:next',
	WorkshopModuleReview = 'workshop:module:review',
}
