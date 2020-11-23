import React, { Component } from 'react';
import "./SelectedIngredient.scss";

export default class SelectedIngredient extends Component {
    constructor(props) {
        super(props);
        this.getIngredientImage = this.getIngredientImage.bind(this);
        this.getSlotImage = this.getSlotImage.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
        this.rotate = this.rotate.bind(this);
        this.rotateBack = this.rotateBack.bind(this);
        this.pour = this.pour.bind(this);
        this.pouring = this.pouring.bind(this);
        this.state = {
            rotation: 0,
            elapsedTime: 0,
            volumePoured: 0,
            beingPoured: false,
        }
        this.t = undefined;
        this.ounces = true;
    }
    returnStats() {
        if (this.state.selectedIngredient != null) {
            return <p> {this.state.selectedIngredient.name}, {this.state.selectedAmount}</p>
        }
    }
    handleDrop(index, event) {
        // this.props.onDragEndSelectedIngredientCallback();
        // callback(index);
    }
    rotate() {
        this.setState({
            rotation: 120
        });
    }
    rotateBack() {
        this.setState({
            rotation: 0
        });
    }
    onMouseDown() {
        if (this.props.selectedSlot == null) {
            return;
        }
        this.rotate();
        if (this.state.elapsedTime == null) {
            this.setState({ elapsedTime: 0 })
        }
        this.pouring();
    }
    
