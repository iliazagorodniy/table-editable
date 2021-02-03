import React from "react";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { ChromePicker } from "react-color";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const getListStyle = isDraggingOver => ({
	background: isDraggingOver ? "lightblue" : "white",
});

const getItemStyle = (isDragging, draggableStyle) => ({
	// change background colour if dragging
	background: isDragging ? "lightgreen" : "white",

	// styles we need to apply on draggables
	...draggableStyle,
});

class EditableTable extends React.Component {
	constructor() {
		super();
		this.state = {
			rows: []
		};
		this.onDragEnd = this.onDragEnd.bind(this);
	}

	componentDidMount() {
		if (localStorage.getItem('tableRows') !== "" && localStorage.length !== 0) {
			let localStorageRawData = localStorage.getItem('tableRows');
			let localStorageParsedData = localStorageRawData.split('AND').map((item) => JSON.parse(item));
			this.setState({
				rows: localStorageParsedData
			})
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		let stringFromArr = this.state.rows.map((row) => JSON.stringify(row)).join('AND');
		if (localStorage.tableRows === undefined ) {
			localStorage.setItem('tableRows', stringFromArr);
		} else {
			localStorage.tableRows = stringFromArr;
		}
	}

	onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		const rows = reorder(
			this.state.rows,
			result.source.index,
			result.destination.index
		);

		this.setState({
			rows
		});
	}

	addRow = (currentRowIndex) => {
		console.log("add row!")
		this.setState((prevState) => {
			let newRowObj = {
				name: "add name",
				type: "add type",
				color: "#000000",
				displayColorPicker: false,
			};
			let newState;

			if (prevState.rows.length === 0) {
				newState = [newRowObj];
			} else {
				newState = [...prevState.rows]
				let newStateBeforeInsert = newState.slice(0, currentRowIndex + 1);
				newStateBeforeInsert.push(newRowObj);
				let newStateAfterInsert = newState.slice(currentRowIndex + 1, newState.length);
				newState = newStateBeforeInsert.concat(newStateAfterInsert);
			}
			return {
				rows: newState,
			}
		})
	}

	deleteRow = (currentRowIndex) => {
		console.log("delete row!")
		this.setState((prevState) => {
			let newState = [...prevState.rows];
			let newStateBeforeInsert = newState.slice(0, currentRowIndex);
			let newStateAfterInsert = newState.slice(currentRowIndex + 1, newState.length);
			newState = newStateBeforeInsert.concat(newStateAfterInsert);
			return {
				rows: newState,
			}
		})
	}

	handleClick = (currentRowIndex) => {
		console.log("open colorpick")
		this.setState((prevState) => {
			let newState = [...prevState.rows];
			let isColorPickerOpened = newState[currentRowIndex].displayColorPicker;
			console.log(isColorPickerOpened);
			newState[currentRowIndex].displayColorPicker = !isColorPickerOpened;

			return {
				rows: newState
			}
		})
		console.log(this.state);
	}

	handleClose = (currentRowIndex) => {
		console.log("close colorpick")
		this.setState((prevState) => {
			let newState = [...prevState.rows];
			newState[currentRowIndex].displayColorPicker = false;

			return {
				rows: newState
			}
		})
		console.log(this.state);
	}

	handleColorChange = (color) => {
		this.setState((prevState) => {
			let newState = [...prevState.rows];
			let currentRowIndex
			newState.forEach((tableRow, index) => {
				if (tableRow.displayColorPicker) {
					currentRowIndex = index
				}
			})
			newState[currentRowIndex].color = color.hex;

			return {
				rows: newState
			}
		});
	};

	handleCellChange = (dataType) => (event) => { // используем функцию высшего порядка чтобы иметь доступ одновременно к аргументу и к event
		let currentRowIndex = parseInt(event.target.parentNode.dataset.rowId);
		let currentCell = event.target;

		this.setState((prevState) => {
			let newState = [...prevState.rows];
			newState[currentRowIndex][dataType] = currentCell.innerText;

			return {
				rows: newState,
			}
		})

		console.log(this.state);
	}


