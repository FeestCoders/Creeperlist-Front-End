import React, { useState } from "react";
import classes from "./ConfirmDialog.module.css";
import Button from "../Button/Button";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";

const confirmDialog = (props) => {
	const [loading, setLoading] = useState(false);

	const cancelClickedHandler = () => props.cancel();

	const confirmClickedHandler = async () => {
		setLoading(true);

		await props.confirm();

		setLoading(false);
	};
	
	return props.show ? (
		<React.Fragment>
			<div className={classes.BackDrop}></div>

			<div className={classes.ConfirmDialog}>
				<div className="container">
					{loading ? (
						<LoadingIndicator />
					) : (
						<React.Fragment>
							<div className="row text-center">
								<div className="col-md-12">
									<h3 className="mx-auto">{props.title}</h3>
								</div>
							</div>

							<div className="row text-center mt-4">
								<div className="col-md-12">
									<h6>{props.subtitle}</h6>
								</div>
							</div>

							<div className="row mt-4">
								<div className="col-md-6">
									<Button clicked={cancelClickedHandler}>
										Cancel
									</Button>
								</div>
								<div className="col-md-6">
									<Button clicked={confirmClickedHandler}>OK</Button>
								</div>
							</div>
						</React.Fragment>
					)}
				</div>
			</div>
		</React.Fragment>
	) : null;
};

export default confirmDialog;
