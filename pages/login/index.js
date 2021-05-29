import React from "react";
import { wrapper } from "../../redux";
import { checkServerSideCookie } from "../../redux/actions/auth";

import LoginWithRouter from "../../containers/Auth/Login/LoginWithRouter";

import Layout from "../../hoc/Layout/Layout";

import Head from "next/head";

const login = (props) => (
	<Layout autenticated={props.token ? true : false}>
		<Head>
			<title>Creeperlist - Login</title>
			<meta
				name="viewport"
				content="initial-scale=1.0, width=device-width"
			/>
		</Head>
		<LoginWithRouter />
	</Layout>
);

export const getServerSideProps = wrapper.getServerSideProps(
	async (context) => {
		await checkServerSideCookie(context);

		
		const token = context.store.getState().authReducer.token;

		if (token) {
			context.res.writeHead(302, { Location: "/" });
			context.res.end();
		}

		return {
			props: {
				token,
			},
		};
	}
);

export default login;
