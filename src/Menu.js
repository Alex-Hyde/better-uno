import React from 'react';
import ReactDOM from 'react-dom';
import LobbyBanner from './Banner.js';
import MenuButton from "./Buttons.js";
import firebase from "./firebase.js";

class MenuPage extends React.Component {
    constructor(props){
        console.log(props);
        super();
        this.state = {
            Name: "",
            Game_Key: "",
        }
        this.setName = this.setName.bind(this)
        this.setLobby = this.setLobby.bind(this)
        this.createLobby = this.createLobby.bind(this)
        this.setCode = this.setCode.bind(this)
    }

    setName(event){
        this.setState({
            Name: event.target.value,
            Game_Key: this.state.Game_Key
        })
    }

    setCode(event){
        this.setState({
            Name: this.state.Name,
            Game_Key: event.target.value
        })
    }

    setLobby(e) {
        e.preventDefault();
        var firestore = firebase.firestore();  
        var docRef = firestore.doc("Games/Game " + this.state.Game_Key);
        docRef.get()
        .then((docSnapshot) => {
          if ((docSnapshot.exists)){
                    console.log("peepoo")
                    docRef.update({
                        players : firebase.firestore.FieldValue.arrayUnion(this.state.Name)
                    }) 
                this.props.setInLobby(true, this.state.Game_Key, this.state.Name);
            } 
          else {
            this.setState({
                Name: this.state.Name,
                Game_Key: "Not found",
            })
            return;
          }
      });
    }

    createLobby() {
        var random_num = Math.floor(Math.random() * 1000000);
        this.setState({
            Name: this.state.Name,
            Game_Key: random_num,
        })
        var firestore = firebase.firestore();  
        var docRef = firestore.doc("Games/Game " + random_num);
        docRef.set({
            PlayerAmnt: 1
        })
        docRef.update({
            players : firebase.firestore.FieldValue.arrayUnion(this.state.Name)
        })
        this.props.setInLobby(true, this.state.Game_Key, this.state.Name);
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
                <form>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <h1 style={{fontSize: "30px"}}> Enter Your Name:</h1>
                        <input type="textfield" placeholder="Player Name" onChange={this.setName}></input>                 
                    </div>
                    <br/>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <input type="textfield" placeholder="Enter Game Code" onChange={this.setCode}></input>
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
                </form>
            </div>
        )

    }
}

export default MenuPage;