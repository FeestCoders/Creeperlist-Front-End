import React from "react";
import { useRouter } from "next/router";
import { wrapper } from "../../../../redux";
import { checkServerSideCookie } from "../../../../redux/actions/auth";
import ServerVote from "../../../../containers/Server/ServerVote/ServerVote";
import axios from "../../../../axios";
import Layout from "../../../../hoc/Layout/Layout";

const serverVoteIndex = ({ token, server }) => {
	const router = useRouter();

	const { serverId } = router.query;

	return (
		<Layout authenticated={token ? true : false}>
			<ServerVote {...server} />
		</Layout>
	);
};

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
				server,
			},
		};
	}
);

export default serverVoteIndex;
