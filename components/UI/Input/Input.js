import React from "react";
import classes from "./Input.module.css";
import FileUpload from "../FileUpload/FileUpload";

const input = (props) => {

	let inputClasses = [classes.Input].concat(props.className);

	if (!props.valid && props.touched) {
		inputClasses.push(classes.Invalid);
	}

	if (props.valid) {
		inputClasses.push(classes.Valid);
	}

	let input = (
		<input
			className={inputClasses.join(" ")}
			{...props.attributes}
			onChange={props.changed}
		/>
	);

	if (props.attributes.type === "select") {

		input = (
			<select
				className={inputClasses.join(" ")}
				{...props.attributes}
				value={props.attributes.value}
				onChange={props.changed}
			>
				{props.defaultOption && <option value={props.defaultOption}>{props.defaultOption}</option>}
				
				{props.options.map((option, i) => {
					let text = option.text;
					let value = option.value ?? option.text;

					if (typeof option == "object") {
						text = option.text;
						value = option.value;
					}

		
					return (
						<option key={i} value={value} selected={value === props.attributes.value ? "selected" : null}> 
							{text}
						</option>
					);
				})}
			</select>
		);
	}

	if (props.attributes.type === "fileUpload") {
		input = <FileUpload changed={props.changed} value={props.attributes.value} key="fileUpload" />;
	}

	if(props.attributes.type === "textarea") {
		input = <textarea {...props.attributes}  onChange={props.changed} className={inputClasses.join(' ')} rows="5"></textarea>
	}

	return (
		<React.Fragment>
			{props.attributes.label && (
				<label key={props.attributes.label} className={classes.Label} htmlFor={props.id}>
					{props.attributes.label}
				</label>
			)}

			{input}
		</React.Fragment>
	);
};

export default input;
