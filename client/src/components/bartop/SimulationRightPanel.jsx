import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import './SimulationRightPanel.scss';
import Button from '@material-ui/core/Button';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export default class SimulationRightPanel extends Component {
	constructor() {
		super();
		this.state = {
			name: ""

		};
		this.submitRecipe = this.submitRecipe.bind(this);
		this.submitSimulation = this.submitSimulation.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.getText = this.getText.bind(this);

	}
	submitRecipe() {
		this.props.onSubmitRecipeCallback();
	}

	getText() {
		var callback = this.props.getRecIngredients;
		return callback();
	}


	submitSimulation() {
		this.props.onSubmitSimulationCallback();
	}

	handleChange(e) {
		this.setState({ name: e.target.value });
	}
	render() {
		return (

			<Tabs defaultActiveKey={"Tasks"}>
				<Tab key={"Tasks"} eventKey={"Tasks"} title={"Tasks"}>
					<div id="submit-title" className="MuiButton-root MuiButton-text block1 ">Required Recipes</div>
					<div className="log-box-simulation">
						{this.props.recipeQueue.map((recipe, index) => { return this.props.completedRecipes.length == index ? <p><b>{(index + 1) + " "+recipe.name}</b></p> : <p>{(index + 1) + " "+recipe.name}</p> })}
					</div>
					<div id="submit-title" className="MuiButton-root MuiButton-text block1 ">Completed Recipes
						<p id="completed-recipes">
							<span id="center">
								<i className="material-icons">
									arrow_forward_ios
									</i>
							</span>
							{this.props.completedRecipes.length}
						</p>
					</div>

					<div className="text-center container-fluid d-flex justify-content-between" id="checkbox">
						<Button id="button" onClick={this.submitRecipe} size="large" variant="contained" color="default" disableElevation >Submit Recipe</Button>
						<Button id="button" onClick={this.submitSimulation} size="large" variant="contained" color="secondary" disableElevation >Submit Simulation</Button>
					</div>

					<div className="block"></div>
					<div id="submit-title" className="MuiButton-root MuiButton-text">Helpful Tips</div>
					<div className="log-box-simulation">
						{this.props.simulationLog.length == 0 ? <p>Helpful Tips Will Appear Here</p> : this.props.simulationLog.map((item, index) => {
							return <p key={this.props.simulationLog[this.props.simulationLog.length - index] + index}>{this.props.simulationLog[this.props.simulationLog.length - index]}</p>
						})}
					</div>
				</Tab>
				<Tab key={"Tasks"} eventKey={"recipeIng"} title={"Recipe Ingredients"}  >
					<div> {this.getText()} </div>

				</Tab>

				<Tab key={"Tips"} eventKey={"Tips"} title={"Tips"}>
					<div>
						To start, drag a glass from the bottom left of the UI to one of the 3 black circles at the bottom of the page
						<hr></hr>
					</div>
					<div>
						Click on the glass to select it and it'll appear in the middle
						<hr></hr>
					</div>
					<div>
						Next click on an ingredient from the left hand side to select the ingredient<hr></hr>

					</div>
					<div>
						You add the ingredient to the glass by clicking on it's image in the center of the screen. If the ingredient is a liquid you can change how much you add by holding down the mouse button
						<hr></hr>
					</div>
					<div>
						You can shake ingredients together by selecting the shaker from the left, adding ingredients to it as you would a cup, then pressing the shake button
						<hr></hr>
					</div>
					<div>
						You can then drag the shaker to a glass to add its contents to the glass
						<hr></hr>
					</div>
					<div>
						If you'd like to delete the contents of a cup drag the cup from the quick bar(at the bottom) to the x on the bottom left
						<hr></hr>
					</div>
					<div>
						When youre ready to submit your glass, press submit. Once youve submitted all the recipes for this simulation we'll show you your grade.
						<hr></hr>
					</div>
				</Tab>
			</Tabs>

		);
	}
}
