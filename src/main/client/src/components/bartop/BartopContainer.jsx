import React, { Component } from 'react'
import NavigationBar from "../navbar/NavigationBar";
// import { Container, Row, Col } from "react-bootstrap";
import IngredientsTable from "./IngredientsTable";
import Controls from "./Controls";
import QuickBar from "./QuickBar";
import SelectedIngredient from "./SelectedIngredient";
import ActionBar from "./ActionBar";
import RecipeRightPanel from "./RecipeRightPanel.jsx";
import SimulationRightPanel from "./SimulationRightPanel.jsx";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NoMatch from '../NoMatch';

import './BartopContainer.scss';
import ingredientsJsonFile from "../../assets/ingredients.json"

export default class BartopContainer extends Component {
  constructor(props) {
    super(props);
    var otherIngredients = [];
    var glasses = [];
    var alcohol = [];
    ingredientsJsonFile.ingredients.sort((a, b) => {
      return a.name > b.name;
    });
    for (var x of ingredientsJsonFile.ingredients) {
      if (x["category"] === null) {
        x["category"] = "other";
        otherIngredients.push(x);
      } else if (x["category"] === "glasses") {
        glasses.push(x)
      } else {
        otherIngredients.push(x);
      }
    }
    this.state = {
      selectedIngredient: null,
      selectedSlot: null,
      otherIngredients: otherIngredients,
      glasses: glasses,
      alcohol: alcohol,
      dragged: null,
      recipeQueue: [],
      completedRecipes: [],
      messageLog: [],
      open: false,
      simulationLog: [],
      finished: false,
      grade: null,
      isPractice: false,



      mode: {
        mode: null
      },
      quickBar: [{
        glass: null,
        actionStack: []
      },
      {
        glass: null,
        actionStack: []
      },
      {
        glass: null,
        actionStack: []
      }],
      actionBar: [{
        //Shaker
        actionStack: []
      },
      {
        //Pan
        actionStack: []
      },
      {
        //Knife
        actionStack: []
      }]
    };
    this.onActionEndCallback = this.onActionEndCallback.bind(this);
    this.addSelectedIngredientToSelectedSlotCallback = this.addSelectedIngredientToSelectedSlotCallback.bind(this);
    this.addSelectedIngredientToSelectedSlotCallbackRemaining = this.addSelectedIngredientToSelectedSlotCallbackRemaining.bind(this);
    this.onSelectedIngredientChangeCallback = this.onSelectedIngredientChangeCallback.bind(this);
    this.onSelectedSlotChangeCallback = this.onSelectedSlotChangeCallback.bind(this);
    this.onDragStartCallback = this.onDragStartCallback.bind(this);
    this.onDragEndActionBarCallback = this.onDragEndActionBarCallback.bind(this);
    this.onDragEndQuickBarCallback = this.onDragEndQuickBarCallback.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.sendSimulationMessage = this.sendSimulationMessage.bind(this);
    this.submitRecipeCallback = this.submitRecipeCallback.bind(this);
    this.renderGlass = this.renderGlass.bind(this);
    this.renderActionBarItem = this.renderActionBarItem.bind(this);
    this.addRecipeToQueue = this.addRecipeToQueue.bind(this);
    this.convertTimeToAmount = this.convertTimeToAmount.bind(this);
    this.handleChildClick = this.handleChildClick.bind(this);
    this.handleGarbage = this.handleGarbage.bind(this);
    this.submitRecipeGradingCallback = this.submitRecipeGradingCallback.bind(this);
    this.submitSimulationGradingCallback = this.submitSimulationGradingCallback.bind(this);
    this.getRecIngredients = this.getRecIngredients.bind(this);
    this.setPractice = this.setPractice.bind(this);

    var mode = {
      mode: this.props.match.params.var1,
      submode: this.props.match.params.var2,
      data: {}
    }
    if (this.props.match.params.var1 === "drink") {

      if (this.props.match.params.var2 === "new") {
        mode.data = {
          name: "",
          description: ""
        }
      } else if (this.props.match.params.var2 === "edit" && this.props.match.params.var3 != null) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "./drinks/get?id=" + this.props.match.params.var3);
        // let local_this = this;
        xhr.onload = function (e) {
          // do something to response
          let recipeJson = JSON.parse(e.target.response);
          // console.log(JSON.parse(e.target.response));
          mode.data = {
            name: recipeJson.name,
            description: recipeJson.description
          }
          this.state.quickBar = [
            {
              glass: recipeJson.glass,
              actionStack: recipeJson.actionStack
            },
            {
              glass: null,
              actionStack: []
            },
            {
              glass: null,
              actionStack: []
            }
          ];
        };
        xhr.send();
      }
    } else if (this.props.match.params.var1 === "test") {
      var globalThis = this;
      if (this.props.match.params.var2 != null) {
        var xhrSim = new XMLHttpRequest();
        xhrSim.open('GET', "./tests/get?id=" + this.props.match.params.var2);
        xhrSim.onload = function () {
          if (this.status == 200) {
            let simulationJson = JSON.parse(this.responseText);
            if (simulationJson.isPractice) {
              globalThis.setPractice();
            }
            if (simulationJson.drinkIds != null) {
              for (var i = 0; i < simulationJson.drinkIds.length; i++) {
                var xhr2 = new XMLHttpRequest();
                xhr2.open('GET', "./drinks/get?id=" + simulationJson.drinkIds[i]);
                xhr2.onload = function () {
                  if (this.status === 200) {
                    try {
                      // console.log(this.responseText)
                      // console.log(JSON.parse(this.responseText));
                      globalThis.addRecipeToQueue(JSON.parse(this.responseText));
                    } catch (e) {
                      console.error(e);
                    }
                  } else {
                    console.log("Got status code " + this.status)
                  }
                };
                xhr2.send();
              }
            }
            else {
              console.log("Test does not contain any drinks");
            }
          } else {
            globalThis.sendSimulationMessage("This isnt a valid simulation, recopy the link and try again.")
          }
        };
        xhrSim.send();
      }

    }


    /*var rec1 = {"_id":"5df5b1de30778238e06d6b2e","name":"recipe 2","description":"A classic drink for a classic person","isPublic":true,"date":"2019-12-15T04:09:02.151Z","creator":"5df0fcd730778234fc4656fd",
        "json":"{\"name\":\"Whisky Tonic\",\"description\":\"A classic drink for a classic person\",\"public\":true,\"actionStack\":[{\"name\":\"BRANDY\",\"amount\":25},[\"shake\",[{\"name\":\"BRANDY\",\"amount\":25},{\"name\":\"BOURBON\",\"amount\":25}]]],\"glass\":{\"name\":\"SHOT\",\"category\":\"glasses\",\"volume\":100}}","_class":"darkpurple.hw2.database.entity.Recipe"};


             
    var rec2 = {"_id":"5df5b1de30778238e06d6b2e","name":"recipe 1","description":"A classic drink for a classic person","isPublic":true,"date":"2019-12-15T04:09:02.151Z","creator":"5df0fcd730778234fc4656fd",
        "json":"{\"name\":\"Whisky Tonic\",\"description\":\"A classic drink for a classic person\",\"public\":true,\"actionStack\":[{\"name\":\"BRANDY\",\"amount\":25}],\"glass\":{\"name\":\"SHOT\",\"category\":\"glasses\",\"volume\":1200}}","_class":"darkpurple.hw2.database.entity.Recipe"};
    this.addRecipeToQueue(rec1);
    this.addRecipeToQueue(rec2);
    this.state.mode = mode;*/


  }


  addRecipeToQueue(recipe) {
    let tempRecipeQueue = this.state.recipeQueue;
    tempRecipeQueue.push(recipe);
    this.setState({ recipeQueue: tempRecipeQueue })
  }

  submitRecipeCallback(data) {
    // console.log(data);
    if (data.name.length <= 0) {
      this.sendMessage("Can't submit, you must input a name");
      return;
    }
    if (data.description.length <= 0) {
      this.sendMessage("Can't submit, you must input a description");
      return;
    }
    if (data.name.length > 50) {
      this.sendMessage("Can't submit, the recipe name cant be longer than 50 characters");
      return;
    }
    if (data.description.length > 500) {
      this.sendMessage("Can't submit, the recipe description cant be longer than 500 characters");
      return;
    }
    if (this.state.selectedSlot == null || this.state.selectedSlot.bar != "quick") {
      this.sendMessage("Can't submit, a quick bar item must be selected");
      return;
    }
    if (this.state.selectedSlot.data.glass == null) {
      this.sendMessage("Can't submit, you must select a glass");
      return;
    }
    if (this.state.selectedSlot.data.actionStack.length < 1) {
      this.sendMessage("Can't submit, the glass cannot be empty");
      return;
    }
    let prunedActionStack = []
    for (var i = 0; i < this.state.selectedSlot.data.actionStack.length; i++) {
      let current = this.state.selectedSlot.data.actionStack[i];
      console.log(current)
      if (current instanceof Array) {
        console.log("shaken array")
        // if shaken array
        prunedActionStack.push(current)
      } else {
        console.log("regular ingredient")
        // if regular ingredient
        let newObject = {
          name: current.name,
          amount: current.amount
        }
        prunedActionStack.push(newObject)
      }
    }
    let outputJson = {
      name: data.name,
      description: data.description,
      public: data.public,
      actionStack: prunedActionStack,
      glass: this.state.selectedSlot.data.glass
    }
    // console.log(outputJson);
    var formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("isPublic", data.public);
    formData.append("json", JSON.stringify(outputJson));
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "./drinks/add");
    var parent = this
    console.log(formData.entries());
    xhr.onload = function () {
      // console.log(this)
      if (this.status == 201) {
        parent.props.history.push("../results/drinks/add/success");
      } else {
        parent.sendMessage("Error: " + this.status + " when sending recipe to server");
      }
      // console.log(this);
    };
    xhr.send(formData);
  }

  submitRecipeGradingCallback() {
    if (this.state.selectedSlot == null || this.state.selectedSlot.bar != "quick") {
      this.sendSimulationMessage("Can't submit recipe for grading, a quick bar item must be selected");
      return;
    }
    if (this.state.selectedSlot.data.glass == null) {
      this.sendSimulationMessage("Can't submit recipe for grading, you must select a glass");
      return;
    }
    if (this.state.selectedSlot.data.actionStack.length < 1) {
      this.sendSimulationMessage("Can't submit recipe for grading, the glass cannot be empty");
      return;
    }

    let recipe = this.state.completedRecipes;
    recipe.push(Object.assign({}, this.state.selectedSlot.data));


    this.setState({ completedRecipes: recipe })

    // if user has submitted the number of recipes in the simulation, automatically submit simulation for grading
    if (this.state.recipeQueue.length == this.state.completedRecipes.length) {
      this.submitSimulationGradingCallback();

    }

    // CLEAR SELECTED GLASS AFTER SUBMITTING RECIPE STILL TO BE IMPLEMENTED
    var qIndex = this.state.selectedSlot.slot;
    this.state.quickBar[qIndex].actionStack = [];
    this.state.quickBar[qIndex].glass = null;
    this.setState({ quickBar: this.state.quickBar });

  }

  setPractice() {
    this.setState({ isPractice: true });

  }

  submitSimulationGradingCallback() {

    var recipesCompletedList = this.state.completedRecipes;
    var recipeQueueList = this.state.recipeQueue;

    var recipesCompletedLength = recipesCompletedList.length;
    var recipeQueueLength = recipeQueueList.length
    var pointsForEachRecipe = (100 / this.state.recipeQueue.length);
    var totalRecipesCorrect = 0;
    // loop through recipes in completed recipes and compare to see if it matches recipes in the queue
    for (var i = 0; i < recipesCompletedLength; i++) {
      var match = true;
      var recipeJsonParsed = JSON.parse(recipeQueueList[i].json);
      // check if glass is correct
      if (recipesCompletedList[i].glass.name === recipeJsonParsed.glass.name) {
        // check if both action stack length match
        if (recipesCompletedList[i].actionStack.length === recipeJsonParsed.actionStack.length) {
          console.log("action stack length is same")
          //if action stack lengths match start comparing the items in both action stacks
          for (var j = 0; j < recipesCompletedList[i].actionStack.length; j++) {
            // console.log(recipesCompletedList[i].actionStack[j])
            // console.log(JSON.parse(recipeQueueList[i].json).actionStack[j])
            // if one actionstack item is of type array and another is of type object
            if ((recipesCompletedList[i].actionStack[j] instanceof Array && recipeJsonParsed.actionStack[j] instanceof Array)) {
              // console.log("both shaken array")
              // if both actionstack items are arrays compare the shaken array ingredients

              // sort both arrays first
              recipesCompletedList[i].actionStack[j][1].sort(function (a, b) {
                var nameA = a.name.toLowerCase();
                var nameB = b.name.toLowerCase();
                if (nameA < nameB)
                  return -1;
                if (nameA > nameB)
                  return 1
                return 0
              })
              recipeJsonParsed.actionStack[j][1].sort(function (a, b) {
                var nameA = a.name.toLowerCase();
                var nameB = b.name.toLowerCase();
                if (nameA < nameB)
                  return -1;
                if (nameA > nameB)
                  return 1
                return 0
              });
              // merge duplicates MIGHT PLACE THIS CODE ELSEWHERE AS INGREDIENTS SHOULD BE MERGED ONCE ADDED
              // IMPLEMENTED ALREADY


              // check if array length is the same (same number of ingredients shaken)
              if (recipesCompletedList[i].actionStack[j][1].length !== recipeJsonParsed.actionStack[j][1].length) {
                // console.log("number of ingredients shaken not equal")

                match = false;
              } else {
                // if same number of ingredients check for each ingredient and amount
                for (var k = 0; k < recipesCompletedList[i].actionStack[j][1].length; k++) {
                  if ((recipesCompletedList[i].actionStack[j][1][k].name !== recipeJsonParsed.actionStack[j][1][k].name)) {
                    // console.log("ingredients not the same");
                    match = false;
                  }

                  // check ingredients amount 10 percentage leeway for shaken liquids
                  var tenPercentOfAmount = recipeJsonParsed.actionStack[j][1][k].amount * .10;
                  var bottomRange = (recipeJsonParsed.actionStack[j][1][k].amount) - tenPercentOfAmount;
                  var topRange = (recipeJsonParsed.actionStack[j][1][k].amount) + tenPercentOfAmount;

                  // if amount doesnt fall in range
                  if (recipesCompletedList[i].actionStack[j][1][k].amount < bottomRange
                    || recipesCompletedList[i].actionStack[j][1][k].amount > topRange) {
                    match = false;
                  }
                }
              }


            } else if ((recipesCompletedList[i].actionStack[j] instanceof Array && !(recipeJsonParsed.actionStack[j] instanceof Array)) ||
              (!(recipesCompletedList[i].actionStack[j] instanceof Array) && recipeJsonParsed.actionStack[j] instanceof Array)) {

              // if one is shaken ingredients array and another is ingredient object
              console.log("one is shaken array other is just ingredient")
              match = false;
            } else {

              console.log("both are ingredients")
              // if both actionstack items are objects check if ingredient is the same
              if (recipesCompletedList[i].actionStack[j].name !== recipeJsonParsed.actionStack[j].name) {
                match = false;
              }

              // thencheck ingredients amount 10 percentage leeway if it is liquid
              if (recipesCompletedList[i].actionStack[j].scale === "ounces") {


                var tenPercentOfAmount = recipeJsonParsed.actionStack[j].amount * .10;
                var bottomRange = (recipeJsonParsed.actionStack[j].amount) - tenPercentOfAmount;
                var topRange = (recipeJsonParsed.actionStack[j].amount) + tenPercentOfAmount;

                // if amount doesnt fall in range
                if (recipesCompletedList[i].actionStack[j].amount < bottomRange
                  || recipesCompletedList[i].actionStack[j].amount > topRange) {
                  match = false;
                }
              } else if (recipesCompletedList[i].actionStack[j].scale === "count") {
                // if ingredient is solid check straight up
                if (recipesCompletedList[i].actionStack[j].amount !== recipeJsonParsed.actionStack[j].amount) {
                  match = false;
                }
              }

            }
          }

        } else {
          match = false;

        }
      } else {
        match = false;

      }

      if (match === true) {
        console.log("match = true")
        totalRecipesCorrect = totalRecipesCorrect + 1;
      }
    }

    console.log("your grade is " + (totalRecipesCorrect * pointsForEachRecipe))
    var formData = new FormData();
    formData.append("id", this.props.match.params.var2);
    formData.append("grade", (totalRecipesCorrect * pointsForEachRecipe));
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "./tests/grade/add");
    var globalThis = this;
    xhr.onload = function () {
      globalThis.setState({ grade: (totalRecipesCorrect * pointsForEachRecipe) });
      globalThis.setState({ finished: true });
    };
    xhr.send(formData);


    // MAKE SURE TO CLEAR QUICKBAR AND EVERYTHING AFTER SIMULATION IS SUBMITTED STILL TO BE IMPLEMENTED
    //GOTTA IMPLEMENT THIS

  }



  onActionEndCallback(index) {

    // if action is shake
    if (index === 0) {


      let actionStack = this.state.actionBar[index].actionStack;
      console.log(actionStack)
      if (actionStack.length == 0) {
        this.sendMessage("Only one ingredient in shaker!");
        this.sendSimulationMessage("Only one ingredient in shaker!");
      } else if (actionStack[actionStack.length - 1] !== "shake" && actionStack.length !== 1) {
        actionStack.push("shake");

        this.setState({ actionBar: [{ actionStack: actionStack }, this.state.actionBar[1], this.state.actionBar[2]] });
      } else {
        this.sendMessage("Only one ingredient in shaker!");
        this.sendSimulationMessage("Only one ingredient in shaker!");
      }
    }
  }
  convertTimeToAmount(time) {
    //amount is the amount of time that has passed in 1/10 second chunks. So amount = 10 means that 1 second has passed

    return time;
    // if (time >= 15) {
    //   return elapsedTime * 10;
    // }
    // if (time >= 10) {
    //   return 100;
    // }
    // if (time >= 5) {
    //   return 50;
    // }
    // return 25;
  }
  addSelectedIngredientToSelectedSlotCallback(elapsedTime) {
    // console.log(this.state.selectedSlot)
    // console.log(this.state.selectedIngredient)

    if (this.state.selectedIngredient != null && this.state.selectedSlot != null) {
      if ((this.state.selectedSlot.bar === "quick" && this.state.selectedSlot.data.glass != null) || (this.state.selectedSlot.bar === "action")) {
        let data = this.state.selectedSlot.data;
        let stack = data.actionStack;
        let ingredient = Object.assign({}, this.state.selectedIngredient)
        //console.log(stack)
        if (elapsedTime > 0) {
          if (data.actionStack.length > 0 && data.actionStack[data.actionStack.length - 1].name == this.state.selectedIngredient.name && data.actionStack[data.actionStack.length - 1].amount != null) {
            // if last item on the aciton stack and selected ingredient is the same merge them
            ingredient.amount = this.convertTimeToAmount(elapsedTime) + data.actionStack[data.actionStack.length - 1].amount;
            data.actionStack.pop();

          } else {

            // else if it is a new ingredient
            ingredient.amount = this.convertTimeToAmount(elapsedTime);
          }

          data.actionStack.push(ingredient);
        } else {
          // if added ingredient is of count only add 1 ct at a time

          // first check if selected slot is a shaker, if it is dont allow to add things of scale "count"
          // if it is not a shaker and ingredient is scale of count
          if (this.state.selectedSlot.bar !== "action") {
            if (data.actionStack.length > 0 && data.actionStack[data.actionStack.length - 1].name == this.state.selectedIngredient.name && data.actionStack[data.actionStack.length - 1].amount != null) {
              // if last item on the aciton stack and selected ingredient is the same merge them
              ingredient.amount = 1 + data.actionStack[data.actionStack.length - 1].amount;
              data.actionStack.pop();
            } else {
              // else if it is a new ingredient
              ingredient.amount = 1;
            }

            data.actionStack.push(ingredient);
          } else {
            // if it is shaker and ingredient is scale of dont add ingredient to shaker
            this.sendMessage("Cannot add solid items to shaker!");
            this.sendSimulationMessage("Cannot add solid items to shaker!");
          }

        }

        this.setState({ selectedSlot: { bar: this.state.selectedSlot.bar, slot: this.state.selectedSlot.slot, data: data } });

      }
    }
  }
  addSelectedIngredientToSelectedSlotCallbackRemaining(amount) {
    if (this.state.selectedIngredient != null && this.state.selectedSlot != null) {
      if ((this.state.selectedSlot.bar === "quick" && this.state.selectedSlot.data.glass != null) || (this.state.selectedSlot.bar === "action")) {
        let data = this.state.selectedSlot.data;
        let stack = data.actionStack;

        let ingredient = Object.assign({}, this.state.selectedIngredient)
        //console.log(ingredient)
        if (amount > 0) {
          if (data.actionStack.length > 0 && data.actionStack[data.actionStack.length - 1].name == this.state.selectedIngredient.name && data.actionStack[data.actionStack.length - 1].amount != null) {
            ingredient.amount = (amount) + data.actionStack[data.actionStack.length - 1].amount;
            data.actionStack.pop();
          } else {
            ingredient.amount = (amount);
          }
        }
        data.actionStack.push(ingredient);
        this.setState({ selectedSlot: { bar: this.state.selectedSlot.bar, slot: this.state.selectedSlot.slot, data: data } });
      }
    }
  }

  onSelectedIngredientChangeCallback(selectedIngredient) {
    this.setState({ selectedIngredient: selectedIngredient });
  }
  handleChildClick(e) {
    e.stopPropagation();
    console.log('child');
  }

  onSelectedSlotChangeCallback(bar, slot, data) {
    this.setState({ selectedSlot: { bar: bar, slot: slot, data: data } });
  }
  onDragStartCallback(dragged) {
    this.setState({ dragged: dragged });
  }
  onDragEndActionBarCallback(index) {
    var actionBar = this.state.actionBar
    if (actionBar[index].actionStack == null) {
      actionBar[index].actionStack = [];
    }
    var element;
    if (this.state.dragged == actionBar[index]) {
      this.sendMessage("Please drag your glass to another glass");
    }
    else if (this.state.dragged.glass != null) {

    }
    else if (this.state.dragged.category == null) { //means is an actionbar item or quickbar item
      for (element of this.state.dragged.actionStack) {
        actionBar[index].actionStack.push(element);
      }
    }
    else {
      actionBar[index].ingredient = this.state.dragged;
      actionBar[index].actionStack.push(this.state.dragged);
    }
    this.setState({ actionBar: actionBar, dragged: null });
  }
  onDragEndSelectedIngredientCallback(index) {
    var submissionSlot = this.state.submissionSlot
    submissionSlot[index].ingredient = this.state.dragged;
    this.setState({ submissionSlot: submissionSlot, dragged: null });
  }
  onDragEndSubmissionSlotCallback(index) {
    var submissionSlot = this.state.submissionSlot
    submissionSlot[index].ingredient = this.state.dragged;
    this.setState({ submissionSlot: submissionSlot, dragged: null });
  }
  onDragEndQuickBarCallback(index) {
    if (this.state.dragged != null) {
      var quickBar = this.state.quickBar;
      if (this.state.dragged.category === "glasses") { //if glass reset action stack
        quickBar[index].glass = this.state.dragged;
        quickBar[index].actionStack = [];
        this.setState({ quickBar: quickBar, dragged: null });
      } else if (this.state.dragged == quickBar[index]) {
        this.sendMessage("Please drag your glass to another glass");
      } else if (quickBar[index].glass != null && quickBar[index].glass.category === "glasses" && this.state.dragged.glass == null) {
        //when adding actionbar to quickbar, make sure the glass isnt being added to itself

        var glassVolume = quickBar[index].glass.volume;
        var contents = 0;
        for (var cont of quickBar[index].actionStack) {
          if (cont.amount != null && cont.scale === "ounces") {
            contents += cont.amount;
          }
        }
        glassVolume = glassVolume - contents;
        var draggedVolume = 0;
        for (var toAdd of this.state.dragged.actionStack) {
          if (toAdd.amount != null && toAdd.scale === "ounces") {
            draggedVolume += toAdd.amount;
          }
        }
        if (draggedVolume > glassVolume) {
          this.sendMessage("This would overfill that glass!")
          this.sendSimulationMessage("This would overfill that glass!")
        }
        else {


          //  When you shake create an array first item is word shake second item is array of 
          //  things being shaken instanceofobject = ingredient instanceofarray = shaken list 
          //  of ingredients WORRY ABOUT SHAKING SOMETHING THAT ALREADY HAS BEEN SHAKEN

          var shaken = false;

          // check if things in shaker have been shaken if not, just add the contents to glass
          for (var elements of this.state.dragged.actionStack) {
            if (elements === "shake") {
              shaken = true;
            }
          }
          if (shaken) {


            let shakeJson = [];
            shakeJson.push("shake");
            let shakeContents = [];

            for (var element of this.state.dragged.actionStack) {
              if (element !== "shake") {


                // check for duplicates when before pushing shakecontents to shakeJson
                var duplicate = false;
                var duplicateIndex;
                for (var i = 0; i < shakeContents.length; i++) {
                  if (shakeContents[i].name === element.name) {
                    shakeContents[i].amount = shakeContents[i].amount + element.amount;
                    duplicate = true;
                  }
                }
                // if no duplicate exists push ingredient
                if (duplicate === false) {
                  shakeContents.push(element);
                }
              }
            }


            shakeJson.push(shakeContents);
            quickBar[index].actionStack.push(shakeJson);
          } else {
            for (var element of this.state.dragged.actionStack) {
              quickBar[index].actionStack.push(element);
            }
          }
          this.setState({ quickBar: quickBar, dragged: null });
          console.log(quickBar[index].actionStack)

          // clear shaker after it is dragged into glass
          // IMPLEMENT THIS
          if (this.state.dragged != null) {
            this.state.dragged.actionStack = [];
          }
          this.setState({ dragged: null });


        }

      }
    } else {
      this.setState({ dragged: null });
    }
    // console.log(this.state.quickBar)
  }
  onDragEndSelectedIngredientCallback(index) {

  }
  sendMessage(message) {
    let messageLog = this.state.messageLog;
    messageLog.push(message);
    this.setState({ messageLog: messageLog });
  }

  sendSimulationMessage(message) {
    let simulationLog = this.state.simulationLog;
    simulationLog.push(message);
    this.setState({ simulationLog: simulationLog });
  }
  getRecIngredients() {
    var ings = [];
    if (this.state.isPractice && this.state.recipeQueue.length > 0 && this.state.completedRecipes.length != this.state.recipeQueue.length) {
      var index = this.state.completedRecipes.length;
      var item = this.state.recipeQueue[index];
      var item2 = JSON.parse(item.json).actionStack;
      ings.push(<p> {"Glass:" + JSON.parse(item.json).glass.name} </p>);
      ings.push(<p> {"Ingredients:"}</p>);
      for (var element of item2) {
        if (element instanceof Array) {//shaken
          ings.push(<hr />);
          for (var each of element[1]) {
            ings.push(<p> {each.name + "-" + each.amount / 100 + " (shaken)"} </p>);
          }
          ings.push(<hr />);
        }
        else {
          ings.push(<p> {element.name + "-" + element.amount / 100}</p>);
        }

      }
      return <span className="text"> {ings} </span>;
    }
    else {
      return <span className="text" >No Cheating!</span>
    }
  }


  handleGarbage() {
    if (this.state.dragged != null) {
      this.state.dragged.actionStack = [];
    }
    this.setState({ dragged: null });
  }
  renderGlass(glass, actionStack) {
    if (glass != null) {


      return <div id="tooltip" >
        <img className="top-img" draggable="false" src={"./images/glasses/" + (glass.name).toLowerCase() + ".png"} alt={"Missing Image: " + glass.name} />
        <span className="tooltiptext" onDrop={this.handleChildClick.bind(this)} >
          {
            actionStack.length == 0 ? "Empty" : actionStack.map((item, index) => {
              if (item instanceof Object) {

                if (item.scale === "ounces") {
                  return (<p key={item.name + index}>{item.name} {item.amount / 100} oz</p>);
                } else if (item.scale === "count") {
                  return (<p key={item.name + index}>{item.name} {item.amount} ct</p>);
                } else {
                  // if item is array ("shake" + shaken items)
                  return item[1].map((ingredient, index) => {

                    return <p id="log-text">{ingredient.name + " " + (ingredient.amount / 100) + " oz (shaken)"}</p>

                  });

                }

              } else {
                return (<p key={item + index}>{item} {item.amount}</p>);
              }
            })
          }
        </span>
      </div>
    } else {
      return <div id="tooltip"  >
        <img className="bottom-img" src="./images/actions/empty_spot.png" alt="empty spot" />
        <div className="MuiButton-root MuiButton-text" id="centered">Quick Bar</div>
        <span className="tooltiptext" >There's nothing in this space!</span>
      </div>
    }
  }

  renderActionBarItem(index) {

    var image = null;

    if (index == 0) {
      image = "./images/actions/shaker.png";
    } else if (index == 1) {
      image = "./images/actions/pan.png";
    }
    else if (index == 2) {
      image = "./images/actions/knife.png";
    }
    return (<div id="tooltip"><img src={image} alt={"actionBar index " + index + " not found"} /><span className="tooltiptext">{
      this.state.actionBar[index].actionStack == 0 ? "Empty" : this.state.actionBar[index].actionStack.map((item, index) => {
        if (item instanceof Object) {
          if (item.scale === "ounces") {
            return (<p key={item.name + index}>{item.name} {item.amount / 100} oz</p>);
          } else {
            return (<p key={item.name + index}>{item.name} {item.amount} ct</p>);
          }
        } else {
          return (<p key={item + index}>{item} {item.amount}</p>);
        }
      })
    }</span></div>)

  }


  render() {
    if (this.state.finished) {
      return (
        <React.Fragment>
          <NavigationBar />
          <div id="grade">
            <span className="gradeReturned" >The grade you have received is... {this.state.grade}</span>
          </div>
        </React.Fragment>
      )
    }
    else {
      return (
        <React.Fragment>
          <NavigationBar />
          <div id="wrapper" className="center">
            <div id="sidebar-left">
              <div id="top">
                <IngredientsTable ingredients={this.state.otherIngredients} onSelectedIngredientChangeCallback={this.onSelectedIngredientChangeCallback} selected={this.state.selectedIngredient} scrolling="vert" />
              </div>

              <div id="bottom">
                <IngredientsTable ingredients={this.state.glasses} selected={this.state.selectedIngredient} scrolling="vert" onDragStartCallback={this.onDragStartCallback} />
              </div>
            </div>

            <div id="main">
              <div id="top">
                <SelectedIngredient convertTimeToAmount={this.convertTimeToAmount} addSelectedIngredientToSelectedSlotCallback={this.addSelectedIngredientToSelectedSlotCallback} renderGlass={this.renderGlass} renderActionBarItem={this.renderActionBarItem}
                  selectedIngredient={this.state.selectedIngredient} selectedSlot={this.state.selectedSlot} onDragEndSelectedIngredientCallback={this.onDragEndActionBarCallback}
                  addSelectedIngredientToSelectedSlotCallbackRemaining={this.addSelectedIngredientToSelectedSlotCallbackRemaining} sendMessage={this.sendMessage} sendSimulationMessage={this.sendSimulationMessage}
                />
                <div className="garbage" onDrop={this.handleGarbage.bind(this)} onDragOver={(e) => e.preventDefault()}>
                  <img src="./images/actions/garbage.png" />
                </div>
                <ActionBar onActionEndCallback={this.onActionEndCallback} renderActionBarItem={this.renderActionBarItem}
                  selectedSlot={this.state.selectedSlot} onSelectedSlotChangeCallback={this.onSelectedSlotChangeCallback}
                  dragged={this.state.dragged} onDragStartCallback={this.onDragStartCallback}
                  onDragEndActionBarCallback={this.onDragEndActionBarCallback} inventory={this.state.actionBar}
                />
              </div>
              <div id="bottom">
                <QuickBar renderGlass={this.renderGlass} selectedSlot={this.state.selectedSlot} onSelectedSlotChangeCallback={this.onSelectedSlotChangeCallback} dragged={this.state.dragged} onDragStartCallback={this.onDragStartCallback} onDragEndQuickBarCallback={this.onDragEndQuickBarCallback} inventory={this.state.quickBar} />
              </div>
              {/* <Controls selected={this.state.selected} parent={this} action_stack={this.state.action_stack} /> */}
            </div>

            <div id="sidebar-right">
              <Router>
                <Switch>
                  <Route path="*/drink" render={() => <RecipeRightPanel selectedSlot={this.state.selectedSlot} messageLog={this.state.messageLog} onSubmitCallback={this.submitRecipeCallback} mode={this.state.mode} />} />
                  <Route path="*/test" render={() => <SimulationRightPanel mode={this.state.mode} simulationLog={this.state.simulationLog} onSubmitRecipeCallback={this.submitRecipeGradingCallback} onSubmitSimulationCallback={this.submitSimulationGradingCallback} getRecIngredients={this.getRecIngredients} globalState={this.state} recipeQueue={this.state.recipeQueue} completedRecipes={this.state.completedRecipes} />} />
                  <Route component={NoMatch} />
                </Switch>
              </Router>
            </div>
          </div>
        </React.Fragment>
      )
    }
  }
}
