import React from "react";
import { useRouter } from "next/router";
import { wrapper } from "../redux";
import { checkServerSideCookie } from "../redux/actions/auth";

import Head from "next/head";

import Server from "../containers/ServerList/Server/Server";
import PagedTable from "../components/PagedTable/PagedTable";
import Layout from "../hoc/Layout/Layout";
import store from "../redux";

export default function Home(props) {
	const router = useRouter();

	const serverClickedHandler = (id) => {
		router.push(`/server/${id}`);
	};

	return (
		<Layout authenticated={props.token ? true : false}>
			<div className="row">
				<div className="col-md-12">
					<PagedTable
						title="Sponsored Servers"
						url="/servers/sponsored"
						noDataMsg={
							<div className="col-md-12 mt-5">
								<p className="mx-auto">
									<strong>
										There are currently no sponsored
										servers,{" "}
										<a href="/contact-us?subject=Server Sponsorship">
											click here
										</a>{" "}
										to enquire.
									</strong>
								</p>
							</div>
						}
						page={1}
						pageSize={5}
						maxButtonsCount={6}
						columnsRenderer={() => {
							// ["Rank", "Name", "Server", "Players", "Status"]
							return (
								<React.Fragment>
									<th>Rank</th>
									<th className="d-sm-none">Name</th>
									<th>Server</th>
									<th>Players</th>
									<th>Status</th>
								</React.Fragment>
							);
						}}
						itemRenderer={(dataItem) => {
							return (
								<Server
									{...dataItem}
									key={dataItem.id}
									clicked={serverClickedHandler}
								/>
							);
						}}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-md-12">
					<PagedTable
						title="Server List"
						url="/servers"
						noDataMsg={
							<div className="col-md-12 mt-5">
								<p className="mx-auto text-bold">
									<strong>
										There are currently no servers to list.
									</strong>
								</p>
							</div>
						}
						page={1}
						pageSize={15}
						maxButtonsCount={6}
						columnsRenderer={() => {
							// ["Rank", "Name", "Server", "Players", "Status"]
							return (
								<React.Fragment>
									<th>Rank</th>
									<th className="d-md-table-cell d-sm-none">
										Name
									</th>
									<th>Server</th>
									<th>Players</th>
									<th>Status</th>
								</React.Fragment>
							);
						}}
						itemRenderer={(dataItem) => {
							return (
								<Server
									{...dataItem}
									key={dataItem.id}
									clicked={serverClickedHandler}
								/>
							);
						}}
					/>
				</div>
			</div>
		</Layout>
	);
}

export const getServerSideProps = wrapper.getServerSideProps(
	async (context) => {
		await checkServerSideCookie(context);

		const token = context.store.getState().authReducer.token;

		return {
			props: {
				token,
			},
		};
	}
);
