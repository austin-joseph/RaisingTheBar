import React, { Component } from 'react';
import { Table } from "react-bootstrap";
import './TestDetails.scss';

export default class TestDetails extends Component {
	constructor(props) {
		super(props);
		this.testData = {
			tests: [
				{
					name: "Test 1",
					desc: "Test 1 Desc",
					dateCreated: "2020-02-13",
					dateLastTaken: "2020-02-14",
					editable: false,
					accessHavers: [
						{
							name: "John Doe",
							email: "JohnDoe@a.com",
							score: "7/10",
							dateLastTaken: "2020-02-12",
							numAttempts: "1"
						},
						{
							name: "Dorithy Smildinger",
							email: "JohnDoe@a.com",
							score: "10/10",
							dateLastTaken: "2020-02-12",
							numAttempts: "1"
						}
					]
				},
				{
					name: "Test 2",
					desc: "Test 2 Desc",
					dateCreated: "2020-02-05",
					dateLastTaken: "2020-02-04",
					editable: true,
					accessHavers: [
						{
							name: "John Doe",
							email: "JohnDoe@a.com",
							score: "7/10",
							dateLastTaken: "2020-02-12",
							numAttempts: "1"
						},
						{
							name: "Dorithy Smildinger",
							email: "JohnDoe@a.com",
							score: "10/10",
							dateLastTaken: "2020-02-12",
							numAttempts: "1"
						}
					]
				}
			]
		}
		this.state = {
			selectedTest: this.testData.tests[0]
		}

		this.selectTest = this.selectTest.bind(this);
	}

	selectTest(test) {
		this.setState({ selectedTest: test })
	}
	render() {
		return (
			<React.Fragment>
				<div id={"parent"}>					
					<div className={this.state.selectedTest != null ? "" : "displayNone"}>
						<div id={"title-right"}>
							<div className={"title"}>People Given Access</div>
						</div>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									<th>Total Score</th>
									<th>Date Last Taken</th>
									<th>Num Attempts</th>
								</tr>
							</thead>
							<tbody>
								{this.state.selectedTest != null ? this.state.selectedTest.accessHavers.map((item) => {
									return (<tr>
										<td>{item.name}</td>
										<td>{item.email}</td>
										<td>{item.score}</td>
										<td>{item.dateLastTaken}</td>
										<td>{item.numAttempts}</td>
										<td><a href={"/creator/test-results/" + this.state.selectedTest.id + "/" + item.id}><button>Details</button></a></td>
									</tr>)
								}) : "Select a test to view"}
							</tbody>
						</Table>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>Send the test to someone new</th>
								</tr>
							</thead>
							<tbody>
								{this.state.selectedTest != null ? <tr><td>Email: <input type="email"></input><button>Add</button></td></tr> : ""}
							</tbody>
						</Table>
					</div>
				</div>
			</React.Fragment>
		);
	}
}