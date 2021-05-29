import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "next/router";
import { connect } from "react-redux";

import { useRouter } from "next/router";
import classes from "./ServerAdd.module.css";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import {
	faPlusSquare,
	faSearch,
	faSave,
} from "@fortawesome/free-solid-svg-icons";
import Countries from "../../../shared/countries";
import axios from "../../../axios";
import LoadingIndicator from "../../../components/UI/LoadingIndicator/LoadingIndicator";

const serverAdd = (props) => {
	const formRef = useRef(null);

	const router = useRouter();

	const [formValid, setFormValid] = useState(false);

	const [formFileData, setFormFileData] = useState(null);

	const [loading, setLoading] = useState(false);

	const [errors, setErrors] = useState(null);

	useEffect(async () => {
		//Update mode
		if (props.id) {
			setLoading(true);

			const canEdit = await axios
				.post(`/servers/${props.id}/editable`)
				.then((result) => true)
				.catch((err) => false);

			if (!canEdit) {
				router.replace("/login");
				return;
			}

			//Lookup existing stuffs
			axios.get(`/servers/${props.id}`).then((result) => {
				const data = result.data[0];

				console.log(data);

				const controls = { ...state.controls };

				Object.keys(data).forEach((key) => {
					if (controls[key]) {
						formInputChangedHandler(null, key, data[key]);
					}
				});

				setState({
					...state,
					controls: controls,
				});

				setLoading(false);
			});
		}
	}, [props.id]);

	const [state, setState] = useState({
		controls: {
			name: {
				attributes: {
					label: "Server Name",
					id: "name",
					name: "name",
					value: "",
					type: "name",
					placeholder: "The name of your server",
				},
				valid: false,
				touched: false,
				validation: (text) => text.length > 0,
			},
			ip: {
				attributes: {
					label: "Server IP / Host name",
					id: "ip",
					name: "ip",
					value: "",
					type: "ip",
					placeholder: "e.g. myserver.myhost.com",
				},
				valid: false,
				touched: false,
				validation: (value) => value.length > 0,
			},
			port: {
				attributes: {
					label: "Server Port",
					id: "port",
					name: "port",
					value: "25565",
					type: "port",
					placeholder: "Default: 25565",
				},
				valid: true,
				touched: true,
				validation: (value) => !isNaN(parseInt(value)),
			},
			description: {
				attributes: {
					label: "Description",
					id: "description",
					name: "description",
					value: "",
					type: "textarea",
					placeholder: "Describe your server",
				},
				valid: false,
				touched: false,
				validation: (value) => value.length > 100,
			},
			votifier_ip: {
				attributes: {
					label: "Votifier Host",
					id: "votifier_ip",
					name: "votifier_ip",
					value: "",
					type: "text",
					placeholder: "(optional)",
				},
				valid: false,
				touched: false,
			},
			votifier_port: {
				attributes: {
					label: "Votifier Port",
					id: "votifier_port",
					name: "votifier_port",
					value: "",
					type: "port",
					placeholder: "(optional)",
				},
				valid: false,
				touched: false,
			},
			votifier_key: {
				attributes: {
					label: "Votifier Public Key",
					id: "votifier_key",
					name: "votifier_key",
					value: "",
					type: "textarea",
					placeholder: "(optional)",
				},
				valid: false,
				touched: false,
			},
			
			social_website: {
				attributes: {
					label: "Website",
					id: "social_website",
					name: "social_website",
					value: "",
					type: "website",
					placeholder: "(optional)",
				},
				valid: false,
				touched: false,
			},
			social_discord: {
				attributes: {
					label: "Discord",
					id: "social_discord",
					name: "social_discord",
					value: "",
					type: "discord",
					placeholder: "(optional)",
				},
				valid: false,
				touched: false,
			},
			country: {
				attributes: {
					label: "Country",
					id: "country",
					name: "country",
					checked: false,
					type: "select",
				},
				options: Countries,
				defaultOption: "Please select a country",
				valid: false,
				touched: false,
				validation: (value) => value !== "Please select a country",
			},
			banner: {
				attributes: {
					label: "Banner (Resolution: 468x60)",
					id: "banner",
					name: "banner",
					checked: false,
					type: "fileUpload",
				},
				valid: false,
				touched: false,
			},
		},
	});

	const formInputChangedHandler = (e, name, value) => {
		let element = null;
		let elementVal = null;

		if (e && !name) {
			element = e.target.id;
			elementVal = e.target.value;
		} else {
			element = name;
			elementVal = value;
		}

		console.log(element + " => " + elementVal);
		let controlsState = { ...state.controls };

		let control = controlsState[element];

		control.touched = true;

		control.attributes.value = elementVal;

		if (control.validation) {
			control.valid = elementVal ? control.validation(elementVal) : false;
		}

		checkIsFormValid();

		setState({
			...state,
			controls: controlsState,
		});
	};

	const formFileSetHandler = (fileData) => {
		const controlsState = { ...state.controls };
		controlsState.banner.attributes.value = fileData;

		setFormFileData(fileData);

		setState({
			...state,
			controls: controlsState,
		});
	};

	const checkIsFormValid = () => {
		let controlsState = { ...state.controls };

		let formValid = true;
		Object.keys(controlsState).forEach((key) => {
			let valid = controlsState[key].valid;

			if (controlsState[key].validation) {
				formValid = valid && formValid;
			}
		});

		formValid = formValid;

		setFormValid(formValid);
	};

	const addServerHandler = (e) => {
		e.preventDefault();

		setLoading(true);

		const data = {};

		Object.keys(state.controls).map((key) => {
			data[key] = state.controls[key].attributes.value;
		});

		if (!props.id) {
			axios
				.post("/servers", data)
				.then((response) => {
					if (response.data.code === 201) {
						props.router.replace("/server/manage");
					}

					if (response.data.code === 400) {
						setLoading(false);
						setErrors(response.data.errors);
					}
				})
				.catch((error) => {
					setLoading(false);
					setErrors(["An error occured while adding server"]);
				});
		} else {
			axios
				.put(`/servers/${props.id}`, data)
				.then((response) => {
					console.log(response);
					if (response.data.code === 201) {
						props.router.replace("/server/manage");
					}

					if (response.data.code === 400) {
						setLoading(false);
						setErrors(response.data.errors);
					}
				})
				.catch((error) => {
					setLoading(false);
					setErrors(["An error occured while adding server"]);
				});
		}
	};

	let form = <LoadingIndicator />;

	if (!loading) {
		form = (
			<div className={[classes.ServerAdd, "col-md-12"].join(' ')}>
				<div className="p-3">
					<p>
						{!props.id
							? "Please fill in all required details in order to post your server."
							: "Please fill in all required details in order to update your server."}
					</p>

					{errors && <p className="red">{errors.join("<br/>")}</p>}
					{Object.keys(state.controls).map((controlKey) => {
						const control = state.controls[controlKey];

						let controlChangedEvent = (event) =>
							formInputChangedHandler(event);

						if (control.attributes.type === "fileUpload") {
							controlChangedEvent = (fileData) =>
								formFileSetHandler(fileData);
						}

						return (
							<Input
								attributes={control.attributes}
								key={controlKey}
								valid={
									control.validation ? control.valid : true
								}
								touched={control.touched}
								options={control.options}
								defaultOption={control.defaultOption}
								changed={controlChangedEvent}
							/>
						);
					})}

					{!props.id ? (
						<Button
							icon={faPlusSquare}
							disabled={!formValid}
							clicked={addServerHandler}
						>
							ADD
						</Button>
					) : (
						<Button
							icon={faSave}
							disabled={!formValid}
							clicked={addServerHandler}
						>
							UPDATE
						</Button>
					)}
				</div>
			</div>
		);
	}

	return (
		<form
			className="col-md-12 pr-0 pl-0"
			ref={formRef}
			encType="multipart/form-data"
		>
			{form}
		</form>
	);
};

const mapStateToProps = (state) => {
	return {
		token: state.authReducer.token,
	};
};

export default connect(mapStateToProps)(withRouter(serverAdd));