    onMouseDownItem() {
        if (this.props.selectedSlot == null) {
            return;
        }
        this.rotate();
    }
    onMouseOut() {
        clearTimeout(this.t);
        if (this.state.elapsedTime > 0) {
            this.props.addSelectedIngredientToSelectedSlotCallback(this.state.elapsedTime)
        }
        this.setState({ elapsedTime: 0 });
        this.rotateBack();
    }
    onMouseUp() {
        clearTimeout(this.t);
        
        if (this.state.elapsedTime > 0 && this.props.selectedSlot!= null) {
            
            
            let data = this.props.selectedSlot.data;
            let stack = data.actionStack;
            if ((data.amount == null)) {
                data.amount = 0;
            }
            let totalAmount = 0;
            for (var i = 0; i < stack.length; i++) {
                // check if it is ingredient or action
                if (stack[i].amount != null ) {

                    // check if ingredient is liquid or not
                    if (stack[i].scale !== "count") {
                        totalAmount = totalAmount + stack[i].amount;
                    }
                }
            }

            // total amount in cup currently
            data.amount = totalAmount;

            // amount to be poured
            let amountToBePoured = this.props.convertTimeToAmount(this.state.elapsedTime);
            // console.log(stack)
            // console.log(data.amount)
            // console.log(this.props.selectedSlot)

            if (this.props.selectedSlot.bar !== "action") {
                
                if (this.props.selectedSlot.data.glass == null) {
                    this.props.sendMessage("Cannot pour into empty slot!")
                    this.props.sendSimulationMessage("Cannot pour into empty slot!")
                }
                else if ((data.amount + amountToBePoured) < data.glass.volume) {
                    // add ingredient if there is enough room
                    this.props.addSelectedIngredientToSelectedSlotCallback(this.state.elapsedTime)
                } else {

                    let remainingVolume = data.glass.volume - data.amount;

                    if (remainingVolume !== 0) {
                        // if there is remaining space add the remaining volume
                        this.props.addSelectedIngredientToSelectedSlotCallbackRemaining(remainingVolume)
                        this.props.sendMessage("Remaining glass volume exceeded. Filled with " + remainingVolume/100 +" oz of " + this.props.selectedIngredient.name)
                        this.props.sendSimulationMessage("Remaining glass volume exceeded. Filled with " + remainingVolume/100 +" oz of " + this.props.selectedIngredient.name)
                    } else {
                        // if there is no remaining space add error message
                    this.props.sendMessage("Glass is full!")
                    this.props.sendSimulationMessage("Glass is full!")


                    }
                }
            } else {
                this.props.addSelectedIngredientToSelectedSlotCallback(this.state.elapsedTime)
            }
        } else {
            this.props.sendMessage("Select a glass from quick bar to add ingredients to!")
            this.props.sendSimulationMessage("Select a glass from quick bar to add ingredients to!")
        }
        this.setState({ elapsedTime: 0 });
        this.rotateBack();
    }
    onMouseClick() {
        console.log(this.state.elapsedTime)
         if (this.props.selectedSlot!= null) {
            this.props.addSelectedIngredientToSelectedSlotCallback(0)
        } else {
            this.props.sendMessage("Select a glass from quick bar to add ingredients to!")
            this.props.sendSimulationMessage("Select a glass from quick bar to add ingredients to!")
        }
        this.rotateBack();
    }
    pour() {
        this.setState({ elapsedTime: this.state.elapsedTime + 1 });

    }
    pouring() {
        this.pour();
        this.t = setTimeout(this.pouring, 100);
    }
    getIngredientImage() {
        const { rotation } = this.state;
        if (this.props.selectedIngredient != null) {

            let newState = this.state.ounces;
            if (this.props.selectedIngredient.scale === "ounces") {
                newState = true;
            } else {
                newState = false;
            }
            this.setState({ounces:newState})
            //console.log(this.state.ounces);
            return <div onMouseOut={this.onMouseOut} onMouseDown={this.state.ounces ? this.onMouseDown.bind(this) : this.onMouseDownItem.bind(this)} onMouseUp={this.state.ounces ? this.onMouseUp.bind(this) : this.onMouseClick.bind(this)}>
                <img style={{ transform: `rotate(${rotation}deg)` }} className="top-img" draggable="false" src={"./images/" + (this.props.selectedIngredient.category === "glasses" ? "glasses/" : "ingredients/") + (this.props.selectedIngredient.name).toLowerCase() + ".png"} alt={"Missing Image: " + this.props.selectedIngredient.name} />
                <div id="center-tooltip">Click the ingredient to add</div>
            </div>
        } else {
            return <div id="tooltip" onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)}>
                <img className="bottom-img top-image-padding" src="./images/actions/empty_spot.png" alt="empty spot" />
                <span className="tooltiptext">There's nothing in this space!</span>
            </div>
        }
    }
    getSlotImage() {
        if (this.props.selectedSlot != null) {
            if (this.props.selectedSlot.bar === "quick" && this.props.selectedSlot.data.glass != null) {
                var glass = this.props.selectedSlot.data.glass;
                var actionBar = this.props.selectedSlot.data.actionStack;
                return this.props.renderGlass(glass, actionBar);
            } else if (this.props.selectedSlot.bar === "action") {
                var slot = this.props.selectedSlot.slot;
                return this.props.renderActionBarItem(slot);
            }else {
                return <div id="tooltip">
                    <img className="bottom-img top-image-padding" src="./images/actions/empty_spot.png" alt="empty spot" />
                    <span className="tooltiptext">There's nothing in this space!</span>
                </div>
            }
        } else {
            return <div id="tooltip">
                <img className="bottom-img top-image-padding" src="./images/actions/empty_spot.png" alt="empty spot" />
                <span className="tooltiptext">There's nothing in this space!</span>
            </div>
        }
    }
    render() {
        return (
            <div className="top-center-pane">
                <div id="block"></div>
                <div className="selected-ingredient" onDrop={this.handleDrop.bind(this, 0)} onDragStart={(e) => e.preventDefault()} onDragOver={(e) => e.preventDefault()} draggable>
                    {this.getIngredientImage()}
                    <div id="ingredient-volume">
                        {this.state.ounces ? (this.props.convertTimeToAmount(this.state.elapsedTime) / 100) + " oz" : ""}
                    </div>
                </div>
                <div className="selected-glass" onDrop={this.handleDrop.bind(this, 1)} onDragOver={(e) => e.preventDefault()} draggable="false">
                    {this.getSlotImage()}
                </div>
            </div>
        );
    }

}