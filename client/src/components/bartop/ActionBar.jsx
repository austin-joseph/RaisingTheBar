import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import "./ActionBar.scss";

export default class ActionBar extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
		this.hilightSlot = this.hilightSlot.bind(this);
	}
	onClick(index) {
		this.props.onSelectedSlotChangeCallback("action", index, this.props.inventory[index]);
	}
	onShakeClick(index) {
		var callback = this.props.onActionEndCallback;
		callback(index);
	}
	onHeatClick(index) {

	}
	onCutClick(index) {

	}
	handleDrop(index, event) {
		var callback = this.props.onDragEndActionBarCallback;
		callback(index);
		event.preventDefault()
	}
	handleDragStart(item, e) {
		var callback = this.props.onDragStartCallback;
		var output = {
			data: item.actionStack,
			type: "action"
		}

		callback(item);
	}
	hilightSlot(index) {
		return this.props.selected_slot != null && this.props.selected_slot.bar === "action" && this.props.selected_slot.slot === index
	}
	render() {

		return (
			<div className="action-bar">
				<div className={"action-item" + (this.hilightSlot(0) ? " highight" : "")} onClick={this.onClick.bind(this, 0)} onDragStart={this.handleDragStart.bind(this, this.props.inventory[0])} onDrop={this.handleDrop.bind(this, 0)} onDragOver={(e) => e.preventDefault()} draggable>
					{
						this.props.renderActionBarItem(0)
					}
				</div>
				<Button onClick={this.onShakeClick.bind(this, 0)}>Shake!</Button>
                                {/*
				<div className={"action-item" + (this.hilightSlot(1) ? " highight" : "")} onClick={this.onClick.bind(this, 1)} onDragStart={this.handleDragStart.bind(this, this.props.inventory[0])} onDrop={this.handleDrop.bind(this, 1)} onDragOver={(e) => e.preventDefault()} draggable>
					{
						this.props.renderActionBarItem(1)
					}
				</div>
				<button onClick={this.onHeatClick.bind(this, 0)}>Heat!</button>
				<div className={"action-item" + (this.hilightSlot(2) ? " highight" : "")} onClick={this.onClick.bind(this, 2)} onDragStart={this.handleDragStart.bind(this, this.props.inventory[0])} onDrop={this.handleDrop.bind(this, 2)} onDragOver={(e) => e.preventDefault()} draggable>
					{
						this.props.renderActionBarItem(2)
					}
				</div>
				<button onClick={this.onCutClick.bind(this, 0)}>Cut!</button>*/}
                                
			</div>
		);
	}
}
