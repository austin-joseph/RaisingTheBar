import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import './RecipeRightPanel.scss';

export default class RecipeRightPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			description: "",
			public: true
		};
		if (props.mode.mode != "recipe") {
			console.log("RecipeRightPanel is being created on a non recipe page")
		}
		if (props.mode.mode == "edit" || props.mode.submode == "get") {
			this.state.name = props.mode.data.name;
			this.state.description = props.mode.data.description;
		}
		this.submit = this.submit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.hadValidGlass = this.hadValidGlass.bind(this);
	}
	submit() {
		this.props.onSubmitCallback({ name: this.state.name, description: this.state.description, public: this.state.public });
	}

	handleChange(e) {
		if (e.target.type === "checkbox") {
			this.setState({ [e.target.name]: e.target.checked });
			console.log("1111");
		} else {
			if ((e.target.name == "name" && e.target.value.length <= 50)
				||
				(e.target.name == "description" && e.target.value.length <= 500)) {
				this.setState({ [e.target.name]: e.target.value });
			}
		}
	}
	hadValidGlass() {
		return this.props.selectedSlot != null && this.props.selectedSlot.bar == "quick" && this.props.selectedSlot.data != null && this.props.selectedSlot.data.glass != null && this.props.selectedSlot.data.actionStack.length > 0;
	}
	render() {
		return (
			<Tabs defaultActiveKey={"Submit"}>
				<Tab key={"Submit"} eventKey={"Submit"} title={"Submit"}>
					<div className="FormField">
						<div id="textfield">
							<div id="submit-title" className="MuiButton-root MuiButton-text">
								Name of Recipe
								</div>
							<TextField
								id="name"
								type="text"
								className="FormField__Input"
								label="Enter The Name For This Recipe"
								multiline
								variant="outlined"
								fullWidth="100%"
								name="name"
								rows="1"
								size="small"
								value={this.state.name}
								onChange={this.handleChange}
							/>
						</div>
						<div id="textfield">
							<div id="submit-title" className="MuiButton-root MuiButton-text">
								Description of Recipe
								</div>
							<TextField
								id="description"
								type="text"
								className="FormField__Input"
								label="Enter The Recipe Description"
								multiline
								variant="outlined"
								fullWidth="100%"
								name="description"
								rows="4"
								size="small"
								value={this.state.description}
								onChange={this.handleChange}
							/>
						</div>

						<div id="submit-title" className="MuiButton-root MuiButton-tex block1t">Cup Contents</div>
						<div className="log-box">
							{this.hadValidGlass() ? this.props.selectedSlot.data.actionStack.map((item, index) => {

								if (item.scale === "ounces") {
									return <p id="log-text" key={item + index}>{item.name + " " + (item.amount / 100) + " oz"}</p>
								} else if (item.scale === "count") {
									return <p id="log-text" key={item + index}> {item.name + " " + item.amount + " ct"}</p>
								} else {
									return item[1].map((ingredient, index) => {


										return <p id="log-text">{ingredient.name + " " + (ingredient.amount / 100) + " oz (shaken)"}</p>

									});
								}

							}) : <p>Empty</p>}
						</div>

						<div className="text-center container-fluid d-flex justify-content-between" id="checkbox">
							<FormControlLabel
								className="MuiButtonBase-root MuiButton-root MuiButton-text"
								control={<Checkbox type="checkbox" id="public" name="public" checked={this.state.public} onChange={this.handleChange} value="gilad" />}
								label="Public Recipe?"
							/>
							<Button onClick={this.submit} size="medium" variant="contained" color="primary" disableElevation>Submit Recipe</Button>
						</div>

						<div className="block"></div>
						<div id="submit-title" className="MuiButton-root MuiButton-text">Helpful Tips</div>
						<div className="log-box">
							{this.props.messageLog.map((item, index) => {
								return <p id="log-text" key={this.props.messageLog[this.props.messageLog.length - index] + index}>{this.props.messageLog[this.props.messageLog.length - index]}</p>
							})}
						</div>
					</div>
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
						When youre ready to submit your glass, make sure it's selected add a title, descritpion and scope then press submit.
						<hr></hr>
					</div>
				</Tab>
			</Tabs>
		);
	}
}
