import React, { useEffect, useState } from "react";
import { wrapper } from "../../../redux";
import { checkServerSideCookie } from "../../../redux/actions/auth";
import { useRouter } from "next/router";
import Layout from "../../../hoc/Layout/Layout";
import ServerAdd from "../../../containers/Server/ServerAdd/ServerAdd";
import FormContainer from "../../../components/FormContainer/FormContainer";

import Head from "next/head";
const manageServer = (props) => {
	const router = useRouter();
	const { serverId } = router.query;

	return (
		<Layout authenticated={props.token ? true : false}>
			<Head>
				<title>Creeperlist - Update Server</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>

			<FormContainer
				title="Update Server"
				className={["col-md-6 offset-md-3"]}
				padding="5px"
			>
				<ServerAdd id={serverId} />
			</FormContainer>
		</Layout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	async (context) => {
		await checkServerSideCookie(context);

		const token = context.store.getState().authReducer.token;

		if (!token) {
			context.res.writeHead(302, { Location: "/login" });
			context.res.end();
		}
		return {
			props: {
				token,
			},
		};
	}
);

export default manageServer;
