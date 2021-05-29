import React, { useEffect, useState } from "react";
import { wrapper } from "../../redux";
import { checkServerSideCookie } from "../../redux/actions/auth";
import jwt from "jsonwebtoken";
import { isEmail } from "../../shared/formValidation";

import FormContainer from "../../components/FormContainer/FormContainer";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import Layout from "../../hoc/Layout/Layout";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import LoadingIndicator from "../../components/UI/LoadingIndicator/LoadingIndicator";
import MessageBox from "../../components/UI/MessageBox/MessageBox";
import Head from "next/head";

import axios from "../../axios";

const contactIndex = (props) => {
	const [formValid, setFormValid] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	const [state, setState] = useState({
		controls: {
			email: {
				attributes: {
					label: "Your email",
					id: "email",
					name: "email",
					value: props.email,
					type: "email",
					placeholder: "Email address",
				},
				valid: props.email ? true : false,
				touched: false,
				validation: (value) => isEmail(value),
			},
			subject: {
				attributes: {
					label: "Subject",
					id: "subject",
					name: "subject",
					value: props.subject,
					type: "text",
					placeholder: "Enter a message subject",
				},
				valid: props.subject ? true : false,
				touched: false,
				validation: (value) => {
					return value.length > 0;
				},
			},
			message: {
				attributes: {
					label: "Message",
					id: "message",
					name: "message",
					value: "",
					type: "textarea",
					placeholder: "Enter a message",
				},
				valid: false,
				touched: false,
				validation: (value) => {
					return value.length > 0;
				},
			},
		},
	});

	useEffect(() => {}, []);

	const contactSubmitHandler = async (e) => {
		e.preventDefault();

        setMessage(null);
        setError(null);
        
		if (formValid) {
			setLoading(true);

			const email = state.controls["email"].attributes.value;
			const subject = state.controls["subject"].attributes.value;
			const message = state.controls["message"].attributes.value;

			axios
				.post("/contact-us", { email, subject, message })
				.then((result) => {
					setMessage(
						"Your message has been sent, we will reply to you as soon as possible."
					);
				})
				.catch((error) => {
					setError(
						"We were un-able to send your message at this time, please try again later, or email us directly at Creeperlist.servers@gmail.com."
					);
				})
				.finally(() => setLoading(false));
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

	let formBody = <LoadingIndicator />;

	if (!loading) {
		formBody = (
			<React.Fragment>
                {message && <MessageBox type="Success">{message}</MessageBox>}
                {error && <MessageBox>{error}</MessageBox>}

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
				<Button disabled={!formValid} clicked={contactSubmitHandler}>
					Send
				</Button>
			</React.Fragment>
		);
	}

	return (
		<Layout authenticated={props.token ? true : false}>
			<Head>
				<title>
					Creeperlist - Contact us
				</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>

				<link rel="canonical" href="https://example.com/contact-us" />
			</Head>

			<FormContainer
				icon={faEnvelope}
				title="Contact Us"
				className={["col-md-8", "offset-md-2"]}
				padding="10px"
			>
				{formBody}
			</FormContainer>
		</Layout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	async (context) => {
		await checkServerSideCookie(context);

		const token = context.store.getState().authReducer.token;
		const subject = context.query.subject ?? "";
		let email = "";

		const userInfo = await axios
			.get("/user")
			.then((result) => result.data)
			.catch((err) => null);

		if (userInfo) {
			console.log(userInfo);
			email = userInfo.email;
		}

		return {
			props: {
				token,
				subject,
				email,
			},
		};
	}
);

export default contactIndex;
