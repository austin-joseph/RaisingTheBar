import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class SignUpForm extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      name: '',
      hasAgreed: false,
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
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    formData.append("email", this.state.email);
    formData.append("password", this.state.password);
    xhr.addEventListener("load", this.formResults);
    xhr.open("POST", './user/signup');
    xhr.send(formData);
    console.log("Attempting Signup")
  }

  formResults(e) {
    if (e.target.status === 201 || e.target.status === 202) {
      setTimeout(function(){this.props.redirectCallback("../")}.bind(this), 1500)
      
      this.setState({ attempted: true, sucessful: true })
      console.log("Signup Succeded")
      //login was sucessful
    } else if (e.target.status === 401) {
      this.setState({ attempted: true, sucessful: false })
      //The credentials werent recognized by the server
      console.log("Signup Failed")
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
        <form onSubmit={this.handleSubmit} className="FormFields">
          <div className="FormField">
            <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
            <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange} />
          </div>
          <div className="FormField">
            <label className="FormField__Label" htmlFor="password">Password</label>
            <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} />
          </div>
          <div className={this.state.attempted && !this.state.sucessful ? "show" : "hidden"}>
            This username already exists.
            </div>
          <div className={this.state.attempted && this.state.sucessful ? "show" : "hidden"}>
            Your account has been created redirecting...
            </div>
          {/* <div className="FormField">
                <label className="FormField__CheckboxLabel">
                    <input className="FormField__Checkbox" type="checkbox" name="hasAgreed" value={this.state.hasAgreed} onChange={this.handleChange} /> I agree all statements in <a href="" className="FormField__TermsLink">terms of service</a>
                </label>
              </div> */}

          <div className="FormField">
            <button className="FormField__Button mr-20">Sign Up</button>
          </div>
        </form>
      </div>
    );
  }
}
