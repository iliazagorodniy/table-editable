import React, {Component} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

import IconButton from "@material-ui/core/IconButton";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

// fake data generator
const getItems = count =>
	Array.from({ length: count }, (v, k) => k).map(k => ({
		id: `item-${k}`,
		content: `item ${k}`
	}));

// a little function to help us with reordering the result
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
	...draggableStyle
});

class BeautifuldndSample extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: getItems(10)
		};
		this.onDragEnd = this.onDragEnd.bind(this);
	}

	onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		const items = reorder(
			this.state.items,
			result.source.index,
			result.destination.index
		);

		this.setState({
			items
		});
	}

	render() {
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<Droppable droppableId="droppable">
					{(provided, snapshot) => (
						<TableContainer className="table-container" component={Paper} style={{maxHeight: 600}}>
							<Table stickyHeader size="medium" aria-label="a dense table">
								<TableHead>
									<TableRow>
										<TableCell align="left" width={200}><b>Name</b></TableCell>
										<TableCell align="left" width={200}><b>Type</b></TableCell>
										<TableCell align="left"><b>Color</b>&nbsp;(HEX, RGB, 3rd)</TableCell>
									</TableRow>
								</TableHead>
								<TableBody
									{...provided.droppableProps}
									ref={provided.innerRef}
									style={getListStyle(snapshot.isDraggingOver)}
								>
									{this.state.items.map((item, index) => (
										<Draggable key={item.id} draggableId={item.id} index={index}>
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
													<TableCell
														align="left"
														contentEditable="true"
														className="table-cell"
													>
														Name
													</TableCell>
													<TableCell
														align="left"
														contentEditable="true"
														className="table-cell"
													>
														Name
													</TableCell>
													<TableCell
														align="left"
														contentEditable="true"
														className="table-cell"
													>
														Name
													</TableCell>
													<TableCell>
														<IconButton size="medium" color="secondary" aria-label="delete" {...provided.dragHandleProps}>
															<DragHandleIcon />
														</IconButton>
													</TableCell>
												</TableRow>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Droppable>
			</DragDropContext>
		);
	}
}

export default BeautifuldndSample;