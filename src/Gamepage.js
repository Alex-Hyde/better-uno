import React from "react";
import MenuPage from './Menu.js';
import Lobby from "./Lobby.js";
import firebase from "./firebase.js";

class GamePage extends React.Component {

    constructor(){
        super()
        this.state = {
            inLobby: false,
            Game_Key: "",
            name: "",
            players : []
        }
        this.setInLobby = this.setInLobby.bind(this)
        this.onBackClick = this.onBackClick.bind(this)
        this.updatePlayers = this.updatePlayers.bind(this)
    }

    onBackClick(){
        this.setState(
            {
                inLobby : false,
                Game_Key : this.state.Game_Key,
                name : this.state.name,
                players: []
            })
    }

    

    updatePlayers() {
        firebase.firestore().collection("Games").doc("Game " + this.state.Game_Key).onSnapshot(snapshot => {
            if (snapshot.data()){
                this.setState({
                    inLobby : this.state.inLobby,
                    Game_Key : this.state.Game_Key,
                    name : this.state.name,
                    players: snapshot.data().players
                })
            }
        })
    }

    setInLobby(status, gamekey, playername) {
        this.setState({
            inLobby : status,
            Game_Key : gamekey,
            name : playername,
            players: this.state.players
        }, () => {
        this.updatePlayers();
        });
    }


    render(){
        return (
            <div>
             {this.state.inLobby === true && 
             (
                <Lobby Lobbycode = {this.state.Game_Key} playerlist={this.state.players} name= {this.state.name} setInLobby = {this.setInLobby}/>
             )}
             {this.state.inLobby === false && (<MenuPage setInLobby = {this.setInLobby}/>)}
             </div>
        )
    }
}
export default GamePage;