import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

function App() {
	return (
		<EditableTable/>
	);
}

export default App;

class EditableTable extends React.Component {
	constructor() {
		super();
		this.state = {
			rows: [
				{
					name: "Ilia",
					type: "main",
					color: "#000fff"
				},
				{
					name: "Max",
					type: "side",
					color: "#0f30ff"
				}
			]
		};
	}

	addRow = () => {
		console.log("add row!")
		this.setState((prevState) => {
			let newRowObj = {
				name: "add name",
				type: "add type",
				color: "#000000"
			};

			let newState = [...prevState.rows]
			newState.push(newRowObj);
			return {
				rows: newState,
			}
		})
	}

	deleteRow = (rowNumber) => {
		console.log("delete row!")
		this.setState((prevState) => {
			let newState = [...prevState.rows];

		})
	}

	showColorpick = () => {

	}

	handleCellChange = (dataType) => (event) => { // используем функцию высшего порядка чтобы иметь доступ одновременно к аргументу и к event
		let currentRowNumber = parseInt(event.target.parentNode.dataset.rowId);
		let currentCell = event.target;

		this.setState((prevState) => {
			let newState = [...prevState.rows];
			newState[currentRowNumber][dataType] = currentCell.innerText;

			return {
				rows: newState,
			}
		})

		console.log(this.state);
	}


	render() {
		return (
			<div className="app-container">

				<button onClick={this.addRow}> add table row</button>
				<button onClick={() => this.deleteRow(2)}> delete table row</button>

				<TableContainer className="table-container" component={Paper}>
					<Table size="medium" aria-label="a dense table">
						<TableHead>
							<TableRow>
								<TableCell align="left" width={200}><b>Name</b></TableCell>
								<TableCell align="left" width={200}><b>Type</b></TableCell>
								<TableCell align="left"><b>Color</b>&nbsp;(HEX, RGB, 3rd)</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.state.rows.map((row, index) => (
								<TableRow key={index} data-row-id={index}>
									<TableCell
										align="left"
										contentEditable="true"
										onBlur={this.handleCellChange("name")}
										className="table-cell"
									>
										{row.name}
									</TableCell>

									<TableCell
										align="left"
										contentEditable="true"
										onBlur={this.handleCellChange("type")}
										className="table-cell"
									>
										{row.type}
									</TableCell>

									<TableCell
										align="left"
										style={{backgroundColor: row.color, padding: 0}}
										onClick={this.showColorpick}
										className="table-cell"
									>
										<input
											type="color"
											style={{border: "none", opacity: 0, width: "100%", padding: "16px 0px"}}
											value={row.color}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		);
	}
}
