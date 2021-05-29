import "../styles/globals.css";
import React, { useEffect, useState } from "react";

import { wrapper } from "../redux";

import Head from "next/head";
import "../components/NavigationBar/NavigationBarTransition.css";
function MyApp({ Component, pageProps }) {
	return (
		<React.Fragment>
			<Head>
				<title>Creeperlist - Your minecraft server list</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
				<meta name="description" content="Creeperlist is the best minecraft server list to find active, and friendly minecraft servers, for you and your friends to play on."/>
                <meta name="keywords" content="minecraft, minecraft servers, minecraft server list, mine, list"/>
				<meta name="robots" content="all"/>
			</Head>
			<Component {...pageProps} />
		</React.Fragment>
	);
}

export default wrapper.withRedux(MyApp);
