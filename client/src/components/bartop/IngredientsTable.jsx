import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import './IngredientsTable.scss';

export default class IngredientsTabs extends Component {
	constructor(props) {
		super(props);
		this.isDraggable = this.isDraggable.bind(this);
		this.canSelectIngredient = this.canSelectIngredient.bind(this);
	}
	onIngredientClick(item, event) {
		if (this.canSelectIngredient()) {
			if (item !== this.props.selected) {
				var callback = this.props.onSelectedIngredientChangeCallback;
				callback(item)
			}
		}
	}
	isDraggable() {
		return this.props.onDragStartCallback != null;
	}
	canSelectIngredient() {
		return this.props.onSelectedIngredientChangeCallback != null;
	}
	handleDragStart(item, e) {
		if (this.props.onDragStartCallback != null) {
			this.props.onDragStartCallback(item);
		}
	}
	render() {
		var gloablThis = this;
		let categoryList = [];
		let ingredientsList = new Map();
		if (this.props.ingredients != null) {
			for (var x of this.props.ingredients) {
				if (ingredientsList.get(x["category"]) == null) {
					ingredientsList.set(x["category"], []);
				}
				ingredientsList.get(x["category"]).push(x);
			}
			ingredientsList.forEach((value, key, map) => { categoryList.push(key) })
		}
		return (
			<div className={this.props.container === "liquor" ? "liquors-container" : "ingredients-container"}>
				<Tabs defaultActiveKey={categoryList[0]}>
					{
						categoryList.map((item) => (
							<Tab key={item} eventKey={item} title={item}>
								<div className={this.props.scrolling === "vert" ? "vert-table " : "hori-table"}>
									{
										(() => {
											var output = [];
											var elements = ingredientsList.get(item)
											for (var x of elements) {
												let boundFunctionCall = this.onIngredientClick.bind(this, x);
												output.push(
													<div draggable={this.isDraggable()} onDragStart={this.handleDragStart.bind(gloablThis, x)} className={this.props.selected === x ? "list_element selected" : "list_element"} key={x["name"]} onClick={boundFunctionCall}>
														<img draggable="false" src={"./images/" + ((x["category"] == "glasses") ? "glasses/" : "ingredients/") + x["name"].toLowerCase() + ".png"} alt={"Missing Image: " + x["name"]} />
														<p>{x["name"]}</p>
													</div>
												);
											}
											return output;
										}).call()
									}
								</div>
							</Tab>
						))}
				</Tabs>
			</div>
		);
	}
}
