import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../Theme.scss';

export default class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            attempted: false,
            sucessful: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.formResults = this.formResults.bind(this);
    }
    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
        this.setState({
            [name]: value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        formData.append("email", this.state.email);
        formData.append("password", this.state.password);
        xhr.addEventListener("load", this.formResults)
        xhr.open("POST", './user/login/action');
        xhr.send(formData);
    }

    formResults(e) {
        if (e.target.status === 202) {
            setTimeout(function () { this.props.redirectCallback("../") }.bind(this), 1500)
            this.setState({ attempted: true, sucessful: true })
            console.log("Login Succeded")
            //login was sucessful
        } else if (e.target.status === 401) {
            this.setState({ attempted: true, sucessful: false })
            // this.setState({ redirect: true, sucessful:false })
            //The credentials werent recognized by the server
            console.log("Login Failed")
        } else {
            //Sometthing strange went wrong
        }
    }

    render() {
        return (
            <div className="FormCenter">
                <div className="FormTitle">
                    <NavLink to="./login" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Login</NavLink> or <NavLink exact to="./signup" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign Up</NavLink>
                </div>
                <form onSubmit={this.handleSubmit} className="FormFields center">
                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
                        <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange} />
                    </div>

                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="password">Password</label>
                        <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} />
                    </div>
                    <div className={this.state.attempted && !this.state.sucessful ? "show" : "hidden"}>
                        Login failed please try another email or password
                    </div>

                    <div className={this.state.attempted && this.state.sucessful ? "show" : "hidden"}>
                        Login sucessful redirecting...
                    </div>
                    <div className="FormField">
                        <button className="FormField__Button mr-20">Login</button>
                    </div>
                    {/* <div className="FormField">
                        <Link to="./forgot-password" className="FormField__Link">Forgot Password?</Link>
                    </div> */}
                </form>
            </div>
        );
    }
}
