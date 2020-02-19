import React, { Component } from 'react';
import { Table } from "react-bootstrap";
import './TestOverview.scss';

export default class TestOverview extends Component {
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
	}
	render() {
		return (
			<React.Fragment>
				<div id={"parent"}>
					<div className={"title"}>
						Your tests
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
									<td><a href={"/creator/test-details/" + item.id}><button>Details</button></a></td>
								</tr>)
							})}
						</tbody>
					</Table>
				</div>
			</React.Fragment>
		);
	}
}