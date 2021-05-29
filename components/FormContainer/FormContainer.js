import React from "react";

import classes from "./FormContainer.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const formContainer = (props) => {
	return (
		<div
			className={[
				classes.FormContainer,
				"pl-0",
				"pr-0",
				...props.className,
			].join(" ")}
		>
			<div className="col-md-12">
				<h1
					className={[
						classes.FormContainerTitle,
						"d-flex",
						"align-items-center",
						"mb-0"
					].join(" ")}
				>
					{props.icon && (
						<FontAwesomeIcon
							icon={props.icon}
							className="mr-2"
							size="1x"
						/>
					)}
					{props.title}
				</h1>

				<div className={classes.FormContainerBody} style={{padding: props.padding}}>
					{props.children}
				</div>
			</div>
		</div>
	);
};

export default formContainer;
