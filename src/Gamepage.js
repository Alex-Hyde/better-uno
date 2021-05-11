import React from "react";
import MenuPage from './Menu.js';
import Lobby from "./Lobby.js";
import firebase from "./firebase.js";
import GameCanvas from "./Canvas.js";
import ReactDOM from 'react-dom';

class GamePage extends React.Component {

    constructor(){
        super()
        this.state = {
            inLobby: false,
            Game_Key: "",
            name: "",
            players : [],
            ishost: false
        }
        this.updatecounter = 0;
        this.turnnum = 0;
        this.setInLobby = this.setInLobby.bind(this)
        this.onBackClick = this.onBackClick.bind(this)
        this.updatePlayers = this.updatePlayers.bind(this)
        this.setInGame = this.setInGame.bind(this)
        this.unsubscribe_listener = this.unsubscribe_listener.bind(this)
    }

    onBackClick(){
        this.setState(
            {
                inLobby : false,
                Game_Key : this.state.Game_Key,
                name : this.state.name,
                players : [],
                ishost: false
            })
    }

    updatePlayers(){
        console.log("penano");
        console.log("gamekey:", "Game " + this.state.Game_Key);
        this.unsubscribe = firebase.firestore().collection("Games").doc("Game " + this.state.Game_Key).onSnapshot(snapshot => {
            console.log(snapshot.data())
            if (snapshot.data()){
                this.setState({
                    inLobby : snapshot.data().inGame ? "In Game" : this.state.inLobby,
                    Game_Key : this.state.Game_Key,
                    name : this.state.name,
                    players: snapshot.data().players,
                    ishost: this.state.ishost
                }, () => {
                    if(this.updatecounter === 0){
                        this.updatecounter += 1;
                        this.turnnum = this.state.players.length
                    }
                })
            }
        })
    }

    unsubscribe_listener(){
        console.log("Hello How Are You Pee poo time");
        this.unsubscribe();
    }

    setInLobby(status, gamekey, playername, ishost = this.state.ishost) {
        this.setState({
            inLobby : status,
            Game_Key : gamekey,
            name : playername,
            players: this.state.players,
            ishost: ishost
        }, () => {
        this.updatePlayers();
        });
    }

    setInGame(){
        this.setState({
            inLobby : "In Game",
            Game_Key : this.state.Game_Key,
            name : this.state.name,
            players: this.state.players,
            ishost: this.state.ishost
        }, () => {
            this.unsubscribe_listener();
        })
        firebase.firestore().doc("Games/Game " + this.state.Game_Key).update({inGame : true})
    }

    render(){
        return (
            <div>
             {this.state.inLobby === true && 
             (
                <Lobby ishost = {this.state.ishost} Lobbycode = {this.state.Game_Key} playerlist={this.state.players} setInGame = {this.setInGame} name= {this.state.name} setInLobby = {this.setInLobby}/>
             )}
             {this.state.inLobby === false && (<MenuPage setInLobby = {this.setInLobby}/>)}
             {this.state.inLobby === "In Game" && (<GameCanvas playernum = {this.state.players.length} turnnumber ={this.turnnum} Game_Key={this.state.Game_Key}/>) }
             </div>
        )
    }
}
export default GamePage;