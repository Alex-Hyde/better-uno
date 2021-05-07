import React from 'react';
import ReactDOM from 'react-dom';
import LobbyBanner from './Banner.js';
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
        console.log(docRef.get().PromiseResult)
        docRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            docRef.onSnapshot((doc) => {
                docRef.update({
                    players : firebase.firestore.FieldValue.arrayUnion(this.state.Name)
                }) 
            });
          } else {
            this.setState({
                Name: this.state.Name,
                Game_Key: "Not found"
            })
          }
      });


        /*if (docRef.get().exists()) {
            docRef.update({
                players : firebase.firestore.FieldValue.arrayUnion(document.querySelector("#name").value)
            })   
        } else {
            this.setState({
                Name: this.state.Name,
                Game_Key: "Not found"
            })
        }*/
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
                        style={{fontSize: "30px", "margin-left": "10px"}} 
                        text="Host Game"
                        onClick={this.createLobby}
                    />
                </div>
            </div>
        )
    }
}

export default MenuPage;