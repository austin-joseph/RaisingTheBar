import React, { Component } from 'react'
import { Tabs, Tab } from 'react-bootstrap';
import NavigationBar from "./../navbar/NavigationBar";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './CreatorContainer.scss';

import TestOverview from './test-overview/TestOverview';
import TestNew from './test-new/TestNew';
import TestResultsDetailed from './test-results-detailed/TestResultsDetailed';

export default class CreatorContainer extends Component {
  constructor() {
    super();
    this.state = {
      selectedTab: "create",
      user: null,
      simulations: [
        // {
        //   id: "5df9747b3077821a54f61336",
        //   creator: "5df93e963077821980b21180",
        //   name: "Test SIm",
        //   description: "Test Sim",
        //   public: true,
        //   practice: true,
        //   recipes: [
        //     "5df955aff68021c70a750e7c",
        //     "5df97264f68021d2fbddbd1b"
        //   ],
        //   date: 1576629371743,
        // },
        // {
        //   id: "5df975283077821a54f61337",
        //   creator: "5df93e963077821980b21180",
        //   name: "Tes sim",
        //   description: "Test sim",
        //   public: true,
        //   practice: true,
        //   recipes: [
        //     "5df955aff68021c70a750e7c",
        //     "5df97264f68021d2fbddbd1b"
        //   ],
        //   date: 1576629544640,
        //   json: "{\"name\":\"Tes sim\",\"description\":\"Test sim\",\"public\":true,\"practice\":true,\"recipes\":[\"5df955aff68021c70a750e7c\",\"5df97264f68021d2fbddbd1b\"]}"
        // }
      ],
      recipes: [
        // {
        //   id: "5df955aff68021c70a750e7c",
        //   name: "shake json",
        //   description: "shake json",
        //   public: true,
        //   date: 1576621487054,
        //   creator: "5df95047f68021bf989758dd",
        // },
        // {
        //   id: "5df97264f68021d2fbddbd1b",
        //   name: "shot of brandy",
        //   description: "shot",
        //   public: true,
        //   date: 1576628836113,
        //   creator: "5df95047f68021bf989758dd"
        // }
      ],
    };
    {
      let globalThis = this;
      let xhr = new XMLHttpRequest();
      xhr.open('GET', '/recipe/list');
      xhr.onload = function () {
        // do something to response
        var responseObject = null;
        try {
          responseObject = JSON.parse(this.responseText)
          globalThis.setState({ recipes: responseObject.recipes });
        } catch (e) {
          console.error("Got Non JSON response from server");
        }
      };
      xhr.send();
    }
    {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', '/simulation/list/mine');
      let globalThis = this
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
      xhr.send();
    }
    {
      let globalThis = this;
      let xhr = new XMLHttpRequest();
      xhr.open('GET', '/user');
      xhr.onload = function () {
        // do something to response
        var responseObject = null;
        try {
          responseObject = JSON.parse(this.responseText)
          globalThis.setState({ user: responseObject.user });
        } catch (e) {
          console.error("Got Non JSON response from server");
        }
      };
      xhr.send();
    }
    this.deleteRecipeCallback = this.deleteRecipeCallback.bind(this);
    this.deleteSimulationCallback = this.deleteSimulationCallback.bind(this);
    this.redirect = this.redirect.bind(this);
  }
  deleteRecipeCallback(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/recipe/delete');
    var formData = new FormData()
    formData.append("id", id);
    var globalThis = this
    xhr.onload = function () {
      if (this.status == 200) {
        var newList = []
        let recList = globalThis.state.recipes;
        for (var x of recList) {
          if (x.id != id) {
            newList.append(x);
          }
        }
        globalThis.setState({ recipes: newList })
      } else {
        console.log("Got error response code " + this.status + " when trying to delete");
      }
    };
    xhr.send(formData);
  }
  deleteSimulationCallback(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/simulation/delete');
    var formData = new FormData()
    formData.append("id", id);
    var globalThis = this
    xhr.onload = function () {

      if (this.status === 200) {
        var newList = []
        let simList = globalThis.state.simulations;
        for (var x of simList) {
          if (x.id != id) {
            newList.append(x);
          }
        }
        globalThis.setState({ simulations: newList })
      } else {
        console.log("Got error response code " + this.status + " when trying to delete");
      }
    };
    xhr.send(formData);
  }
  redirect(eventKey, event) {
    if (eventKey === "drink-new") {
      this.props.history.push("/bartop/recipe/add");
      window.location.reload(true);
    } else {
      this.props.history.push("/creator/" + eventKey);
      window.location.reload(true);
    }
    // console.log(eventKey)
  }
  render() {
    return (
      <React.Fragment>
        <NavigationBar />
        <Tabs defaultActiveKey={(this.props.match.params.var1 == null || this.props.match.params.var1 == "") ? "test-overview" : this.props.match.params.var1} transition={false} id="creator-tabs" onSelect={this.redirect} >
          <Tab eventKey="test-overview" title="Test Overview" />
          <Tab eventKey="test-new" title="Create A New Test" />
          <Tab eventKey="drink-new" title="Create A New Drink" />
        </Tabs>

        <Router>
          <Switch>
            <Route exact path="/creator/" render={(props) => <TestOverview {...props} user={this.state.user} recipes={this.state.recipes} deleteRecipeCallback={this.deleteRecipeCallback} />} />
            <Route exact path="/creator/test-overview" render={(props) => <TestOverview {...props} user={this.state.user} recipes={this.state.recipes} deleteRecipeCallback={this.deleteRecipeCallback} />} />
            <Route exact path="/creator/test-new" render={(props) => <TestNew {...props} recipes={this.state.recipes} simulations={this.state.simulations} />} />
            <Route exact path="/creator/test-results" render={(props) => <TestResultsDetailed {...props} user={this.state.user} simulations={this.state.simulations} deleteSimulationCallback={this.deleteSimulationCallback} />} />
          </Switch>
        </Router>
      </React.Fragment>

      // <div>
      // <NavigationBar />
      // <Tabs defaultActiveKey="createSimulation" transition={false} id="creator-tabs">
      //   <Tab eventKey="createSimulation" title="Create Simulation">
      //     <CreateSimulation />
      //   </Tab>
      //   <Tab eventKey="editSimulation" title="Edit Simulation">
      //     <EditSimulation />
      //   </Tab>

      //   <Tab eventKey="viewMySimulations" title="View My Simulations">
      //     <ViewMySimulations />
      //   </Tab>
      // </Tabs>
      // </div>
    )
  }
}
