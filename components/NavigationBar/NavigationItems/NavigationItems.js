import React from 'react';

import classes from './NavigationItems.module.css';

import NavigationItem from './NavigationItem/NavigationItem';

import {useRouter} from 'next/router';

const navigationItems = (props) => {
    const router = useRouter();

    return (
        <ul className={classes.NavigationItems}>
            {props.children}
        </ul>
    );
}

export default navigationItems;