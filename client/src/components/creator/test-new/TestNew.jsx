import React, { Component } from 'react';
import { Table } from "react-bootstrap";
import './TestNew.scss';

export default class TestNew extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedDrinks: [],
			name: "",
			description: "",
			isPractice: false,
			isPublic: false,
			errorLog: [],
			mode: "new"
		}
		this.addDrink = this.addDrink.bind(this);
		this.removeDrink = this.removeDrink.bind(this);
		this.submitTest = this.submitTest.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.submitTest = this.submitTest.bind(this);
		this.onSubmitFinishCallback = this.onSubmitFinishCallback.bind(this);
		this.addError = this.addError.bind(this);
		this.deleteError = this.deleteError.bind(this);
	}
	static getDerivedStateFromProps(props, state) {
		if (props.match.params.testId != null && state.id == null) {
			var targetTest = null;
			for (var i = 0; i < props.tests.length; i++) {
				if (props.tests[i] != null && props.tests[i].id === props.match.params.testId) {
					targetTest = props.tests[i];
					break;
				}
			}
			if (targetTest !== null) {
				var newState = {};
				newState.id = targetTest.id;
				newState.mode = "edit";
				newState.name = targetTest.name;
				newState.description = targetTest.description;
				newState.isPractice = targetTest.isPractice;
				newState.isPublic = targetTest.isPublic;				
				newState.selectedDrinks = targetTest.drinks;
				return newState;
			}
		}
		return null;
	}
	addDrink(drink) {
		let selectedDrinkList = this.state.selectedDrinks;
		selectedDrinkList.push(drink);
		this.setState({ selectedDrinks: selectedDrinkList })
	}

	removeDrink(index) {
		let selectedDrinkList = this.state.selectedDrinks;
		selectedDrinkList.splice(index, 1);
		this.setState({ selectedDrinks: selectedDrinkList })
	}
	handleChange(thingChanged, event) {
		// console.log({ [thingChanged]: event.target.type == "checkbox" ? event.target.checked : event.target.value })
		this.setState({ [thingChanged]: event.target.type === "checkbox" ? event.target.checked : event.target.value });
	}
	submitTest() {
		var errored = false;
		if (this.state.selectedDrinks.length <= 0) {
			this.addError("noDrinks", "You havent added any drinks to the test");
			errored = true;
		}
		if (this.state.name == null || this.state.name === "") {
			this.addError("noName", "Please give the test a name");
			errored = true;
		}
		if (this.state.description == null || this.state.description === "") {
			this.addError("noDest", "Please give the test a description");
			errored = true;
		}
		if (errored === false) {

			var outputDrinkIds = [];
			for (var i = 0; i < this.state.selectedDrinks.length; i++) {
				outputDrinkIds.push(this.state.selectedDrinks[i].id);
			}
			if (this.state.mode === "new") {
				this.props.submitNewTest(outputDrinkIds, this.state.name, this.state.description, this.state.isPractice, this.state.isPublic, this.onSubmitFinishCallback);
			} else if (this.state.mode === "edit") {
				this.props.submitEditedTest(this.state.id, outputDrinkIds, this.state.name, this.state.description, this.state.isPractice, this.state.isPublic, this.onSubmitFinishCallback);
			}
		}
	}

	onSubmitFinishCallback(response) {
		if (response.status !== 200) {
			console.log(response.status);
			this.addError("communicationError", "Test could not be saved at this time please try again later. (" + response.status + " Error)")
		} else {
			this.props.history.push('./test/overview')
		}
	}

	addError(tag, text) {
		var tempErrorLog = this.state.errorLog;
		for (var i = 0; i < tempErrorLog.length; i++) {
			if (tempErrorLog[i][0] === tag) {
				return;
			}
		}
		tempErrorLog.push([tag, text]);
		this.setState({ errorLog: tempErrorLog })
	}

	deleteError(tag) {
		var tempErrorLog = this.state.errorLog;
		for (var i = 0; i < tempErrorLog.length; i++) {
			if (tempErrorLog[i][0] === tag) {
				tempErrorLog.splice(i, 1);
				break;
			}
		}
		this.setState({ errorLog: tempErrorLog })
	}
	render() {
		return (
			<React.Fragment>
				<div id={"errorLog"}>

					{this.state.errorLog.map((item) => {
						return (
							<div className={"errorItem"}>
								<div className={"errorText"}>{item[1]}</div>
								<div className={"errorDelete"} onClick={this.deleteError.bind(this, item[0])}><button>X</button></div>
							</div>
						)
					})}
				</div>
				<div id={"test-new"}>
					<div id={"left"}>

						<div className={"title"}>Drinks</div>

						<Table striped hover>
							<thead>
								<tr>
									<th>Drink Name</th>
									<th>Drink Description</th>
									{/* <th>Add</th> */}
								</tr>
							</thead>
							<tbody>
								{this.props.drinks.map((item) => {
									return (<tr>
										<td>{item.name}</td>
										<td>{item.description}</td>
										<td><button onClick={this.addDrink.bind(this, item)}>Add</button></td>
									</tr>)
								})}
							</tbody>
						</Table>
					</div>
					<div id={"right"}>
						<div className={"title"}>Drinks In Test</div>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>Drink Name</th>
									<th>Drink Description</th>
									<th>Remove</th>
								</tr>
							</thead>
							<tbody>
								{this.state.selectedDrinks.map((item, index) => {
									return (<tr>
										<td>{item.name}</td>
										<td>{item.description}</td>
										<td><button onClick={this.removeDrink.bind(this, index)}>Remove</button></td>
									</tr>)
								})}
								<tr><td>Name: <input type="text" value={this.state.name} onChange={this.handleChange.bind(this, "name")}></input></td></tr>
								<tr><td>Description: <input type="text" value={this.state.description} onChange={this.handleChange.bind(this, "description")}></input></td></tr>
								<tr><td>Public: <input type="checkbox" checked={this.state.isPublic} onChange={this.handleChange.bind(this, "isPublic")}></input></td></tr>
								<tr><td>Practice: <input type="checkbox" checked={this.state.isPractice} onChange={this.handleChange.bind(this, "isPractice")}></input></td></tr>
							</tbody>
						</Table>
						<button onClick={this.submitTest.bind(this)}>Submit</button>
					</div>
				</div>
			</React.Fragment>
		);
	}
}