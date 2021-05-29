import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import classes from "./ServerView.module.css";
import Moment from "moment";

import StatusIndicator from "../../../components/Server/StatusIndicator/StatusIndicator";
import Button from "../../../components/UI/Button/Button";

import Description from "./Description/Description";
import Stats from "./Stats/Stats";

import MessageBox from "../../../components/UI/MessageBox/MessageBox";
import FormContainer from "../../../components/FormContainer/FormContainer";

import { connect } from "react-redux";
import { JUST_VOTED_CLEAR } from "../../../redux/actionTypes";

const serverView = (props) => {
	const classesArr = [classes.Toolbar];
	const rowClasses = ["row", classes.ServerPropertyRow];
	const router = useRouter();

	const voteButtonClicked = () => {
		router.push(`/server/${router.query.serverId}/vote`);
	};

	const [selectedTab, setSelectedTab] = useState(
		<Description {...props} voteClicked={voteButtonClicked} />
	);

	const justVoted = props.justVoted;

	useEffect(() => {
		if (props.justVoted) {
			return () => {
				props.onJustVotedClear();
			};
		}
	}, []);

	return (
		<div className="container">
			<div className="row">
				{justVoted && (
					<MessageBox type="Success">Thanks for voting!</MessageBox>
				)}

				<div className="col-md-7 mr-0 ml-0 pr-0 pl-0">
					<FormContainer
						title={props.name}
						className={["col-md-12", "mb-4"]}
					>
						<div className="d-flex h-100 col-md-12 col-sm-6 col-xs-6  align-items-center flex-grow flex-flow-row"></div>

						<div className="col-md-12 col-sm-12 d-flex flex-column justify-content-between align-items-center mb-4 mb-sm-4 mb-xs-4 ">
							{selectedTab}
						</div>
					</FormContainer>

					<FormContainer
						title="Statistics"
						className={["col-md-12", "mb-4"]}
					>
						<div className="d-flex h-100 col-md-12 col-sm-6 col-xs-6  align-items-center flex-grow flex-flow-row"></div>

						<div className="col-md-12 col-sm-12 d-flex flex-column justify-content-between align-items-center mb-4 mb-sm-4 mb-xs-4 ">
							<Stats serverId={props.id} />
						</div>
					</FormContainer>
				</div>

				<FormContainer
					title="Details"
					className={["col-md-5"]}
					padding="5px"
				>
					<div
						className={[
							classes.ServerProperties,
							"col-md-12",
							"h-100",
						].join(" ")}
					>
						<div className={rowClasses.join(" ")}>
							<div className="col-md-6">
								<strong>Status</strong>
							</div>

							<div className="col-md-6">
								<StatusIndicator online={props.online} />
							</div>
						</div>

						<div className={rowClasses.join(" ")}>
							<div className="col-md-6">
								<strong>Host / IP</strong>
							</div>

							<div className="col-md-6">{props.ip}</div>
						</div>

						<div className={rowClasses.join(" ")}>
							<div className="col-md-6">
								<strong>Port</strong>
							</div>

							<div className="col-md-6">{props.port}</div>
						</div>

						<div className={rowClasses.join(" ")}>
							<div className="col-md-6">
								<strong>Players</strong>
							</div>

							<div className="col-md-6">
								{props.players_online}/{props.max_players}
							</div>
						</div>

						<div className={rowClasses.join(" ")}>
							<div className="col-md-6">
								<strong>Votes</strong>
							</div>

							<div className="col-md-6">{props.total_votes}</div>
						</div>

						<div className={rowClasses.join(" ")}>
							<div className="col-md-6">
								<strong>Uptime</strong>
							</div>

							<div className="col-md-6">
								{props.uptime.toFixed(2)}%
							</div>
						</div>

						<div className={rowClasses.join(" ")}>
							<div className="col-md-6">
								<strong>Website</strong>
							</div>

							<div className="col-md-6">
								<a href={props.social_website} target="_blank">
									{props.social_website}
								</a>
							</div>
						</div>

						<div className={rowClasses.join(" ")}>
							<div className="col-md-6">
								<strong>Discord</strong>
							</div>

							<div className="col-md-6">
								{props.social_discord}
							</div>
						</div>

						<div className={rowClasses.join(" ")}>
							<div className="col-md-6">
								<strong>Version</strong>
							</div>

							<div className="col-md-6">{props.version}</div>
						</div>

						<div className={rowClasses.join(" ")}>
							<div className="col-md-6">
								<strong>Country</strong>
							</div>

							<div className="col-md-6">{props.country}</div>
						</div>

						<div className={rowClasses.join(" ")}>
							<div className="col-md-6">
								<strong>Last Checked</strong>
							</div>

							<div className="col-md-6">
								{Moment(props.last_polled).fromNow()}
							</div>
						</div>
					</div>
				</FormContainer>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		justVoted: state.globalReducer.justVoted,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onJustVotedClear: () => dispatch({ type: JUST_VOTED_CLEAR }),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(serverView);
