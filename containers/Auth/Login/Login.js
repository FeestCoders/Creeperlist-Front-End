import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";

import classes from "./Login.module.css";

import axios from "../../../axios";
import { wrapper } from "../../../redux";
import { connect } from "react-redux";
import {
	authenticate,
	checkServerSideCookie,
	loggingInFinish,
} from "../../../redux/actions/auth";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import { faUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import { isEmail, isValidPassword } from "../../../shared/formValidation";
import LoadingIndicator from "../../../components/UI/LoadingIndicator/LoadingIndicator";
import MessageBox from "../../../components/UI/MessageBox/MessageBox";
import FormContainer from "../../../components/FormContainer/FormContainer";

const Login = ({ authenticate, token, loggingIn, error }) => {
	const [formValid, setFormValid] = useState(false);

	const [state, setState] = useState({
		controls: {
			email: {
				attributes: {
					label: "Email",
					id: "email",
					name: "email",
					value: "",
					type: "email",
					placeholder: "Email address",
				},
				valid: false,
				touched: false,
				validation: (value) => isEmail(value),
			},
			password: {
				attributes: {
					label: "Password",
					id: "password",
					name: "password",
					value: "",
					type: "password",
					placeholder: "Enter a password",
				},
				valid: false,
				touched: false,
				validation: (value) => {
					return value.length > 0;
				},
			},
		},
	});

	const loginSubmitHandler = async (e) => {
		e.preventDefault();

		if (formValid) {
			const email = state.controls["email"].attributes.value;
			const password = state.controls["password"].attributes.value;

			authenticate({ email, password });
		}
	};

	const formInputChangedHandler = (e) => {
		const element = e.target.id;
		const elementVal = e.target.value;

		let controlsState = { ...state.controls };

		let control = controlsState[element];

		control.touched = true;
		control.attributes.value = elementVal;

		if (control.validation) {
			control.valid = control.validation(elementVal);
		}

		checkIsFormValid();

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

			formValid = valid && formValid;
		});

		setFormValid(formValid);
	};

	const formContents = (
		<React.Fragment>
			<p>Please fill in your login details.</p>

			{Object.keys(state.controls).map((controlKey) => {
				const control = state.controls[controlKey];

				return (
					<Input
						attributes={control.attributes}
						key={controlKey}
						valid={control.valid}
						touched={control.touched}
						options={control.options}
						defaultOption={control.defaultOption}
						changed={(event) => formInputChangedHandler(event)}
					/>
				);
			})}

			<Button
				icon={faUser}
				disabled={!formValid}
				clicked={loginSubmitHandler}
			>
				Login
			</Button>
		</React.Fragment>
	);

	return (
		<FormContainer
			icon={faUser}
			title="Login"
			className={["col-md-6", "offset-md-3"]}
			padding="10px"
		>
			<form
				className={[
					classes.Login,
					"p-4",
					"col-md-12",
					"col-sm-12",
				].join(" ")}
				onSubmit={loginSubmitHandler}
			>
				{error && <MessageBox>{error}</MessageBox>}

				{loggingIn ? <LoadingIndicator /> : formContents}
			</form>
		</FormContainer>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	async (context) => {
		await checkServerSideCookie(context);

		const currentState = context.store.getState();

		const token = currentState.authReducer.token;
		const error = currentState.authReucer.error;

		return {
			props: {
				token,
				error,
			},
		};
	}
);

const mapStateToProps = (state) => {
	return {
		error: state.error,
		loggingIn: state.loggingIn,
	};
};

export default connect(mapStateToProps, { authenticate })(Login);
