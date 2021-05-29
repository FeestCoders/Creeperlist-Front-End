import React, { useEffect, useState } from "react";
import axios from "../../../../axios";
import XAxisDayOfWeek from "../../../../components/UI/Chart/Ticks/XAxisDayOfWeek";
import Moment from "moment";

import {
	LineChart,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	Line,
	ResponsiveContainer,
} from "recharts";
import LoadingIndicator from "../../../../components/UI/LoadingIndicator/LoadingIndicator";
import xAxisDayOfWeek from "../../../../components/UI/Chart/Ticks/XAxisDayOfWeek";

const stats = (props) => {
	const [viewMetric, setViewMetric] = useState("players_online");
	const [latestData, setLatestData] = useState(null);
	const [viewData, setViewData] = useState(null);

	useEffect(() => {
		axios
			.get(`/servers/${props.serverId}/stats`)
			.then((result) => {
				setLatestData(result.data);
			})
			.catch((err) => {
				console.log("Error: ", err);
			});
	}, [props.serverId]);

	useEffect(() => {
		if (latestData) {
			setViewData(latestData[viewMetric]);
		}
	}, [latestData, viewMetric]);

	const metricSelectorChangedHandler = (event) => {
		const metric = event.target.value;

		const loadedData = { ...latestData };

		console.log("Changing to: " + metric, loadedData[metric]);

		setViewMetric(metric);
	};

	let yAxisConfiguration = <YAxis dataKey="value" type="number" />;

	console.log(viewMetric);
	switch (viewMetric) {
		case "version":
		case "online":
			yAxisConfiguration = <YAxis dataKey="value" type="category" />;
			break;
	}

	let chart = <LoadingIndicator className="mb-auto mt-auto" />;

	if (viewData && latestData) {
		chart = (
			<div className="w-100 h-100 p-4">
				<p>
					Creeperlist keeps track of a few metrics related to this
					server, please select from the available list below.
				</p>

				<div className="row mt-4 text-center">
					<div className="mx-auto">
						Metric:
						<select
							className="ml-2"
							defaultValue={viewMetric}
							onChange={(event) =>
								metricSelectorChangedHandler(event)
							}
						>
							{Object.keys(latestData).map((key) => {
								const label = (
									key.substr(0, 1).toUpperCase() +
									key.substr(1).toLowerCase()
								).replace("_", " ");

								return (
									<option key={key} value={key}>
										{label}
									</option>
								);
							})}
						</select>
					</div>
				</div>
				<div className="row w-100 h-100">
					<ResponsiveContainer
						height={350}
						width="100%"
						className="mt-auto mb-auto"
					>
						<LineChart
							data={viewData}
							margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
						>
							<XAxis
								dataKey="datetime"
								scale="time"
								domain={["auto", "auto"]}
								interval={24}
								tickFormatter={(tickItem) =>
									Moment(tickItem).format("dddd")
								}
							/>

							<Tooltip />
							<CartesianGrid stroke="#f5f5f5" />

							{yAxisConfiguration}
							<Line
								type="monotone"
								dataKey="value"
								stroke="#387908"
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		);
	}

	return chart;
};

export default stats;
