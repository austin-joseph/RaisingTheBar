import React, { Component } from 'react';
import { Table } from "react-bootstrap";
import './TestNew.scss';

export default class TestNew extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedDrinks: [],
			name: "",
			desc: "",
			isPractice: false,
			isPublic: false,
			errorLog: []
		}

		this.addDrink = this.addDrink.bind(this);
		this.removeDrink = this.removeDrink.bind(this);
		this.submitTest = this.submitTest.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.submitTest = this.submitTest.bind(this);
		this.onSubmitFinishCallback = this.onSubmitFinishCallback.bind(this);
		this.addError = this.addError.bind(this);
		this.deleteError = this.deleteError.bind(this);

		if (props.drinks.length == 0) {
			this.addError("noDrinks", "You dont have any drinks, make some before you create a test")			
			
		}
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
		this.setState({ [thingChanged]: event.target.type == "checkbox" ? event.target.checked : event.target.value });
	}
	submitTest() {
		var errored = false;

		if (this.state.selectedDrinks.length <= 0) {
			this.addError("noDrinks", "You havent added any drinks to the test");
			errored = true;
		}
		if (this.state.name == null || this.state.name == "") {
			this.addError("noName", "Please give the test a name");
			errored = true;
		}
		if (this.state.desc == null || this.state.desc == "") {
			this.addError("noDest", "Please give the test a description");
			errored = true;
		}
		if (errored == false) {
			this.props.submitNewTest(this.state.selectedDrinks, this.state.name, this.state.desc, this.state.isPractice, this.state.isPublic, this.onSubmitFinishCallback);
		}
	}

	onSubmitFinishCallback(responseCode) {
		console.log(responseCode);
		this.addError("communicationError", "Test could not be saved at this time please try again later. (" + responseCode + " Error)")
	}

	addError(tag, text) {
		var tempErrorLog = this.state.errorLog;
		for (var i = 0; i < tempErrorLog.length; i++) {
			if (tempErrorLog[i][0] == tag) {
				return;
			}
		}
		tempErrorLog.push([tag, text]);
		this.setState({ errorLog: tempErrorLog })
	}

	deleteError(tag) {
		var tempErrorLog = this.state.errorLog;
		for (var i = 0; i < tempErrorLog.length; i++) {
			if (tempErrorLog[i][0] == tag) {
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
				<div id={"parent"}>



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
										<td>{item.desc}</td>
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
										<td>{item.desc}</td>
										<td><button onClick={this.removeDrink.bind(this, index)}>Remove</button></td>
									</tr>)
								})}
								<tr>Name: <input type="text" value={this.state.name} onChange={this.handleChange.bind(this, "name")}></input></tr>
								<tr>Description: <input type="text" value={this.state.desc} onChange={this.handleChange.bind(this, "desc")}></input></tr>
								<tr>Public: <input type="checkbox" checked={this.state.isPublic} onChange={this.handleChange.bind(this, "isPublic")}></input></tr>
								<tr>Practice: <input type="checkbox" checked={this.state.isPractice} onChange={this.handleChange.bind(this, "isPractice")}></input></tr>
							</tbody>
						</Table>
						<button onClick={this.submitTest.bind(this)}>Submit</button>
					</div>
				</div>
			</React.Fragment>
		);
	}
}