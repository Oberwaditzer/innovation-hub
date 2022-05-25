import { atom } from 'recoil';

const resultsModeState = atom({
   key: 'workshop/resultsMode',
   default: false,
});

export { resultsModeState };
