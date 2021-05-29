import axios from "../../axios";
import React, { Component } from "react";
import { wrapper } from "../../redux";
import { Input, Form, FormControl, Button, Table } from "react-bootstrap";
import classes from "./PagedTable.module.css";

import LoadingIndicator from "../UI/LoadingIndicator/LoadingIndicator";

import { connect } from "react-redux";

class PagedTable extends Component {
	state = {
		currentPage: this.props.page,
		loading: false,
		data: null,
		error: null,
		totalPages: 1,
		url: null,
	};

	componentDidMount() {
		if (this.props.data) {

			this.setState({
				loading: false,
				data: [{...this.props.data}],
				currentPage: 1,
				totalPages: 1,
			});

		} else {
			this.loadPage();
		}
	}

	loadPage = (page) => {
		if (!page) {
			page = this.state.currentPage;
		}

		let url = `${this.props.url}?page=${page}&pageSize=${this.props.pageSize}`;

		this.setState({ loading: true });

		axios({
			url: url,
			method: "GET",
		})
			.then((result) => {
				console.log("Table result = ", result);
				this.setState({
					loading: false,
					data: result.data.data,
					currentPage: page,
					totalPages: parseInt(
						Math.ceil(result.data.total / this.props.pageSize)
					),
				});
			})
			.catch((error) => {
				this.setState({ loading: false, error: error });
			});
	};

	setPageHandler = (page) => {

		if(page > this.state.totalPages) {
			return;
		}

		this.loadPage(page);
	};

	render() {
		let tableContent = (
			<tr>
				<td colSpan="100%">
					<div className="pt-5">
						<LoadingIndicator />
					</div>
				</td>
			</tr>
		);

		if (!this.state.loading) {
			if (this.state.data && this.state.data.length > 0) {
				tableContent = this.state.data.map((dataItem) =>
					this.props.itemRenderer(dataItem)
				);
			} else {
				tableContent = (
					<tr>
						<td colSpan="100%">
							<div className="text-center">
								{this.props.noDataMsg ?? (
									<h5>No data to display</h5>
								)}
							</div>
						</td>
					</tr>
				);
			}
		}

		let paginationButtons = [];
		let displayArrowsLeft = false;
		let displayArrowsRight = true;
		let pageButtonClasses = [classes.Button];

		if (this.state.totalPages > 1) {
			if (this.state.totalPages >= this.props.maxButtonsCount) {
				if (
					this.state.currentPage >= this.props.maxButtonsCount - 2 &&
					this.state.totalPages > this.props.maxButtonsCount
				) {
					displayArrowsLeft = true;

					let start = parseInt(
						this.state.currentPage - this.props.maxButtonsCount / 2
					);

					let end = parseInt(
						this.state.currentPage + this.props.maxButtonsCount / 2
					);

					if (end > this.state.totalPages) {
						end = start + (this.state.totalPages - start) + 1;
						start -= this.props.maxButtonsCount - (end - start);
						if (start < 1) {
							start = 1;
						}

						displayArrowsRight = false;
					}

					for (let i = start; i <= end; i++) {
						i === this.state.currentPage
							? (pageButtonClasses = [
									classes.PageButton,
									classes.activePage,
							  ])
							: (pageButtonClasses = [classes.PageButton]);

						paginationButtons.push(
							<button
								className={pageButtonClasses.join(" ")}
								key={i}
								onClick={() => this.setPageHandler(i)}
							>
								{i}
							</button>
						);
					}
				} else {
					displayArrowsLeft = false;

					for (let i = 1; i <= this.props.maxButtonsCount; i++) {
						i === this.state.currentPage
							? (pageButtonClasses = [
									classes.PageButton,
									classes.activePage,
							  ])
							: (pageButtonClasses = [classes.PageButton]);

						paginationButtons.push(
							<button
								key={i}
								className={pageButtonClasses.join(" ")}
								onClick={() => this.setPageHandler(i)}
							>
								{i}
							</button>
						);
					}
				}
			} else {
				for (let i = 1; i <= this.state.totalPages; i++) {
					i === this.state.currentPage
						? (pageButtonClasses = [
								classes.PageButton,
								classes.activePage,
						  ])
						: (pageButtonClasses = [classes.PageButton]);

					paginationButtons.push(
						<button
							key={i}
							className={pageButtonClasses.join(" ")}
							onClick={() => this.setPageHandler(i)}
						>
							{i}
						</button>
					);
				}

				displayArrowsRight = false;
				displayArrowsLeft = false;
			}
		} else {
			displayArrowsRight = false;
			displayArrowsLeft = false;
		}

		let leftButtons = [
			<button
				key="toStart"
				className={classes.PageButton}
				onClick={() => this.setPageHandler(1)}
			>
				{"<<"}
			</button>,
			<button
				key="backOne"
				className={classes.PageButton}
				onClick={() => this.setPageHandler(this.state.currentPage - 1)}
			>
				{"<"}
			</button>,
		];

		let rightButtons = [
			<button
				key="forwardOne"
				className={classes.PageButton}
				onClick={() => this.setPageHandler(this.state.currentPage + 1)}
			>
				{">"}
			</button>,
			<button
				key="toEnd"
				className={classes.PageButton}
				onClick={() => this.setPageHandler(this.state.totalPages)}
			>
				{">>"}
			</button>,
		];

		if (displayArrowsLeft) {
			paginationButtons = [...leftButtons, ...paginationButtons];
		}

		if (displayArrowsRight) {
			paginationButtons = [...paginationButtons, ...rightButtons];
		}

	

		return (
			<React.Fragment key={this.props.key}>
				{this.props.title && (
					<h1 className={["mb-4", classes.Title].join(' ')}>{this.props.title}</h1>
				)}

				<table
					key={new Date().getTime()}
					className={classes.PagedTable}
				>
					<thead>
						<tr>

							{this.props.columns && this.props.columns.map((column) => (
								<th key={column}>{column}</th>
							))}

							{this.props.columnsRenderer && this.props.columnsRenderer()}
						</tr>
					</thead>

					<tbody>{tableContent}</tbody>
				</table>

				<div className="container mt-5">
					<div className="row">
						<div className="col-md-6 offset-md-3 text-center">
							{paginationButtons}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default PagedTable;
