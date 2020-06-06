import React, { Component } from 'react';
import { Table } from "react-bootstrap";
import './TestDetails.scss';

export default class TestDetails extends Component {
	constructor(props) {
		super(props);
		this.goToEditTest = this.goToEditTest.bind(this);
	}
	goToEditTest() {
		this.props.history.push('/creator/test/edit/' + this.props.match.params.testId)
	}
	render() {

		var targetTest = null;
		for (var i = 0; i < this.props.tests.length; i++) {
			if (this.props.tests[i].id === this.props.match.params.testId) {
				targetTest = this.props.tests[i];
				console.log(this.props.tests[i])
				break;
			}
		}

		if (targetTest == null) { console.log("No Target Test"); return ""; }
		return (
			<React.Fragment>
				<div id={"test-details"}>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Name</th>
								<th>Description</th>
								<th>Date Created</th>
								<th>Date Last Modified</th>
								<th>Public Test?</th>
								<th>Practice Test?</th>
								{targetTest.editable ? <th><button onClick={this.goToEditTest}>Edit</button></th> : <th>Cant Edit</th>}
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{targetTest.name}</td>
								<td>{targetTest.description}</td>
								<td>{targetTest.dateCreated}</td>
								<td>{targetTest.dateLastModified}</td>
								<td>{targetTest.isPublic.toString()}</td>
								<td>{targetTest.isPractice.toString()}</td>
								{/* <td><a href={"/creator/test-results/" + this.targetTest.id + "/" + item.id}><button>Details</button></a></td> */}
							</tr>
						</tbody>
					</Table>
				</div>
			</React.Fragment>
		);
	}
}