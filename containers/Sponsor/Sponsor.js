import React, { useEffect, useState, useRef } from "react";

import FormContainer from "../../components/FormContainer/FormContainer";

import {
	faStar,
	faInfoCircle,
	faList,
} from "@fortawesome/free-solid-svg-icons";

import axios from "../../axios";

import LoadingIndicator from "../../components/UI/LoadingIndicator/LoadingIndicator";

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import PagedTable from "../../components/PagedTable/PagedTable";
import MessageBox from "../../components/UI/MessageBox/MessageBox";

import Moment from "moment";

const sponsor = (props) => {
	const [auctionInfo, setAuctionInfo] = useState(null);
	const [myServers, setMyServers] = useState(null);
	const [bid, setBid] = useState({
		server: null,
		amount: null,
	});

	const [currentTime, setCurrentTime] = useState(null);

	const [error, setError] = useState(null);

	const bidTableRef = useRef(null);

	useEffect(() => {
		axios.get("/auction/latest").then((result) => {
			if (result.status === 200) {
				setAuctionInfo(result.data);
			}
		});

		axios.get("/servers/myservers").then((result) => {
			if (result.status === 200) {
				setMyServers(result.data.data);
			}
		});
	}, []);

	useEffect(() => {
		if (auctionInfo) {
			bidTableRef.current.loadPage();
		}
	}, [auctionInfo]);

	useEffect(() => {
		if (myServers && myServers.length > 0) {
			setBid({ ...bid, server: myServers[0].id });
		}
	}, [myServers]);

	const bidServerSelectHandler = (e) => {
		setBid({ ...bid, server: e.target.value });
	};

	const bidAmountChangeHandler = (e) => {
		setBid({ ...bid, amount: e.target.value });
	};

	const bidPlaceClickHandler = (e) => {
		setError(null);

		const server = bid.server;
		const amount = bid.amount;

		//Get latest bid from bids table
		let topBid = 0;

		if (bidTableRef.current.state.data.length > 0) {
			topBid = bidTableRef.current.state.data[0].amount;
		}

		if (isNaN(amount)) {
			setError("The entered amount is not a valid number");
			return;
		}

		if (amount < auctionInfo["Minimum Bid"]) {
			setError(
				"The minimum bid amount is $" + auctionInfo["Minimum Bid"]
			);
			return;
		}

		if (amount.indexOf(".") > -1) {
			setError("Your bid must be a round whole dollar amount.");
			return;
		}

		const data = {
			serverId: server,
			amount: amount,
		};

		axios
			.post(`/auction/${auctionInfo["ID"]}/bids`, data)
			.then((result) => {
				if (result.data.code === 400) {
					setError(result.data.errors);
					return;
				}

				bidTableRef.current.loadPage();
			});
	};

	let serverOptions = [];

	if (myServers) {
		serverOptions = myServers.map((server) => {
			return { text: server.name, value: server.id };
		});
	}

	let bidContainerContent = <LoadingIndicator />;

	if (auctionInfo) {
		if (auctionInfo["Active"] === 1) {
			bidContainerContent = (
				<div className="mt-2 container-fluid">
					<div className="row">
						{error && <MessageBox>{error}</MessageBox>}
					</div>
					<div className="row">
						<Input
							attributes={{ type: "select" }}
							options={serverOptions}
							changed={bidServerSelectHandler}
						/>
					</div>
					<div className="row">
						<Input
							className="mb-0"
							attributes={{
								type: "text",
								placeholder: "Enter your bid",
								value: bid.amount,
							}}
							changed={bidAmountChangeHandler}
						/>

						<Button clicked={bidPlaceClickHandler}>
							Place Bid
						</Button>
					</div>
				</div>
			);
		} else {

			bidContainerContent = (
				<div className="mt-2 container-fluid text-center">
					<p>
						This auction is currently closed. Please come back later.
					</p>
				</div>
			)
		}
	}

	return (
		<React.Fragment>
			<FormContainer
				icon={faStar}
				title="Go Sponsored"
				className={["col-md-12"]}
				padding="10px"
			>
				<p className="text-justify">
					Sponsored server status elevates your server above the rest.
					A sponsored server appears above the main server list and
					are servers users first see when they visit Creeperlist.
				</p>

				<p className="text-justify">
					There are a total of 5 sponsored slots available, and are
					auctioned off every two weeks.
				</p>

				<p className="text-justify">
					Accepted payments methods are via PayPal.
				</p>
			</FormContainer>

			<FormContainer
				icon={faInfoCircle}
				title="Auction Informaton"
				className={["col-md-12", "mt-2"]}
			>
				{!auctionInfo ? (
					<LoadingIndicator />
				) : (
					<PagedTable
						data={auctionInfo}
						columns={Object.keys(auctionInfo).filter(
							(key) => key !== "ID"
						)}
						itemRenderer={(dataItem) => {
							return (
								<tr key={dataItem["ID"]}>
									{Object.keys(dataItem).map((key) => {
										let value = dataItem[key];

										if (typeof value == "string") {
											value = Moment(value)
												.utc()
												.format("lll");
										}

										return key !== "ID" ? (
											<td>{value}</td>
										) : null;
									})}
								</tr>
							);
						}}
					/>
				)}
			</FormContainer>

			<div className="container-fluid mt-3">
				<div className="row justify-content-around d-flex">
					<FormContainer
						title="Place a bid"
						className={["col-md-6"]}
						padding="10px"
					>
						{bidContainerContent}
					</FormContainer>

					<FormContainer
						icon={faList}
						title="Auction Bids"
						className={["col-md-6"]}
						padding="0px"
					>
						<PagedTable
							ref={bidTableRef}
							url={`/auction/${
								auctionInfo ? auctionInfo["ID"] : 0
							}/bids`}
							noDataMsg={
								<div className="col-md-12 mt-3">
									<p className="mx-auto">
										<strong>
											No bids have been placed
										</strong>
									</p>
								</div>
							}
							page={1}
							pageSize={10}
							maxButtonsCount={6}
							columns={["Server", "Amount"]}
							itemRenderer={(dataItem) => {
								return (
									<tr key={dataItem.id}>
										<td className="p-2">
											<strong>{dataItem.name}</strong>
										</td>
										<td className="p-2">
											${dataItem.amount.toFixed(0)}
										</td>
									</tr>
								);
							}}
						/>
						{/* 						
						{!auctionInfo ? (
							<LoadingIndicator />
						) : (
							<table width="100%">
								<tbody>
									{Object.keys(auctionInfo).map((key) => {
										return (
											<tr key={key}>
												<td className="font-weight-bold">
													{key}
												</td>
												<td>{auctionInfo[key]}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						)} */}
					</FormContainer>
				</div>
			</div>
		</React.Fragment>
	);
};

export default sponsor;
