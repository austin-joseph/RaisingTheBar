import React, { Component } from 'react'
import NavigationBar from "./../navbar/NavigationBar";
import SimulationCard from "./SimulationCard";
import { Col, Jumbotron } from "react-bootstrap";

export default class Workshop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      simulations: [
        {
          id: "1",
          name: "simmulation test 1",
          description: "first best simulation",
          "date": 1576382942151,
          "creator": "5df0fcd730778234fc4656fd",
          isPublic: true,
          isPractice: true,
          recipes: ["test recipe1", "test recipe2", "test recipe3", "test recipe4"],

        },
        {
          id: "2",
          name: "simulation test 2",
          description: "second best simulation",
          "date": 1576382942151,
          "creator": "5df0fcd730778234fc4656fd",
          isPublic: false,
          isPractice: false,
        },
        {
          id: "3",
          name: "simmulation test 3",
          description: "third best simulation",
          "date": 1576382942151,
          "creator": "5df0fcd730778234fc4656fd",
          isPublic: true,
          isPractice: true,
        }
        
        
        
      ]
    }
    /*
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/simulation/list', true);
    var globalThis = this
    xhr.onload = function () {
      // do something to response
      var responseObject = null;
      try {
        responseObject = JSON.parse(this.responseText)
        globalThis.setState({ simulations: responseObject.simulations });
      } catch (e) {
        console.error("Got Non JSON response from server");
      }
    };
    xhr.send();*/
  }

  render() {
    let simulationCards = this.state.simulations.map(simulation => {
      return (
        <div className="col-md-3">
          <SimulationCard key={simulation.id} simulation={simulation} />
        </div>
      )
    });

    return (
      <React.Fragment>
        <NavigationBar />

        <Jumbotron fluid className="jumbo p-0 m-5">
          <Col className="mt-2 mb-4">
            <div className="row p-1">
              {simulationCards}
            </div>
          </Col>
        </Jumbotron>
        {/*<div className="workshop-body container-fluid d-flex justify-content-center">*/}
        {/*<div className="row">*/}
        {/*{simulationCards}*/}
        {/*</div>*/}
        {/*</div>*/}
      </React.Fragment>

    )
  }
}
