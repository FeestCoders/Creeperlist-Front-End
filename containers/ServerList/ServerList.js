import React, { Component } from "react";

import { Input, Form, FormControl, Button, Table } from "react-bootstrap";
import Server from "./Server/Server";

import classes from "./ServerList.module.css";

import axios from "../../axios";
import { withRouter } from "next/router";

const _PAGESIZE = 5;

class ServerList extends Component {

	state = {
		servers: [],
		currentPage: 1,
		totalPages: null,
	};

	componentDidMount() {
		let serverUrl = `/servers?page=${this.state.currentPage}&pageSize=${_PAGESIZE}`;

		if (this.props.sponsored) {
			serverUrl = serverUrl + "/sponsored";
		}

		axios({
			url: serverUrl,
			method: "GET",
		})
			.then((result) => {
				console.log(result);

				this.setState({
                    servers: result.data.servers,
                    totalPages: (result.data.total/_PAGESIZE).toFixed()
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}

	serverClickedHandler = (id) => {
		this.props.router.push(`/server/${id}`);
	};

	render() {
		let servers = [...this.state.servers];
		let serversList = <p>No servers to display</p>;

		if (servers.length > 0) {
			if (this.props.filter) {
				servers = servers.filter((server) => {
					console.log(server);

					if (this.props.filter) {
						return server.name.indexOf(this.props.filter) >= 0;
					}

					return true;
				});
			}

			serversList = servers.map((server) => (
				<Server
					key={server.id}
                    id={server.id}
                    rowId={server.rowId}
					name={server.name}
					players={`${server.players_online}/${server.players_max}`}
					online={server.status_current}
					sponsored={this.props.sponsored}
					clicked={this.serverClickedHandler}
				/>
			));
		}

		let paginationButtons = [];
		const maxPageButtons = 5;
		const totalPages = this.state.totalPages;
		const currentPage = this.state.currentPage;

		let displayArrowsLeft = false;
		let displayArrowsRight = true;

		if (totalPages > 1) {
			if (
				currentPage >= maxPageButtons - 2 &&
				totalPages > maxPageButtons
			) {
				displayArrowsLeft = true;

				const start = currentPage - maxPageButtons / 2;
				let end = currentPage + maxPageButtons / 2;

				if (end > totalPages) {
					end = end - (end - totalPages);

					displayArrowsRight = false;
				}

				for (let i = start; i < end; i++) {
					paginationButtons.push(<button>{i.toFixed()}</button>);
				}
			} else {
				displayArrowsLeft = false;

				for (let i = 1; i < maxPageButtons; i++) {
					paginationButtons.push(<button>{i}</button>);
				}
			}
		} else {
            displayArrowsRight = false;
            displayArrowsLeft = false;
        }

		let leftButtons = [
			<button text="<<"></button>,
			<button text="<"></button>,
		];

		let rightButtons = [
			<button text=">"></button>,
			<button text=">>"></button>,
		];

		if (displayArrowsLeft) {
			paginationButtons = [...leftButtons, ...paginationButtons];
		}

		if (displayArrowsRight) {
			paginationButtons = [...paginationButtons, ...rightButtons];
		}

		console.log(paginationButtons);

		return (
			<div>
				<h3 className="mb-4">
					{this.props.sponsored
						? "Sponsored Servers"
						: "Minecraft Servers"}
				</h3>

				<Table response="sm" size="sm" className={classes.ServerList}>
					<thead>
						<tr>
							<th className="text-center">Rank</th>
							<th className="text-left">Name</th>
							<th className="text-left">Server</th>
							<th className="text-center">Players</th>
							<th className="text-center">Status</th>
						</tr>
					</thead>

					<tbody>{serversList}</tbody>
				</Table>

				<div className="row">{paginationButtons}</div>
			</div>
		);
	}
}

export default withRouter(ServerList);
