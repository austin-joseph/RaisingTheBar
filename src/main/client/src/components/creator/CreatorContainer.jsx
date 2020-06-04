import React, { Component } from 'react'
import { Nav, Navbar, Tabs, Tab } from 'react-bootstrap';
import NavigationBar from "./../navbar/NavigationBar";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './CreatorContainer.scss';

import TestOverview from './test-overview/TestOverview';
import TestNew from './test-new/TestNew';
import TestResultsDetailed from './test-results-detailed/TestResultsDetailed';
import TestDetails from './test-details/TestDetails';

export default class CreatorContainer extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      tests: [
        // {
        //   id: "5df9747b3077821a54f61336",
        //   creator: "5df93e963077821980b21180",
        //   name: "Test SIm",
        //   description: "Test Sim",
        //   public: true,
        //   practice: true,
        //   drinks: [
        //     "5df955aff68021c70a750e7c",
        //     "5df97264f68021d2fbddbd1b"
        //   ],
        //   dateCreated: 1576629371743,
        // },
        // {
        //   id: "5df975283077821a54f61337",
        //   creator: "5df93e963077821980b21180",
        //   name: "Tes sim",
        //   description: "Test sim",
        //   public: true,
        //   practice: true,
        //   drinks: [
        //     "5df955aff68021c70a750e7c",
        //     "5df97264f68021d2fbddbd1b"
        //   ],
        //   dateCreated: 1576629544640,
        //   json: "{\"name\":\"Tes sim\",\"description\":\"Test sim\",\"public\":true,\"practice\":true,\"recipes\":[\"5df955aff68021c70a750e7c\",\"5df97264f68021d2fbddbd1b\"]}"
        // }
      ],
      drinks: [
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
      xhr.open('GET', '/drinks/list');
      xhr.onload = function () {
        // do something to response
        var responseObject = null;
        try {
          responseObject = JSON.parse(this.responseText)
          globalThis.setState({ drinks: responseObject.drinks });
        } catch (e) {
          console.error("Got Non JSON response from server");
        }
      };
      xhr.send();
    }
    {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', '/tests/list/mine');
      let globalThis = this
      xhr.onload = function () {
        // do something to response
        var responseObject = null;
        try {
          responseObject = JSON.parse(this.responseText)
          globalThis.setState({ tests: responseObject.tests });
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
    this.deleteDrinkCallback = this.deleteDrinkCallback.bind(this);
    this.deleteTestsCallback = this.deleteTestsCallback.bind(this);
    this.submitNewTest = this.submitNewTest.bind(this);
  }
  deleteDrinkCallback(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/drinks/delete');
    var formData = new FormData()
    formData.append("id", id);
    var globalThis = this
    xhr.onload = function () {
      if (this.status == 200) {
        var newList = []
        let recList = globalThis.state.drinks;
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
  deleteTestsCallback(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/tests/delete');
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

  submitNewTest(selectedDrinks, name, desc, isPractice, isPublic) {
    console.log(selectedDrinks);
    console.log(name);
    console.log(desc);
    console.log(isPractice);
    console.log(isPublic);

  }
  render() {
    return (
      <React.Fragment>
        <NavigationBar />
        <div id={"sub-navbar"}>
          <div className={"sub-navbar-item"}><a href="/creator/test-overview"> Tests YOU Admininister </a></div>
          {/* <div className={"sub-navbar-item"}><a href="/creator/test-overview"> Tests youve been assgined</a></div> */}
          {/* <div className={"sub-navbar-item"}><a href="/creator/test-overview"> Your test results</a></div> */}
          <div className={"sub-navbar-item"}><a href="/creator/test-new"> Create A New Test </a></div>
          <div className={"sub-navbar-item"}><a href="/bartop/recipe/add"> Create A New Drink </a></div>
        </div>

        <Router>
          <Switch>
            <Route exact path="/creator/" render={(props) => <TestDetails {...props} />} />
            <Route exact path="/creator/" render={(props) => <TestOverview {...props} />} />
            <Route exact path="/creator/test-overview" render={(props) => <TestOverview {...props} tests={this.state.tests} />} />
            <Route exact path="/creator/test-new" render={(props) => <TestNew {...props} drinks={this.state.drinks} submitNewTest={this.submitNewTest} />} />
            <Route exact path="/creator/test-results" render={(props) => <TestResultsDetailed {...props} />} />
            <Route path="/creator/test-details/?:var1" render={(props) => <TestDetails {...props} />} />
          </Switch>
        </Router>
      </React.Fragment>
    )
  }
}
