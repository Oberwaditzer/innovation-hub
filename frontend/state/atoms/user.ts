import {atom} from 'recoil';

const userState = atom({
    key: 'user',
    default: {
        userId: '',
        isFacilitator: false,
    },
});

export {userState};
