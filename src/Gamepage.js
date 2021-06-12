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
            pfp: "",
            players : [],
            pfps: [],
            turnnum : 0
        } 
        this.hasChosenpfp = false;
        
        this.setInLobby = this.setInLobby.bind(this)
        this.onBackClick = this.onBackClick.bind(this)
        this.updatePlayers = this.updatePlayers.bind(this)
        this.setInGame = this.setInGame.bind(this)
        this.unsubscribe_listener = this.unsubscribe_listener.bind(this)
        this.setPfp = this.setPfp.bind(this)
    }

    setPfp(code){
        var newpfps = this.state.pfps
        newpfps.splice(this.state.turnnum,1,code);
        
        this.setState({
            inLobby : this.state.inLobby,
            Game_Key : this.state.Game_Key,
            name : this.state.name,
            pfp : code,
            players : this.state.players,
            pfps : newpfps,
            turnnum : this.state.turnnum
        })
        firebase.firestore().collection("Games").doc("Game " + this.state.Game_Key).update({
            pfps: newpfps
        })
    }

    onBackClick(){
        this.setState(
            {
                inLobby : false,
                Game_Key : this.state.Game_Key,
                name : this.state.name,
                pfp: this.state.pfp,
                players : [],
                pfps: [],
                turnnum: this.state.turnnum
            })
    }

    updatePlayers(){
        this.unsubscribe = firebase.firestore().collection("Games").doc("Game " + this.state.Game_Key).onSnapshot(snapshot => {
            if (snapshot.data()) {
                if (!snapshot.data().players.includes(this.state.name) && snapshot.data().kicked === this.state.name) {
                    window.alert("Kicked");
                    this.setState({
                        inLobby : false,
                        Game_Key : "",
                        name : this.state.name,
                        pfp : this.state.pfp,
                        players: [],
                        pfps: [],
                        ishost: false
                    })
                    return;
                }
                this.setState({
                    inLobby : snapshot.data().inGame ? "In Game" : this.state.inLobby,
                    Game_Key : this.state.Game_Key,
                    name : this.state.name,
                    pfp: this.state.pfp,
                    players: snapshot.data().players,
                    pfps: snapshot.data().pfps,
                    turnnum: this.state.turnnum
                }, () => {
                    this.setState(
                    {
                        inLobby : this.state.inLobby,
                        Game_Key : this.state.Game_Key,
                        name : this.state.name,
                        pfp: this.state.pfp,
                        players : this.state.players,
                        pfps: this.state.pfps,
                        turnnum: this.state.players.indexOf(this.state.name)
                    })
                })
            }
        })
    }

    unsubscribe_listener(){
        this.unsubscribe();
    }

    setInLobby(status, gamekey, playername, playerpfp) {
        this.setState({
            inLobby : status,
            Game_Key : gamekey,
            name : playername,
            pfp: playerpfp,
            players: this.state.players,
            pfps: this.state.pfps,
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
        console.log(Cards)
        this.shuffleArray(Cards);
        console.log(Cards)
        var specialCards = specialdeck.slice();
        this.shuffleArray(specialCards)
        var handsMap = {}
        for (var i = 0; i < this.state.players.length; i++) {
            handsMap["Player " + i.toString()] = Cards.splice(0,7); // CHANGE BACK TO 7 IF NOT ALREADY
            console.log(Cards)
        }
        var startCard = Cards.splice(0,1);
        console.log(Cards)
        while (startCard[0][0] === "!") {
            Cards.push(startCard[0]);
            startCard = Cards.splice(0,1);
        }
        console.log(startCard[0],Cards,specialCards,handsMap)
        firebase.firestore().doc("Games/Game " + this.state.Game_Key).update({
            currentcard: startCard[0],
            turn : 0,
            currentplayer : 0,
            cardInd : -1,
            lastPlayer : -1,
            lastAction : "N/A",
            gameAction : false,
            reversed : false,
            chain : 0,
            chainCard : "",
            Deck: Cards,
            specialdeck: specialCards,
            inGame : true,
            hands : handsMap
        }).then(() => {
            this.setState({
                Game_Key : this.state.Game_Key,
                name : this.state.name,
                pfp: this.state.pfp,
                players: this.state.players,
                pfps: this.state.pfps,
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
                <Lobby func = {this.setPfp} ishost = {!this.state.turnnum} Lobbycode = {this.state.Game_Key} playerlist={this.state.players} pfp ={this.state.pfp} pfps = {this.state.pfps} setInGame = {this.setInGame} name= {this.state.name} pfp = {this.state.pfp} setInLobby = {this.setInLobby}/>
             )}
             {this.state.inLobby === false && (<MenuPage setInLobby = {this.setInLobby}/>)}
             {this.state.inLobby === "In Game" && (<GameCanvas name = {this.state.name} pfp = {this.state.pfp} players = {this.state.players} pfps = {this.state.pfps} turnnumber ={this.state.turnnum} Game_Key={this.state.Game_Key} setInLobby={this.setInLobby}/>) }
             </div>
        )
    }
}
export default GamePage;