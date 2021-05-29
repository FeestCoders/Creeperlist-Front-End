import React, { Component } from "react";
import classes from "./ManageServer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStar,
	faSpinner,
	faEdit,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { withRouter } from "next/router";

import Button from "../../UI/Button/Button";

class Server extends Component {
	render() {

		let rank = this.props.rank;

		if (this.props.sponsored) {
			rank = <FontAwesomeIcon icon={faStar} size="1x" />;
		}

		const link = `/server/${this.props.id}`;

		return (
			<tr
                className={classes.ManageServer}
                onClick={this.props.clicked}
			>
				<td className="text-center">{this.props.rank}</td>
				<td className={[classes.name, "text-left"].join(" ")}>
					<strong>{this.props.name}</strong>
				</td>
				<td>
					<img
						className={classes.banner}
						src={`${process.env.NEXT_PUBLIC_api}servers/${this.props.id}/banner`}
						onClick={() => this.props.clicked(this.props.id)}
					/>
				</td>
				<td className="text-center">
					{this.props.players_online}/{this.props.max_players ?? 20}
				</td>
				<td className="text-center">
					<FontAwesomeIcon className={classes.ServerAction} icon={faEdit} size="1x" onClick={this.props.editClicked} />

					<FontAwesomeIcon className={classes.ServerAction} icon={faTrash} size="1x" onClick={this.props.deleteClicked}/>

					{this.props.auctionId ? <Button className="w-auto h-auto">Pay</Button> : null}
				</td>
			</tr>
		);
	}
}

export default withRouter(Server);
