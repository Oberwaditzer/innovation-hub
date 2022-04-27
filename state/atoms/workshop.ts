import {atom} from "recoil";

enum ModuleState {
    MODULE_ACTIVE,
    MODULE_PAUSED
}

const moduleActiveState = atom<ModuleState>({
    key: 'workshop/active',
    default: ModuleState.MODULE_ACTIVE
});


export {moduleActiveState};