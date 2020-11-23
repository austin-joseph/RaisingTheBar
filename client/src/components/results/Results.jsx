import React, { Component } from 'react'
import NavigationBar from "./../navbar/NavigationBar";

export default class Results extends Component {

	render() {
		if (this.props.match.params.var1 === "recipe" && this.props.match.params.var2 === "submit") {

			setTimeout(function () { this.props.history.push("./creator") }.bind(this), 2000);
			return (
				<div>
					<NavigationBar />
					You have sucessfully submitted this recipe, redirecting you to the creator suite
						  </div>
			)
		} else {

			return (
				<div>
					<NavigationBar />
					This is a page to see the results for whatever has occured on the website.
				      </div>
			)
		}
	}
}
