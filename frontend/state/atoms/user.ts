import { atom } from 'recoil';

const userState = atom({
   key: 'user',
   default: {
      userId: 'cl2ss9h9m00258eh5v6s25i69',
      isFacilitator: false,
   },
});

export { userState };
