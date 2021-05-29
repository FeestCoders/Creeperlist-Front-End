import { parse } from '@fortawesome/fontawesome-svg-core';
import React from 'react';
import classes from './StatusIndicator.module.css';

const statusIndicator = (props) => {


    const classArr = [classes.StatusIndicator, props.online ? classes.Online : classes.Offline];


    return (
        <span className={classArr.join(' ')}>{props.online ? "Online" : "Offline"}</span>
    );
};

export default statusIndicator;