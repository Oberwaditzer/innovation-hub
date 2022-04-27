import React from 'react';
import {useRecoilState} from "recoil";
import {moduleActiveState} from "../state/atoms/workshop";

const StateExample = () => {
    const state = useRecoilState(moduleActiveState);
    return <div>test{state}</div>
}

export default StateExample