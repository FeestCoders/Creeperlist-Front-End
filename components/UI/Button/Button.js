import React from 'react';

import classes from './Button.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const button = (props) => (
    <button 
        disabled={props.disabled}
        className={[classes.Button, classes[props.type]].concat(props.className).join(' ')}
        onClick={props.clicked}>
        
        {props.icon && <span className={classes.Icon} ><FontAwesomeIcon icon={props.icon}/></span>}


        {props.children && <span>{props.children}</span>}
    </button>
)

export default button;