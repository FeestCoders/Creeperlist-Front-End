import React from "react";
import { wrapper } from "../../../redux";
import { checkServerSideCookie } from "../../../redux/actions/auth";
import { useRouter } from "next/router";
import Layout from "../../../hoc/Layout/Layout";
import ServerAdd from "../../../containers/Server/ServerAdd/ServerAdd";
import FormContainer from "../../../components/FormContainer/FormContainer";

import Head from "next/head";
export default function addServerIndex(props) {
	return (
		<Layout authenticated={props.token ? true : false}>
			<Head>
				<title>Creeperlist - Add Server</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>

			<FormContainer
				title="Add Server"
				className={["col-md-8 offset-md-2"]}
				padding="5px"
			>
				<ServerAdd />
			</FormContainer>
		</Layout>
	);
}

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
