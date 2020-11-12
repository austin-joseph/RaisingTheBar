import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Tooltip } from 'react-bootstrap';
import "./QuickBar.scss";

export default class QuickBar extends Component {
	constructor(props) {
		super(props);
		this.getImage = this.getImage.bind(this);
		this.onClick = this.onClick.bind(this);
		this.hilightSlot = this.hilightSlot.bind(this);
      
	}
	onClick(index) {
		var callback = this.props.onSelectedSlotChangeCallback;
		callback("quick", index, this.props.inventory[index]);
	}
	handleDrop(index, event) {
		var callback = this.props.onDragEndQuickBarCallback;
		callback(index);
		event.preventDefault()
	}
     
	handleDragStart(item, e) {
		var callback = this.props.onDragStartCallback;
		callback(item);
	}
	getImage(index) {
		var glass = this.props.inventory[index].glass
		var actionBar = this.props.inventory[index].actionStack;
		return this.props.renderGlass(glass, actionBar);
	}
	hilightSlot(index) {
		return this.props.selected_slot != null && this.props.selected_slot.bar === "quick" && this.props.selected_slot.slot === index
	}
	render() {
		return (
			<div className="quick-bar text-center container-fluid d-flex justify-content-center">
				<div className={"quickbar-item" + (this.hilightSlot(0) ? " highight" : "")} onClick={this.onClick.bind(this, 0)} onDrop={this.handleDrop.bind(this, 0)} onDragStart={this.handleDragStart.bind(this, this.props.inventory[0])} onDragOver={(e) => e.preventDefault()} draggable>
					{
						this.getImage(0)
					}
				</div>
				<div className={"quickbar-item" + (this.hilightSlot(1) ? " highight" : "")} onClick={this.onClick.bind(this, 1)} onDrop={this.handleDrop.bind(this, 1)} onDragStart={this.handleDragStart.bind(this, this.props.inventory[1])}  onDragOver={(e) => e.preventDefault()} draggable>
					{
						this.getImage(1)
					}
				</div>
				<div className={"quickbar-item" + (this.hilightSlot(2) ? " highight" : "")} onClick={this.onClick.bind(this, 2)} onDrop={this.handleDrop.bind(this, 2)} onDragStart={this.handleDragStart.bind(this, this.props.inventory[2])} onDragOver={(e) => e.preventDefault()} draggable>
					{
						this.getImage(2)
					}
				</div>
			</div>
		);
	}
}
