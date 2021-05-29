import React from "react";
import RegisterWithRouter from "../../containers/Auth/Register/RegisterWithRouter";
import { wrapper } from "../../redux";
import { checkServerSideCookie } from "../../redux/actions/auth";
import Layout from "../../hoc/Layout/Layout";

import Head from "next/head";

const registerIndex = (props) => {
	return (
		<Layout authenticated={props.token ? true : false}>
			<Head>
				<title>Creeperlist - Register</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<RegisterWithRouter />
		</Layout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	async (context) => {
		checkServerSideCookie(context);
		const token = context.store.getState().authReducer.token;

		return {
			props: {
				token,
			},
		};
	}
);

export default registerIndex;
