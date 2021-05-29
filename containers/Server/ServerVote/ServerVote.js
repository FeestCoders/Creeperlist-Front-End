import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Button from "../../../components/UI/Button/Button";
import { useRouter } from "next/router";
import Input from "../../../components/UI/Input/Input";
import publicIp from "public-ip";
import axiosBase from "axios";
import axios from "axios";
import axiosApi from "../../../axios";

import MessageBox from "../../../components/UI/MessageBox/MessageBox";
import LoadingIndicator from "../../../components/UI/LoadingIndicator/LoadingIndicator";

import { connect } from "react-redux";

import { JUST_VOTED } from "../../../redux/actionTypes";

const serverVoteIndex = (props) => {
	const router = useRouter();

	// If your site is on Cloudflare, then you can use '/cdn-cgi/trace' instead

	const cancelButtonClickedHandler = (e) => {
		e.preventDefault();

		router.push(`/server/${props.id}`);
	};

	const [error, setError] = useState(null);

	const [loading, setLoading] = useState(false);

	const [fromIsValid, setFormIsValid] = useState(false);

	const [recaptchaValue, setRecaptchaValue] = useState(null);

	const [controls, setControls] = useState({
		username: {
			attributes: {
				label: "Minecraft username",
				id: "username",
				name: "username",
				value: "",
				type: "text",
				placeholder: "Your minecraft username",
			},
			valid: false,
			touched: false,
			validation: (value) => value.length > 0,
		},
	});



	const formInputChangedHandler = (e) => {
		const element = e.target.id;
		const elementVal = e.target.value;

		let controlsState = { ...controls };

		let control = controlsState[element];

		control.touched = true;
		control.attributes.value = elementVal;

		if (control.validation) {
			control.valid = control.validation(elementVal);
		}

		checkIsFormValid();

		setControls(controlsState);
	};

	const checkIsFormValid = () => {
		let controlsState = { ...controls };

		let formValid = true;
		Object.keys(controlsState).forEach((key) => {
			let valid = controlsState[key].valid;

			formValid = valid && formValid;
		});

		console.log(recaptchaValue);

		formValid = formValid && recaptchaValue;

		setFormIsValid(formValid);
	};

	const recaptchaChanged = (value) => {
		setRecaptchaValue(value);
	};

	useEffect(() => {
		if (recaptchaValue) {
			checkIsFormValid();
		}
	}, [recaptchaValue]);

	const voteServerClickHandler = async (e) => {
		e.preventDefault();

		let clientIp = "Unknown";

		setLoading(true);

		clientIp = await publicIp.v4({
			fallbackUrls: ["https://ifconfig.co/ip"],
		});

		const data = {
			clientIp: clientIp,
			minecraftUsername: controls["username"].attributes.value,
			recaptcha: recaptchaValue
		};

		axiosApi
			.post(`/servers/${props.id}/vote`, data)
			.then((result) => {
				if (result.status === 200 && !result.data.error) {
                    new Promise((resolve, reject) => {
                        props.onJustVoted();
                        resolve();
                    }).then(() => {
                        router.push({
                            pathname: `/server/${props.id}`,
                        });
                    });
                    
                    
				} else {
					if (result.data.error) {
						setError(result.data.error);
					}
				}
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => setLoading(false));
	};

	return (
		<div className="container">
			<div className="col-md-6 offset-md-3">
				{error && <MessageBox>{error}</MessageBox>}
				<form className="p-4">
					{loading ? (
						<LoadingIndicator />
					) : (
						<React.Fragment>
							<div className="row ml-0 mr-0">
								<h4>Voting for {props.name}</h4>
							</div>

							<div className="row mt-2 ml-0 mr-0">
								{Object.keys(controls).map((controlKey) => {
									const control = controls[controlKey];

									return (
										<Input
											attributes={control.attributes}
											key={controlKey}
											valid={control.valid}
											touched={control.touched}
											options={control.options}
											defaultOption={
												control.defaultOption
											}
											changed={(event) =>
												formInputChangedHandler(event)
											}
										/>
									);
								})}
							</div>

							<div className="row text-center mt-2">
								<ReCAPTCHA
									sitekey="6LeDoi8aAAAAAHS4_4avtUFw1wIAwfwg6GbhGo-k"
									onChange={recaptchaChanged}
									className="mx-auto"
								/>
							</div>

							<div className="row mt-4">
								<div className="col-md-6">
									<Button
										clicked={cancelButtonClickedHandler}
									>
										Cancel
									</Button>
								</div>
								<div className="col-md-6">
									<Button
										disabled={!fromIsValid}
										clicked={voteServerClickHandler}
									>
										Vote
									</Button>
								</div>
							</div>
						</React.Fragment>
					)}
				</form>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
    return {
        justVoted: state.globalReducer.justVoted
    }
}

const mapDispatchToProps = (dispatch) => {
	return {
		onJustVoted: () => dispatch({ type: JUST_VOTED }),
	};
};

export default connect(null, mapDispatchToProps)(serverVoteIndex);
