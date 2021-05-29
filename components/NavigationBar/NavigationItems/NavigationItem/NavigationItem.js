import React from "react";

import classes from "./NavigationItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const navigationItem = (props) => (
	<li  className={classes.NavigationItem}>
		<Link href={props.href} passHref><a>
			<FontAwesomeIcon icon={props.icon} className="mr-2" />
			{props.children}
		</a></Link>
	</li>
);

export default navigationItem;
