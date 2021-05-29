
import React from "react";
import { wrapper } from "../../redux";
import { checkServerSideCookie } from "../../redux/actions/auth";

import Sponsor from "../../containers/Sponsor/Sponsor";
import Layout from "../../hoc/Layout/Layout";

const sponsorIndex = (props) => {
	return (
		<Layout authenticated={props.token ? true : false}>
			<Sponsor />
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
				token
			},
		};
	}
);


export default sponsorIndex;
