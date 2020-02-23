import React, { Component } from 'react';
import { Table } from "react-bootstrap";
import './TestNew.scss';

export default class TestNew extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedDrinks: []
		}

		this.addDrink = this.addDrink.bind(this);
		this.removeDrink = this.removeDrink.bind(this);
		this.submitTest = this.submitTest.bind(this);
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
	submitTest() {

	}
	render() {
		return (
			<React.Fragment>
				<div id={"parent"}>
					<div id={"left"}>

						<div className={"title"}>Drinks</div>

						<Table striped hover>
							<thead>
								<tr>
									<th>Drink Name</th>
									<th>Drink Description</th>
									<th>Add</th>
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
						<button>Submit</button>
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
							</tbody>
						</Table>
					</div>
				</div>
			</React.Fragment>
		);
	}
}