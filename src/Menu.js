import React from 'react';
import ReactDOM from 'react-dom';
import MenuButton from "./Buttons.js";
import firebase from "./firebase.js";

class MenuPage extends React.Component {
    constructor(){
        super();
        this.state = {
            Name: "Sebastian",
            Game_Key: "2"
        }
        this.setName = this.setName.bind(this)
        this.setLobby = this.setLobby.bind(this)
        this.createLobby = this.createLobby.bind(this)
    }

    setName(){
        this.setState({Name: document.querySelector("#name").value})
    }

    setLobby() {
        var lobby = document.querySelector("#game_input").value
        this.setState({
            Name: this.state.Name,
            Game_Key: document.querySelector("#game_input").value
        })
        var firestore = firebase.firestore();  
        var docRef = firestore.doc("Games/Game " + document.querySelector("#game_input").value);
        docRef.update({
            players : firebase.firestore.FieldValue.arrayUnion(document.querySelector("#name").value)
        })   
    }

    createLobby() {
        var random_num = Math.floor(Math.random() * 1000000);
        this.setState({
            Name: this.state.Name,
            Game_Key: random_num
        })
        var firestore = firebase.firestore();  
        var docRef = firestore.doc("Games/Game " + random_num);
        docRef.set({
            PlayerAmnt: 1
        })
        docRef.update({
            players : firebase.firestore.FieldValue.arrayUnion(this.state.Name)
        })
    }

    render(){
        return (
            <div>
                <div style={{display: "flex", justifyContent: "center"}}>
                <h1>{this.state.Name}</h1>
                </div>
                <div style={{display: "flex", justifyContent: "center"}}>
                <h1>Lobby: {this.state.Game_Key}</h1>
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
                    <input type="textfield" id="game_input"></input>
                    <MenuButton 
                        style={{fontSize: "30px"}} 
                        text="Join game"
                        onClick={this.setLobby}
                    />
                    <MenuButton 
                        style={{fontSize: "30px"}} 
                        text="Host Game"
                        onClick={this.createLobby}
                    />
                </div>
            </div>
        )
    }
}

export default MenuPage;