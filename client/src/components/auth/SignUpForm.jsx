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
      message: 0
      /*
           Show no message  0
          SucessMessage: 1,
          IncorrectUserPassMessage: 2,
          ServerErrorMessage: 3,
          ServerNotFound: 4
          showUnknownErrorMessage: 4
      */
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
      setTimeout(function () { this.props.redirectCallback("../") }.bind(this), 1500)
      this.setState({ message: 1 });
      //login was sucessful
    } else if (e.target.status === 400) {
      this.setState({ message: 2 });
      //Unable to make this account because username or password was in use
    } else if (e.target.status === 500) {
      this.setState({ message: 3 })
      //Internal server error
    } else if (e.target.status === 404) {
      this.setState({ message: 4 })
      //Cant connect to server
    } else {
      this.setState({ message: 5 })
      //Unknown error
      console.log(e.target.status)
    }
  }

  render() {
    return (
      <div className="FormCenter">
        <div className="FormTitle">
          <NavLink to="./login" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Login</NavLink> or <NavLink exact to="./signup" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign Up</NavLink>
        </div>
        <form onSubmit={this.handleSubmit} className="FormFields">
          <div className="messageLog">
            <div className={this.state.message === 1 ? "show green" : "hidden"}>
              Signup sucessful redirecting...
            </div>
            <div className={this.state.message === 2 ? "show red" : "hidden"}>
              Email already has an account associated.
            </div>
            <div className={this.state.message === 3 ? "show orange" : "hidden"}>
              Internal server error
            </div>  
            <div className={this.state.message === 4 ? "show red" : "hidden"}>
              Unable to connect to server, check your internet connection and try again
            </div>
            <div className={this.state.message === 5 ? "show orange" : "hidden"}>
              Unknown error
            </div>
          </div>
          <div className="FormField">
            <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
            <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange} />
          </div>
          <div className="FormField">
            <label className="FormField__Label" htmlFor="password">Password</label>
            <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} />
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
