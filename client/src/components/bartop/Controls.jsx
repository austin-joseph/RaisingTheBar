import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './Controls.scss';

export default class Controls extends Component {
	constructor(props) {
		super(props);
		this.state = {
			amount: 1,
			action_stack: this.props.action_stack,
			redo_action_stack: []
		};
		this.undo = this.undo.bind(this);
		this.redo = this.redo.bind(this);
		this.cancel = this.cancel.bind(this);
		this.shake = this.shake.bind(this);
		this.addToGlass = this.addToGlass.bind(this);
		this.changeAmount = this.changeAmount.bind(this);
		this.increaseAmount = this.changeAmount.bind(this, 1);
		this.decreaseAmount = this.changeAmount.bind(this, -1);
		this.increaseAmountHalf = this.changeAmount.bind(this, 1 / 2);
		this.decreaseAmountHalf = this.changeAmount.bind(this, -1 / 2);
		this.increaseAmountQuarter = this.changeAmount.bind(this, 1 / 4);
		this.decreaseAmountQuarter = this.changeAmount.bind(this, -1 / 4);
	}
	undo() {
		if (this.state.action_stack.length > 0) {
			let removed = this.state.action_stack.pop()
			this.state.redo_action_stack.push(removed)
			this.setState({ action_stack: this.state.action_stack })
		}
	}
	redo() {
		if (this.state.redo_action_stack.length > 0) {
			let removed = this.state.redo_action_stack.pop()
			this.state.action_stack.push(removed)
			this.setState({ action_stack: this.state.action_stack })
		}
	}
	cancel() {
		if (this.state.action_stack.length > 0) {
			this.state.action_stack.push(["shake", 1])
			this.setState({ action_stack: this.state.action_stack })
		}
	}
	shake() {
		if (this.state.action_stack.length > 0) {
			this.state.action_stack.push(["shake", 1])
			this.setState({ action_stack: this.state.action_stack })
		}
	}
	addToGlass() {
		if (this.props.selected != null) {
			this.state.action_stack.push([this.props.selected, this.state.amount])
			this.setState({ action_stack: this.state.action_stack, redo_action_stack: [] });
		}
	}
	changeAmount(delta, event) {
		this.setState({ amount: this.state.amount + delta });
	}
	render() {
		// console.log(this.props)
		let selected = this.props.selected;
		let action_stack = this.state.action_stack;
		console.log(this.state.action_stack);
		return (
			<div className="flex-container">
			
				<div id="option-display">
					<Button onClick={this.undo} bsstyle="primary">Undo</Button>
					<Button onClick={this.redo} bsstyle="primary">Redo</Button>
				</div>
				<div id="selected-display">
					<div>Your current selection is: {selected != null ? selected["name"] : "None"}</div>
					<span>{this.state.amount} Oz</span>
				</div>
			</div>
		);
	}
}
