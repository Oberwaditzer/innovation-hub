import React from 'react';
import {useSocketIO} from "../../../hooks/useSocketIO";
import StateExample from '../../../components/StateExample';

const Example = () => {
    useSocketIO();
    return <StateExample/>
}

export default Example;