import React, { Component } from 'react'
import NavigationBar from "./../navbar/NavigationBar";
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import './CreatorContainer.scss';

import TestOverview from './test-overview/TestOverview';
import TestNew from './test-new/TestNew';
import TestResults from './test-results/TestResults';
import TestDetails from './test-details/TestDetails';

export default class CreatorContainer extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      tests: [
        // {
        //   "creator": "5e504e56589f421be479423d",
        //   "dateCreated": 1591393472481,
        //   "dateLastModified": 1591393472481,
        //   isPractice: false,
        //   "testAdmins": null,
        //   name: "Test",
        //   "drinkIds": null,
        //   description: "Test",
        //   isPublic: false,
        //   "json": "{\"drinks\":[{\"id\":\"5e530ad9589f4250ac47b763\",\"name\":\"lkjg\",\"description\":\"lkjh\",\"isPublic\":true,\"dateCreated\":null,\"creator\":\"5e504e56589f421be479423d\",\"json\":\"{\\\"name\\\":\\\"lkjg\\\",\\\"description\\\":\\\"lkjh\\\",\\\"public\\\":true,\\\"actionStack\\\":[{\\\"name\\\":\\\"SWEET & SOUR\\\",\\\"amount\\\":10}],\\\"glass\\\":{\\\"name\\\":\\\"ROCKS\\\",\\\"category\\\":\\\"glasses\\\",\\\"volume\\\":1200}}\",\"hidden\":false},{\"id\":\"5ed99441e2688f3fecd10958\",\"name\":\"Test 2\",\"description\":\"Test 2\",\"isPublic\":true,\"dateCreated\":null,\"creator\":\"5e504e56589f421be479423d\",\"json\":\"{\\\"name\\\":\\\"Test 2\\\",\\\"description\\\":\\\"Test 2\\\",\\\"public\\\":true,\\\"actionStack\\\":[{\\\"name\\\":\\\"TOMATO JUICE\\\",\\\"amount\\\":6}],\\\"glass\\\":{\\\"name\\\":\\\"HURRICANE\\\",\\\"category\\\":\\\"glasses\\\",\\\"volume\\\":2000}}\",\"hidden\":false}],\"name\":\"Test\",\"description\":\"Test\",\"isPublic\":false,\"isPractice\":false}",
        //   id: "5edabcc0e2688f27dc65165f"
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
      testsLoaded: false,
      drinksLoaded: false
    };
    this.deleteDrink = this.deleteDrink.bind(this);
    this.deleteTest = this.deleteTest.bind(this);
    this.submitNewTest = this.submitNewTest.bind(this);
    this.pullDrinks = this.pullDrinks.bind(this);
    this.pullTests = this.pullTests.bind(this);
    this.pullUser = this.pullUser.bind(this);

    this.mapDrinksToTests = this.mapDrinksToTests.bind(this);

    this.pullDrinks();
    this.pullTests();
    this.pullUser();
  }
  mapDrinksToTests(tests, drinks) {

    if (!this.state.testsLoaded && !this.state.drinksLoaded) {
      if (tests === null) {
        this.setState({
          drinks: drinks,
          drinksLoaded: true
        });
      } else {
        this.setState({
          tests: tests,
          testsLoaded: true
        });
      }
      return;
    }
    if (tests === null) {
      tests = this.state.tests;
    }
    if (drinks === null) {
      drinks = this.state.drinks;
    }
    if (tests.length > 0 && drinks.length > 0) {
      for (var testIndex = 0; testIndex < tests.length; testIndex++) {
        for (var testDrinkIdIndex = 0; testDrinkIdIndex < tests[testIndex].drinkIds.length; testDrinkIdIndex++) {
          var drinksInTest = [];
          for (var drinkIndex = 0; drinkIndex < drinks.length; drinkIndex++) {
            if (tests[testIndex].drinkIds[testDrinkIdIndex] === drinks[drinkIndex].id) {
              drinksInTest.push(drinks[drinkIndex]);
            }
          }
          tests[testIndex].drinks = drinksInTest;
        }
      }
      this.setState({
        tests: tests,
        drinks: drinks,
        drinksLoaded: true,
        testsLoaded: true
      });
    }
  }
  pullDrinks() {
    let globalThis = this;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './drinks/list');
    xhr.onload = function () {
      var responseObject = null;
      try {
        responseObject = JSON.parse(this.responseText);
        console.log("Drinks");
        console.log(responseObject.drinks);
        globalThis.mapDrinksToTests(null, responseObject.drinks);
      } catch (e) {
        console.log("Got non JSON response with error response code " + this.status + " when trying to get current user's drink list");
      }
    };
    xhr.send();
  }
  pullTests() {
    let globalThis = this;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './tests/list/mine');
    xhr.onload = function () {
      try {
        var responseObject = JSON.parse(this.responseText)
        console.log("Tests");
        console.log(responseObject.tests);
        globalThis.mapDrinksToTests(responseObject.tests, null);
      } catch (e) {
        console.log("Got non JSON response with error response code " + this.status + " when trying to get current user's test list");
      }
    };
    xhr.send();
  }
  pullUser() {
    let globalThis = this;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', './user');
    xhr.onload = function () {
      var responseObject = null;
      try {
        responseObject = JSON.parse(this.responseText)
        globalThis.setState({ user: responseObject.user });
      } catch (e) {
        console.log("Got non JSON response with error response code " + this.status + " when trying to get current user");
      }
    };
    xhr.send();
  }
  deleteDrink(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './drinks/delete');
    var formData = new FormData()
    formData.append("id", id);
    var globalThis = this
    xhr.onload = function () {
      if (this.status == 200) {
        globalThis.pullDrinks();
      } else {
        console.log("Got error response code " + this.status + " when trying to delete");
      }
    };
    xhr.send(formData);
  }
  deleteTest(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './tests/delete');
    var formData = new FormData()
    formData.append("id", id);
    var globalThis = this
    xhr.onload = function () {
      if (this.status === 200) {
        globalThis.pullTests();
      } else {
        console.log("Got error response code " + this.status + " when trying to delete id: " + id);
      }
    };
    xhr.send(formData);
  }

  submitNewTest(selectedDrinks, name, desc, isPractice, isPublic, onSubmitFinishCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './tests/add');
    var formData = new FormData()
    formData.append("name", name);
    formData.append("description", desc);
    formData.append("isPractice", isPractice);
    formData.append("isPublic", isPublic);
    formData.append("drinkIds", selectedDrinks);
    formData.append("json", "{}");
    var globalThis = this;
    xhr.onload = function () {
      if (this.status == 202) {
        globalThis.pullTests();
      }
      onSubmitFinishCallback(this)
    };
    xhr.send(formData);
  }

  submitEditedTest(id, selectedDrinks, name, desc, isPractice, isPublic, onSubmitFinishCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './tests/edit');
    var formData = new FormData()
    formData.append("id", id);
    formData.append("name", name);
    formData.append("description", desc);
    formData.append("isPractice", isPractice);
    formData.append("isPublic", isPublic);
    formData.append("drinkIds", selectedDrinks);
    formData.append("json", "{}");
    var globalThis = this;
    xhr.onload = function () {
      if (this.status == 202) {
        globalThis.pullTests();
      }
      onSubmitFinishCallback(this)
    };
    xhr.send(formData);
  }
  render() {
    return (
      <React.Fragment>
        <NavigationBar />
        <div id={"creator-container-sub-navbar"}>
          <div className={"sub-navbar-item"}><a href="./creator/test/overview"> Tests YOU Admininister </a></div>
          {/* <div className={"sub-navbar-item"}><a href="./creator/test-overview"> Tests youve been assgined</a></div> */}
          {/* <div className={"sub-navbar-item"}><a href="./creator/test-overview"> Your test results</a></div> */}
          <div className={"sub-navbar-item"}><a href="./creator/test/new"> Create A New Test </a></div>
          <div className={"sub-navbar-item"}><a href="./bartop/drink/new"> Create A New Drink </a></div>
        </div>

        <BrowserRouter>
          <Switch>
            <Route exact path="*/creator/" render={(props) => <TestOverview {...props} tests={this.state.tests} deleteTest={this.deleteTest} />} />
            <Route exact path="*/creator/test/overview" render={(props) => <TestOverview {...props} tests={this.state.tests} deleteTest={this.deleteTest} />} />
            <Route exact path="*/creator/test/new" render={(props) => <TestNew {...props} drinks={this.state.drinks} submitNewTest={this.submitNewTest} />} />
            <Route exact path="*/creator/test/edit/:testId?" render={(props) => <TestNew {...props} tests={this.state.tests} drinks={this.state.drinks} submitEditedTest={this.submitEditedTest} />} />
            <Route exact path="*/creator/test/results/:testId?" render={(props) => <TestResults {...props} tests={this.state.tests} />} />
            <Route exact path="*/creator/test/details/:testId?" render={(props) => <TestDetails {...props} tests={this.state.tests} />} />
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    )
  }
}
