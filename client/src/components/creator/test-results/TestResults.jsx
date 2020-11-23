import React, { Component } from 'react';
import { Button, Table } from "react-bootstrap";
import './TestResults.scss';

export default class TestResults extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedResults: null,
			selectedDrinks: null,
			data: {
				realname: "John Doe",
				testname: "Test 1",
				attempts: [
					{
						date: "2020-02-14",
						totalScore: "1/10",
						//array of each drink the person was supposed to make and their score for that part
						scoreBreakdown: [
							{
								recipeName: "Whisky Sour",
								originalRecipe: {},
								submittedRecipe: {},
								problems: [],
								score: "1/10"
							}
						]
					}, {
						date: "2020-02-14",
						totalScore: "1/10",
						//array of each drink the person was supposed to make and their score for that part
						scoreBreakdown: [
							{
								recipeName: "Whisky Sour",
								originalRecipe: {},
								submittedRecipe: {},
								problems: [],
								score: "1/10"
							}
						]
					}, {
						date: "2020-02-14",
						totalScore: "1/10",
						//array of each drink the person was supposed to make and their score for that part
						scoreBreakdown: [
							{
								recipeName: "Whisky Sour",
								originalRecipe: {},
								submittedRecipe: {},
								problems: [],
								score: "1/10"
							}
						]
					}, {
						date: "2020-02-14",
						totalScore: "1/10",
						//array of each drink the person was supposed to make and their score for that part
						scoreBreakdown: [
							{
								recipeName: "Whisky Sour",
								originalRecipe: {},
								submittedRecipe: {},
								problems: [],
								score: "1/10"
							}
						]
					}, {
						date: "2020-02-14",
						totalScore: "1/10",
						//array of each drink the person was supposed to make and their score for that part
						scoreBreakdown: [
							{
								recipeName: "Whisky Sour",
								originalRecipe: {},
								submittedRecipe: {},
								problems: [],
								score: "1/10"
							}
						]
					}, {
						date: "2020-02-14",
						totalScore: "1/10",
						//array of each drink the person was supposed to make and their score for that part
						scoreBreakdown: [
							{
								recipeName: "Whisky Sour",
								originalRecipe: {},
								submittedRecipe: {},
								problems: [],
								score: "1/10"
							}
						]
					}, {
						date: "2020-02-14",
						totalScore: "1/10",
						//array of each drink the person was supposed to make and their score for that part
						scoreBreakdown: [
							{
								recipeName: "Whisky Sour",
								originalRecipe: {},
								submittedRecipe: {},
								problems: [],
								score: "1/10"
							}
						]
					}, {
						date: "2020-02-14",
						totalScore: "1/10",
						//array of each drink the person was supposed to make and their score for that part
						scoreBreakdown: [
							{
								recipeName: "Whisky Sour",
								originalRecipe: {},
								submittedRecipe: {},
								problems: [],
								score: "1/10"
							}
						]
					}, {
						date: "2020-02-14",
						totalScore: "1/10",
						//array of each drink the person was supposed to make and their score for that part
						scoreBreakdown: [
							{
								recipeName: "Whisky Sour",
								originalRecipe: {},
								submittedRecipe: {},
								problems: [],
								score: "1/10"
							}
						]
					}, {
						date: "2020-02-14",
						totalScore: "1/10",
						//array of each drink the person was supposed to make and their score for that part
						scoreBreakdown: [
							{
								recipeName: "Whisky Sour",
								originalRecipe: {},
								submittedRecipe: {},
								problems: [],
								score: "1/10"
							}
						]
					}
				]
			}
		}
		this.selectTest = this.selectTest.bind(this);
	}

	selectTest(test) {
		this.setState({ selectedResults: test })
	}
	render() {
		return (
			<React.Fragment>
				<div id={"top"}>
					<div className={"alightLeft"}>
						<Button>Back</Button>
					</div>
					<div id={"title"}>
						{this.state.data.realname}'s Results For {this.state.data.testname}
					</div>
				</div>
				<div id={"parent"}>

					<div id={"left-panel"}>
						<Table striped hover>
							<thead>
								<tr>
									<th>Date Taken</th>
									<th>Best Score</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{this.state.data.attempts.map((item) => {
									return (<tr>
										<td>{item.date}</td>
										<td>{item.totalScore}</td>
										<td><button onClick={this.selectTest.bind(this, item)}>Details</button></td>
									</tr>)
								})}
							</tbody>
						</Table>
					</div>
					<div id={"right-panel"}>
						{this.state.selectedResults != null ? this.state.selectedResults.scoreBreakdown.map((item) => {
							return (
								<div>
									{/* <div>Drink: {item.recipeName}</div>
									<div>Score: {item.recipeName}</div>
									<div>Problems: {item.problems}</div> */}
									<thead>
										<tr>
											<td>Drink: {item.recipeName}</td>
											<td>Score: {item.recipeName}</td>
											<td>Problems: {item.problems}</td>
										</tr>
									</thead>
									{/* <Table striped hover>
										<thead>
											<tr>
												<th>Score</th>
												<th>Problems</th>
												<th>Expected Ingredients</th>
												<th>Expected Ingredients</th>
											</tr>
										</thead>
										<tbody>
											{this.selectedResults != null ? this.testData.tests.map((item) => {

												return (<tr>
													<td>{item.name}</td>
													<td>{item.desc}</td>
													<td>{item.dateCreated}</td>
													<td>{item.dateLastTaken}</td>
													<td><button>Delete</button></td>
													<td>{item.editable ? "Edit" : "Cant Edit"}</td>
													<td onClick={this.selectTest.bind(this, item)}>></td>
												</tr>)
											}) : ""}
										</tbody>
									</Table> */}
								</div>

							)
						}) : (
								<Table striped hover>
									<thead>
										<tr>
											<th>Score</th>
											<th>Problems</th>
											<th>Expected Ingredients</th>
										</tr>
									</thead>
								</Table>
							)}

					</div>
				</div>
			</React.Fragment>
		);
	}
}