	render() {

		const popover = {
			position: 'absolute',
			marginLeft: '-220px',
			marginTop: '20px',
			zIndex: '10000',
		}
		const cover = {
			position: 'fixed',
			top: '0px',
			right: '0px',
			bottom: '0px',
			left: '0px',
		}
		return (
			<div className="app-container">

				<DragDropContext onDragEnd={this.onDragEnd}>
					<Droppable droppableId="droppable">
						{(provided, snapshot) => (
							<TableContainer style={{maxHeight: 600}} className="table-container" component={Paper}>
								<Table stickyHeader size="medium" aria-label="a dense table">
									<TableHead>
										<TableRow>
											<TableCell align="left" width={200}><b>Name</b></TableCell>
											<TableCell align="left" width={200}><b>Type</b></TableCell>
											<TableCell width={200} align="left"><b>Color</b>&nbsp;(HEX, RGB, 3rd)</TableCell>
											<TableCell width={200} />
										</TableRow>
									</TableHead>
									{ this.state.rows.length === 0
										?
										<TableBody>
											<TableRow>
												<TableCell width={200} align="left" style={{color: "#bbb"}}>{"add name"}</TableCell>

												<TableCell width={200} align="left" style={{color: "#bbb"}}>{"add type"}</TableCell>

												<TableCell width={200} align="left" style={{backgroundColor: "#bbb", padding: 0}}></TableCell>

												<TableCell  width={200}>
													<ButtonGroup color="primary">
														<IconButton size="medium" style={{color: "#bbb"}} color="disabled" >
															<DragHandleIcon />
														</IconButton>

														<IconButton size="medium" style={{color: "green"}} color="disabled" onClick={() => this.addRow(0)}>
															<AddIcon />
														</IconButton>

														<IconButton size="medium" style={{color: "#bbb"}} color="disabled">
															<DeleteIcon />
														</IconButton>
													</ButtonGroup>
												</TableCell>
											</TableRow>
										</TableBody>
										:
										<TableBody
											{...provided.droppableProps}
											ref={provided.innerRef}
											style={getListStyle(snapshot.isDraggingOver)}
										>
											{this.state.rows.map((row, index) => (
												<Draggable key={index} draggableId={index+""} index={index}>
													{(provided, snapshot) => (

														<TableRow
															key={index}
															data-row-id={index}
															ref={provided.innerRef}
															{...provided.draggableProps}
															style={getItemStyle(
																snapshot.isDragging,
																provided.draggableProps.style
															)}
														>
															<TableCell width={200}
																align="left"
																contentEditable="true"
																onBlur={this.handleCellChange("name")}
																className="table-cell"
															>
																{row.name}
															</TableCell>

															<TableCell width={200}
																align="left"
																contentEditable="true"
																onBlur={this.handleCellChange("type")}
																className="table-cell"
															>
																{row.type}
															</TableCell>

															<TableCell width={200}
																onClick={ () => this.handleClick(index) }
																align="left"
																style={{backgroundColor: row.color, padding: 0}}
																className="table-cell"
															>
															</TableCell>

															<TableCell  width={200}>
																<ButtonGroup color="primary">
																	<IconButton size="medium" color="primary" aria-label="delete" {...provided.dragHandleProps}>
																		<DragHandleIcon />
																	</IconButton>

																	<IconButton size="medium" color="primary" aria-label="delete" onClick={() => this.addRow(index)}>
																		<AddIcon />
																	</IconButton>

																	<IconButton size="medium" color="secondary" aria-label="delete" onClick={() => this.deleteRow(index)}>
																		<DeleteIcon />
																	</IconButton>
																</ButtonGroup>
															</TableCell>
															{ row.displayColorPicker ?
																<div style={ popover }>
																	<div style={ cover } onClick={ () => this.handleClose(index) }/>
																	<ChromePicker
																		color={row.color}
																		onChange={ this.handleColorChange }
																		onChangeComplete={ this.handleColorChange }
																	/>
																</div>
																: null
															}
														</TableRow>
													)}
												</Draggable>
											))}
											{provided.placeholder}
										</TableBody>
									}
								</Table>
							</TableContainer>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		);
	}
}

export default EditableTable;