import React, { useState, useRef, useEffect } from "react";
import classes from "./FileUpload.module.css";

import Input from "../Input/Input";
import Button from "../Button/Button";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";

const fileUpload = (props) => {
	const defaultBanner =
		"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";
	const inputFile = useRef(null);

	const [fileData, setFileData] = useState(null);

	const [fileBlob, setFileBlob] = useState(null);

	const [fileValid, setFileValid] = useState(false);

	const [image64, setImage64] = useState(defaultBanner);

	useEffect(() => {
		if (props.value) {

			setImage64(props.value);
			props.changed(props.value);
		}
	}, [props.value]);

	useEffect(() => {
		if (fileData) {
			if (
				!["image/jpeg", "image/png", "image/gif"].includes(
					fileData.type
				)
			) {
				setFileData(null);
				setFileBlob(null);

				alert("Invalid file type.");
				return;
			}

			const objectURL = URL.createObjectURL(fileData);
			var img = new Image();

			img.onload = function () {
				const imgWidth = img.width;
				const imgHeight = img.height;

				if (imgWidth !== 468 && imgHeight !== 60) {
					setFileData(null);
					setFileBlob(null);
					setImage64(defaultBanner);

					alert("Banner file must be 468x60 pixels");

					return;
				}

				var reader = new FileReader();

				reader.readAsBinaryString(fileData);

				reader.onload = function () {
					setImage64(btoa(reader.result));
					props.changed(btoa(reader.result));
				};
				reader.onerror = function () {
					console.log("there are some problems");
				};
			};

			img.src = objectURL;

			setFileBlob(objectURL);
		}
	}, [fileData]);

	const selectFilterHandlerDialog = (e) => {
		e.preventDefault();

		inputFile.current.click();
	};

	const fileSelectedHandler = (e) => {
		const fileData = e.target.files[0];

		setFileData(fileData);
	};

	return (
		<React.Fragment>
			<img
				className={classes.Image}
				src={`data:image/png;base64,${image64}`}
				width="100%"
			/>
			<br />

			<div className={classes.FileUpload}>
				<input
					className={classes.Input}
					type="text"
					value={fileData ? fileData.name : ""}
					onChange={() => {}}
					disabled
				/>

				<Button
					icon={faFolderOpen}
					clicked={selectFilterHandlerDialog}
				/>

				<input
					type="file"
					id="file"
					ref={inputFile}
					style={{ display: "none" }}
					onChange={fileSelectedHandler}
				/>
			</div>
		</React.Fragment>
	);
};

export default fileUpload;
