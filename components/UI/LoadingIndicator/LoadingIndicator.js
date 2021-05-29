import React from 'react';
import classes from './LoadingIndicator.module.css';

const LoadingIndicator = (props) => (
    <div className={classes.loader}><div></div><div></div><div></div><div></div></div>
);

export default LoadingIndicator;