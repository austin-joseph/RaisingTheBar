import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import NavigationBar from "./../navbar/NavigationBar";
import bgimage from "../../assets/background.jpg";
import './Home.scss';

export default class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <NavigationBar />
        <div id="home">
          <Jumbotron style={{ backgroundImage: `url(${bgimage})` }}>
            <h1 className="center">RAISING THE BAR</h1>
            <h4 className="center">AN EFFECTIVE BARTENDER TRAINING TOOL</h4>
          </Jumbotron>

          <div className="center website_function">
            <div className="title">Workshop</div>
            <div className="body">The workshop consists of all the practice and testing simulations that have been created by the user. When a simulation is selected, the user will be redirected to that simulation.
Users are also allowed to search for a simulation by name and view shareable links for a specific simulation.</div>
            <a className="btn btn-info" href="./workshop">Workshop</a>
          </div>

          <div className="center website_function">
            <div className="title">Creation Suite</div>
            <div className="body">The creation suite allows users to create a new simulation. To create a new simulation, users add the recipes they want the simulation to consist of
        from the recipe book. Users are also allowed to edit and view who has completed an existing simulation.</div>
            <a className="btn btn-info" href="./creator">Creation Suite</a>
          </div>
        </div>



      </React.Fragment>


    );
  }
}

