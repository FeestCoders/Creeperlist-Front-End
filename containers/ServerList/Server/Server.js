import React, { Component } from "react";
import classes from "./Server.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faSpinner,
	faPlug,
	faCopy,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { withRouter } from "next/router";
import StatusIndicator from "../../../components/Server/StatusIndicator/StatusIndicator";

class Server extends Component {
	render() {
		console.log(this.props.online);

		let rank = this.props.rank;

		if (this.props.sponsored) {
			rank = <FontAwesomeIcon icon={faStar} size="1x" />;
		}

		const link = `/server/${this.props.id}`;

		let rankClasses = [classes.Rank];

		if (this.props.sponsored) {
			rankClasses.push(classes.Sponsored);
		}

		return (
			<tr className={[classes.Server].join(" ")}>
				<td className={["text-center", classes.Rank].join(" ")}>
					<span className={rankClasses.join(" ")}>{rank}</span>
				</td>
				<td
					className={[classes.Name, "text-left", "col-name"].join(
						" "
					)}
				>
					<a href={`/server/${this.props.id}`} className={classes.Link}>
						<span
							className="font-weight-bold"
							// onClick={() => this.props.clicked(this.props.id)}
						>
							{this.props.name}
						</span>
					</a>
				</td>
				<td className={classes.Banner}>
					<a href={`/server/${this.props.id}`}>
						<img
							className={classes.banner}
							alt={`Server advertisement banner for ${this.props.name}`}
							title={`Server advertisement banner for ${this.props.name}`}
							src={`${process.env.NEXT_PUBLIC_api}servers/${this.props.id}/banner`}
							// onClick={() => this.props.clicked(this.props.id)}
						/>
					</a>

					<div
						className={["row", "text-right", classes.ServerIp].join(
							" "
						)}
					>
						<FontAwesomeIcon
							icon={faPlug}
							size="1x"
							className="mr-2 ml-1 mt-1"
						/>
						{this.props.ip}
					</div>
				</td>
				<td className={classes.Players}>
					{this.props.players_online}/{this.props.max_players ?? 20}
				</td>
				<td className={["text-center", classes.Status].join(" ")}>
					<StatusIndicator online={this.props.online} />
				</td>
			</tr>
		);
	}
}

export default withRouter(Server);
