import {atom} from "recoil";

const workshopSidebarExpandedState = atom<boolean>({
    key: 'workshop/sidebar/expanded',
    default: true
});


export {workshopSidebarExpandedState};