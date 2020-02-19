import React, { Component } from 'react';
import NavigationBar from "./../navbar/NavigationBar";
import { Table } from "react-bootstrap";
import './TestOverview.scss';

export default class TestOverview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTest: null
		}
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

		this.selectTest = this.selectTest.bind(this);
	}

	selectTest(test) {
		this.setState({ selectedTest: test })
	}
	render() {
		return (
			<React.Fragment>
				<NavigationBar />
				<div id={"parent"}>
					<div id={"left"}>
						<div id={"title-left"}>
							<div className={"title"}>Your Tests</div>
							<button>New Test</button>
						</div>
						<Table striped hover>
							<thead>
								<tr>
									<th>Test Name</th>
									<th>Test Description</th>
									<th>Date Published</th>
									<th>Date Last Taken</th>
									<th></th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{this.testData.tests.map((item) => {

									return (<tr>
										<td>{item.name}</td>
										<td>{item.desc}</td>
										<td>{item.dateCreated}</td>
										<td>{item.dateLastTaken}</td>
										<td><button>Delete</button></td>
										<td>{item.editable ? <a href={"#"}><button>Edit</button> </a> : "Cant Edit"}</td>
										<td><button onClick={this.selectTest.bind(this, item)}>Details</button></td>
									</tr>)
								})}
							</tbody>
						</Table>
						{/* <div>People Given Access</div>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>Test Name</th>
									<th>Test Description</th>
									<th>Date Published</th>
									<th>Date Last Taken</th>
									<th></th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{this.testData.tests.map((item) => {

									return (<tr>
										<td>{item.name}</td>
										<td>{item.desc}</td>
										<td>{item.dateCreated}</td>
										<td>{item.dateLastTaken}</td>
										<td>Delete</td>
										<td>{item.editable ? "Edit" : "Cant Edit"}</td>
										<td onClick={this.selectTest.bind(this, item)}>></td>
									</tr>)
								})}
							</tbody>
						</Table> */}
					</div>

					<div id={"right"}>
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
										<td >Details</td>
									</tr>)
								}) : "Select a test to view"}
								{this.state.selectedTest != null ? <tr><td>Add new person</td><td>Email: </td></tr> : ""}
							</tbody>
						</Table>
					</div>
				</div>
			</React.Fragment>
		);
	}
}