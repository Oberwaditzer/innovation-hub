import { atom } from 'recoil';

const reviewModeState = atom({
   key: 'workshop/reviewMode',
   default: false,
});

export { reviewModeState };
