import React, { Component } from 'react';
import { Table } from "react-bootstrap";
import './TestOverview.scss';

export default class TestOverview extends Component {
	constructor(props) {
		super(props);
		this.onDeleteTestClick = this.onDeleteTestClick.bind(this);
	}
	onDeleteTestClick(index) {
		this.props.deleteTest(this.props.tests[index].id)
	}
	render() {
		return (
			<React.Fragment>
				<div id={"test-overview"}>
					<div className={"title"}>
						Test You Administer
					</div>
					<Table striped hover>
						<thead>
							<tr>
								<th>Test Name</th>
								<th>Date Last Modified</th>
							</tr>
						</thead>
						<tbody>
							{this.props.tests != null ? this.props.tests.map((item, index) => {
								return (<tr>
									<td>{item.name}</td>
									<td>{item.dateLastModified}</td>
									<td><button onClick={this.onDeleteTestClick.bind(this, index)}>Delete</button></td>
									<td>{<a href={"./test/details/" + item.id}><button>Details</button> </a>}</td>
									<td><a href={"./test/results/" + item.id}><button>Results</button></a></td>
									<td><a href={"../bartop/test/" + item.id}><button>Go To Test</button></a></td>
								</tr>)
							}):""}
						</tbody>
					</Table>
				</div>
			</React.Fragment>
		);
	}
}