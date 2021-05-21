import React from "react";
import MenuPage from './Menu.js';
import Lobby from "./Lobby.js";
import firebase from "./firebase.js";
import GameCanvas from "./Canvas.js";
import ReactDOM from 'react-dom';
import MasterDeck from "./Deck.js";
import specialdeck from "./SpecialDeck.js";

class GamePage extends React.Component {

    constructor(){
        super()
        this.state = {
            inLobby: false,
            Game_Key: "",
            name: "",
            players : [],
            turnnum : 0
        }
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
                turnnum: this.state.turnnum
            })
    }

    updatePlayers(){
        this.unsubscribe = firebase.firestore().collection("Games").doc("Game " + this.state.Game_Key).onSnapshot(snapshot => {
            if (snapshot.data()) {
                if (!snapshot.data().players.includes(this.state.name)) {
                    this.setState({
                        inLobby : false,
                        Game_Key : "Kicked",
                        name : this.state.name,
                        players: [],
                        ishost: false
                    })
                    return;
                }
                this.setState({
                    inLobby : snapshot.data().inGame ? "In Game" : this.state.inLobby,
                    Game_Key : this.state.Game_Key,
                    name : this.state.name,
                    players: snapshot.data().players,
                    turnnum: this.state.turnnum
                }, () => {
                    this.setState(
                    {
                        inLobby : this.state.inLobby,
                        Game_Key : this.state.Game_Key,
                        name : this.state.name,
                        players : this.state.players,
                        turnnum: this.state.players.indexOf(this.state.name)
                    })
                })
            }
        })
    }

    unsubscribe_listener(){
        this.unsubscribe();
    }

    setInLobby(status, gamekey, playername) {
        this.setState({
            inLobby : status,
            Game_Key : gamekey,
            name : playername,
            players: this.state.players,
            turnnum: this.state.turnnum
        }, () => {
        this.updatePlayers();
        });
    }

    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    setInGame(){
        var Cards = MasterDeck.slice()
        this.shuffleArray(Cards);
        var specialCards = specialdeck.slice();
        this.shuffleArray(specialCards)
        var handsMap = {}
        for (var i = 0; i < this.state.players.length; i++){
            handsMap["Player " + i.toString()] = Cards.splice(0,7);
        }
        firebase.firestore().doc("Games/Game " + this.state.Game_Key).update({
            Deck: Cards,
            specialdeck: specialCards,
            inGame : true,
                hands : handsMap
        }).then(() => {
            this.setState({
                inLobby : "In Game",
                Game_Key : this.state.Game_Key,
                name : this.state.name,
                players: this.state.players,
                turnnum: this.state.turnnum
            })
        this.unsubscribe_listener();
        })
    }

    render(){
        return (
            <div>
             {this.state.inLobby === true && 
             (
                <Lobby ishost = {!this.state.turnnum} Lobbycode = {this.state.Game_Key} playerlist={this.state.players} setInGame = {this.setInGame} name= {this.state.name} setInLobby = {this.setInLobby}/>
             )}
             {this.state.inLobby === false && (<MenuPage setInLobby = {this.setInLobby}/>)}
             {this.state.inLobby === "In Game" && (<GameCanvas setInLobby = {this.setInLobby} players = {this.state.players} turnnumber ={this.state.turnnum} Game_Key={this.state.Game_Key}/>) }
             </div>
        )
    }
}
export default GamePage;