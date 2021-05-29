var Connection = require("tedious").Connection,
	Request = require("tedious").Request,
	TYPES = require("tedious").TYPES;

var config = {
	server: "Creeperlist.database.windows.net",
	options: {
		database: "Creeperlist-sql",
		rowCollectionOnDone: true,
		rowCollectionOnRequestCompletion: true,
		validateBulkLoadParameters: true,
	},
	authentication: {
		type: "default",
		options: {
			userName: "Creeperlist",
			password: "Palmer123",
			encrypt: true,
		},
	},
};

const bulkInsert = (table, columns, objects) => {
	return new Promise((resolve, reject) => {
		var connection = new Connection(config);

		connection.on("connect", function (err) {
			if (err) {
				console.log("Error: ", err);
			}

			var options = { keepNulls: true };
			var bulkLoad = connection.newBulkLoad(
				table,
				options,
				(error, rowCount) => {
					if (error) {
						reject(error);
					}

					resolve(rowCount);
				}
			);

			columns.forEach((column) => {
				bulkLoad.addColumn(column.name, column.type, column.options);
			});

			objects.forEach((item) => {
				bulkLoad.addRow(item);
			});

			try {
				connection.execBulkLoad(bulkLoad);
			} catch (error) {
				reject(error);
			}
		});
	});
};

const insert = (table, object) => {
	return new Promise((resolve, reject) => {
		var connection = new Connection(config);

		connection.on("connect", function (err) {
			if (err) {
				console.log("Error: ", err);
			}

			sql = `INSERT INTO ${table} (${Object.keys(
				object
			)}) VALUES(${Object.keys(object).map((key) => "@" + key)})`;

			request = new Request(sql, (error, result) => {
				if (error) {
					console.log(error);
					reject(error);
				}

				resolve(result);
			});

			Object.keys(object).forEach((key) => {
				request.addParameter(key, object[key].type, object[key].value);
			});

			request.on("row", (columns) => {
				console.log(columns);
			});

			try {
				connection.execSql(request);
			} catch (error) {
				reject(error);
			}
		});
	});
};

const query = async (sql, params) => {
	return new Promise((resolve, reject) => {
		var connection = new Connection(config);
		connection.connect((err) => {
			if (err) {
				console.log("Error: ", err);
			}

			var results = [];

			console.log(`Query recieved: '${sql}'`);

			let request = new Request(sql, (error, rowCount) => {
				if (error) {
					console.log("Request error");
					reject(error);
				}
			});

			if (params && params.length > 0) {
				params.forEach((param) => {
					request.addParameter(param.name, param.type, param.value);
				});
			}

			request.on("doneInProc", (rowCount, more, rows) => {
				resultsArr = [];

				rows.forEach((columns) => {
					var rowObject = {};

					columns.forEach(function (column) {
						rowObject[column.metadata.colName] = column.value;
					});
					resultsArr.push(rowObject);
				});

				resolve(resultsArr);
			});

			request.on("requestCompleted", () => {
				connection.close();
			});
			try {
				connection.execSql(request);
			} catch (error) {
				connection.close();
				reject(error);
			}
		});
	});
};

const deleteRecord = (table, id) => {
	return new Promise((resolve, reject) => {
		var connection = new Connection(config);

		connection.on("connect", function (err) {
			if (err) {
				console.log("Error: ", err);
			}

			let request = new Request(
				`DELETE FROM dbo.${table} WHERE id=@id`,
				(error, rowCount) => {
					if (error) {
						console.log("Request error");
						reject(error);
					}
				}
			);

			request.addParameter("id", TYPES.Int, id);

			request.on("doneInProc", (rowCount, more, rows) => {
				console.log(rowCount);
				resolve(true);
			});

			request.on("requestCompleted", () => {
				connection.close();
			});

			try {
				connection.execSql(request);
			} catch (error) {
				connection.close();
				reject(error);
			}
		});
	});
};

module.exports = {
	query: query,
	insert: insert,
	bulkInsert: bulkInsert,
	delete: deleteRecord,
};
