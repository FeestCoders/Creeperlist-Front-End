import React, { useEffect, useState } from "react";
import { wrapper } from "../../redux";
import { checkServerSideCookie } from "../../redux/actions/auth";
import { useRouter } from "next/router";
import axios from "../../axios";
import Layout from "../../hoc/Layout/Layout";
import ServerView from "../../containers/Server/ServerView/ServerView";
import LoadingIndicator from "../../components/UI/LoadingIndicator/LoadingIndicator";
import Head from "next/head";
import Moment from "moment";

export default function serverIndex(props) {


	const [server, setServer] = useState(null);

	let display = <LoadingIndicator />;

	if (props.server) {
		display = <ServerView {...props.server} />;
	}

	return (
		<Layout authenticated={props.token ? true : false}>
			<Head>
				<title>
					Creeperlist - Viewing {props.server ? props.server.name : "Server"}
				</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			{display}
		</Layout>
	);
}
export const getServerSideProps = wrapper.getServerSideProps(
	async (context) => {
		await checkServerSideCookie(context);
		const token = context.store.getState().authReducer.token;

	

		const { serverId } = context.query;

		let url = "/servers/" + serverId;

		const server = await axios({
			url: url,
			method: "GET",
		})
		.then((result) => result.data[0])
		.catch((error) => console.log(error));

		return {
			props: {
				token,
				server
			},
		};
	}
);
