import React from 'react';
import ReactDOM from 'react-dom';
import MenuButton from "./Buttons.js";
import firebase from "./firebase.js";

class MenuPage extends React.Component {
    constructor(){
        super();
        this.state = {
            Name: "Sebastian"
        }
        this.setName = this.setName.bind(this)
    }

    setName(){
        this.setState({Name: document.querySelector("#name").value})
        var firestore = firebase.firestore();  
        var docRef = firestore.doc("Games/Game 2");
        docRef.update({
        players : firebase.firestore.FieldValue.arrayUnion(document.querySelector("#name").value)
        })    
    }

    render(){
        return (
            <div>
                <div style={{display: "flex", justifyContent: "center"}}>
                <h1>{this.state.Name}</h1>
                </div>
                <br/>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <input type="textfield" id="name"></input>
                    <MenuButton 
                        style={{fontSize: "30px"}} 
                        text="Name" 
                        onClick={this.setName}
                    />
                </div>
                <br/>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <MenuButton style={{fontSize: "30px"}} text="Join game"/>
                    <MenuButton style={{fontSize: "30px"}} text="Host Game"/>
                </div>
            </div>
        )
    }
}

export default MenuPage;