import React from "react";
import firebase from "./firebase.js";
import Card from "./Card.js"
import Player from "./player.js";
import MasterDeck from "./Deck.js";
import CanvasButton from "./Canvasbutton.js";

var player = new Player();
var backButton = new CanvasButton("BackB",200,450,65,65);
var forwardsButton = new CanvasButton("ForwardsB", 915,450,65,65);

class GameCanvas extends React.Component {

    constructor(props) {
        super();
        this.state = {
            currentcard: "none",
            oncard: false,
            turn: 0,
            currentplayer: 0
        }
        this.options = {
            chaining : true,
            jumpin : true
        }
        this.deck = new Card(144,211,"back");
        this.specialdeck = new Card(144,211,"SpecialDBack");
        this.specialdeck.x = 350;
        this.specialdeck.y = 175;
        this.canvasRef = React.createRef();
        this.players = props.players;
        this.chain = 0;
        this.hands = props.players.map(player => 7);
        this.deck.x = 670;
        this.deck.y = 175;
        this.playernum = props.players.length
        this.reversed = false;
        this.listentodoc = this.listentodoc.bind(this)
        this.updateCanvas = this.updateCanvas.bind(this)
        this.renderhand = this.renderHand.bind(this)
        this.renderDeck = this.renderDeck.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseClick = this.onMouseClick.bind(this)
        this.playCard = this.playCard.bind(this)
        this.cardCanPlay = this.cardCanPlay.bind(this)
        this.shuffleArray = this.shuffleArray.bind(this)
        this.renderOthers = this.renderOthers.bind(this)
        this.forcedPull = this.forcedPull.bind(this)
        this.winner = -1;
    }

listentodoc(){
    this.unsubscribe = firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).onSnapshot(snapshot => {
        if (snapshot.data()) {
            if (snapshot.data().turn > this.state.turn && snapshot.data().gameAction) {
                if (snapshot.data().lastPlayer === player.turnNum) {
                    if (snapshot.data().lastAction == "play") {
                        player.cardsInHand.splice(snapshot.data().cardInd,1);
                    } else if (snapshot.data().lastAction == "pull") {
                        player.loadCards([snapshot.data().Deck[0]]);
                        var newdeck = snapshot.data().Deck
                        newdeck.splice(0,1);
                        if (newdeck.length === 0) {
                            this.shuffleArray(MasterDeck)
                            newdeck = newdeck.concat(MasterDeck)
                        }
                        firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).update({
                            Deck: newdeck,
                            gameAction: false
                        })
                    }
                    var stringHand = player.cardsInHand.map(x => x.strvalue)
                    firebase.firestore().doc("Games/Game " + this.props.Game_Key + "/Players/Player " + (player.turnNum + 1)).update({
                        Hand: stringHand
                    })
                } else if (snapshot.data().currentplayer === player.turnNum && snapshot.data().lastAction == "play") {
                    var newdeck = snapshot.data().Deck
                    console.log("forced???")
                    this.forcedPull(snapshot.data().chain, newdeck)
                }
                if (snapshot.data().lastAction == "play") {
                    this.hands[snapshot.data().lastPlayer] -= 1;
                    this.hands[snapshot.data().currentplayer] += snapshot.data().chain;
                } else if (snapshot.data().lastAction == "pull") {
                    this.hands[snapshot.data().lastPlayer] += 1;
                }
            }
            this.setState({
                currentcard : snapshot.data().currentcard,
                oncard : this.state.oncard,
                turn: snapshot.data().turn,
                currentplayer: snapshot.data().currentplayer
            })
            this.reversed = snapshot.data().reversed
            this.chain = snapshot.data().chain
            for (var i = 0; i < this.hands.length; i++){
                console.log("present")
                console.log(this.hands[i])
                if(this.hands[i] === 0){
                    console.log("Hello i am here")
                    this.winner = i;
                }
            }
        }
    })
}

shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

componentDidMount(){
    this.ctx = this.canvasRef.current.getContext("2d");
    player.turnNum = this.props.turnnumber;
    console.log(player.turnNum)
    var unsub = firebase.firestore().doc("Games/Game " + this.props.Game_Key + "/Players/Player " + (player.turnNum + 1)).onSnapshot(snapshot => {
        if (snapshot.data()){
            player.loadCards(snapshot.data().Hand);
            this.updateCanvas();
            this.listentodoc();
            unsub();
        }
    })
}

cardCanPlay(card){
    if ( (this.state.currentcard === "none")|| (this.state.currentcard[0] === card.strvalue[0]) || (this.state.currentcard[1] === card.strvalue[1])){
        return true;
    }
    return false;
}

onMouseMove(e){
    var rect = this.canvasRef.current.getBoundingClientRect();
    var rerender = false;
      this.x = e.clientX - rect.left
      this.y = e.clientY - rect.top
      for(var i = 0; i <player.cardsInHand.length; i++ ){
        if (player.cardsInHand[i].onCard(this.x,this.y)){
            rerender = true
        }
      }
      if (rerender){
        this.setState({
            currentcard: this.state.currentcard,
            oncard: true,
            turn: this.state.turn,
            currentplayer: this.state.currentplayer
        })
      }
      else if (this.state.oncard && !rerender){
        this.setState({
            currentcard: this.state.currentcard,
            oncard: false,
            turn: this.state.turn,
            currentplayer: this.state.currentplayer
        })    
      }
}

pullCard(){
    firebase.firestore().doc("Games/Game " + this.props.Game_Key).update({
        turn: this.state.turn + 1,
        lastPlayer: player.turnNum,
        lastAction: "pull",
        gameAction: true
    })  
}

forcedPull(n, deck) {
    console.log(deck, n)
    if (n === 0) {
        return
    }
    for (var i = 0; i < n; i++) {
        player.loadCards([deck[0]]);
        deck.splice(0,1);
        if (deck.length === 0) {
            this.shuffleArray(MasterDeck)
            deck = deck.concat(MasterDeck)
        }
    }
    var stringHand = player.cardsInHand.map(x => x.strvalue)
    firebase.firestore().doc("Games/Game " + this.props.Game_Key + "/Players/Player " + (player.turnNum + 1)).update({
        Hand: stringHand
    })
    firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).update({
        Deck: deck,
        gameAction: false
    })
}

playCard(index) {
    if (player.cardsInHand[index].strvalue[1] === "R") {
        firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).update({
            currentcard : player.cardsInHand[index].strvalue,
            turn : this.state.turn + 1,
            currentplayer: (player.turnNum + (this.reversed*2) - 1 + this.playernum) % this.playernum,
            cardInd : index,
            lastPlayer : player.turnNum,
            lastAction: "play",
            gameAction: true,
            reversed : !this.reversed,
            chain : 0
        })
    } else if (player.cardsInHand[index].strvalue[1] === "+") {
        if (this.options.chaining) {
            firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).update({
                currentcard : player.cardsInHand[index].strvalue,
                turn : this.state.turn + 1,
                currentplayer: (player.turnNum - (this.reversed*2) + 1 + this.playernum) % this.playernum,
                cardInd : index,
                lastPlayer : player.turnNum,
                lastAction: "play",
                gameAction: true,
                reversed : !this.reversed,
                chain : this.chain + 2
            })
        } else {
            firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).update({
                currentcard : player.cardsInHand[index].strvalue,
                turn : this.state.turn + 1,
                currentplayer: (player.turnNum - (this.reversed*2) + 1 + this.playernum) % this.playernum,
                cardInd : index,
                lastPlayer : player.turnNum,
                lastAction: "play",
                gameAction: true,
                reversed : !this.reversed,
                chain : 2
            })
        }
    } else if (player.cardsInHand[index].strvalue[1] === "!") {
        if (this.options.chaining) {
            firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).update({
                currentcard : player.cardsInHand[index].strvalue,
                turn : this.state.turn + 1,
                currentplayer: (player.turnNum - (this.reversed*2) + 1 + this.playernum) % this.playernum,
                cardInd : index,
                lastPlayer : player.turnNum,
                lastAction: "play",
                gameAction: true,
                reversed : !this.reversed,
                chain : this.chain + 4
            })
        } else {
            firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).update({
                currentcard : player.cardsInHand[index].strvalue,
                turn : this.state.turn + 1,
                currentplayer: (player.turnNum - (this.reversed*2) + 1 + this.playernum) % this.playernum,
                cardInd : index,
                lastPlayer : player.turnNum,
                lastAction: "play",
                gameAction: true,
                reversed : !this.reversed,
                chain : 4
            })
        }
    } 
    else if (player.cardsInHand[index].strvalue[1] === "S"){
        firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).update({
            currentcard : player.cardsInHand[index].strvalue,
            turn : this.state.turn + 1,
            currentplayer: (player.turnNum - (this.reversed * 4) + 2 + this.playernum) % this.playernum,
            cardInd : index,
            lastPlayer : player.turnNum,
            lastAction: "play",
            gameAction: true,
            chain: 0
        })    
    }
    else {
        firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).update({
            currentcard : player.cardsInHand[index].strvalue,
            turn : this.state.turn + 1,
            currentplayer: (player.turnNum - (this.reversed * 2) + 1 + this.playernum) % this.playernum,
            cardInd : index,
            lastPlayer : player.turnNum,
            lastAction: "play",
            gameAction: true,
            chain: 0
        })
    }
    
}

onMouseClick(e){
    console.log(player.turnNum, this.state.currentplayer)
    var rect = this.canvasRef.current.getBoundingClientRect();
    var ex = e.clientX - rect.left
    var ey = e.clientY - rect.top
    for(var i = 7*player.handindex; i < 7 * (player.handindex + 1); i++){
        if(player.cardsInHand[i]){
            if (player.cardsInHand[i].onCard(ex,ey) && (
            ((player.turnNum === this.state.currentplayer) && (this.cardCanPlay(player.cardsInHand[i]))) ||
            this.state.currentcard === player.cardsInHand[i].strvalue)) { // add "and jump ins enabled" to this conditional later
                this.playCard(i); 
            }
        }
    }   
    if (this.deck.onCard(ex,ey) && (player.turnNum === this.state.currentplayer)){
        this.pullCard();
    }    
    if (forwardsButton.clicked(ex,ey) && forwardsButton.on){
        player.handindex += 1;
        this.setState(this.state)
    }
    if(backButton.clicked(ex,ey) && backButton.on){
        player.handindex -= 1;
        this.setState(this.state)
    }
}

componentDidUpdate(){
    this.updateCanvas();
}

componentWillUnmount(){

}


renderBoard(ctx){
    this.deck.draw(ctx);
    this.specialdeck.draw(ctx);
}

renderHand(ctx){
    var cardsnum = (Math.min(7, player.cardsInHand.length) - 1);
    var currentx = 550 - 81* Math.floor(cardsnum / 2)
    for(var i = 7*player.handindex; i < 7 * (player.handindex + 1); i++ ){
        if(player.cardsInHand[i]){
            player.cardsInHand[i].x = currentx;
            player.cardsInHand[i].y = 450; 
            player.cardsInHand[i].width = 81
            player.cardsInHand[i].height = 126      
            if (player.cardsInHand[i].onCard(this.x,this.y)){
                player.cardsInHand[i].y = 387;
                player.cardsInHand[i].width = 121
                player.cardsInHand[i].height = 189
                player.cardsInHand[i].enlarged = true;
            }
            else{
                player.cardsInHand[i].enlarged = false;
            }
            currentx += player.cardsInHand[i].width
            player.cardsInHand[i].draw(ctx);
        } 
    }
}

renderUI(ctx){
    if(player.handindex > 0){
        backButton.draw(ctx);
        backButton.on = true;
    }
    else{
        backButton.on = false;
    }
    if (((player.handindex + 1) * 7) < (player.cardsInHand.length)){
        forwardsButton.draw(ctx);
        forwardsButton.on = true;
    }
    else{
        forwardsButton.on = false;
    }
}

renderOthers() {
  //  const ctx = this.refs.canvas.getContext("2d");
    for(var i = 0; i < this.playernum; i++ ){
        console.log(this.players[i], this.hands[i])
    } 
}


renderDeck(ctx){
    ctx.drawImage(document.getElementById(this.state.currentcard),500,150,162,256)
}

renderWinner(ctx){
    ctx.font = "50px Comic Sans";
    ctx.fillStyle = "Red"
    ctx.fillText(this.players[this.winner] + " wins!", 50, 50);
}

updateCanvas(){
    this.ctx.clearRect(0,0,1350,595);
    this.renderDeck(this.ctx)
    this.renderBoard(this.ctx)
    this.renderHand(this.ctx)
    this.renderUI(this.ctx)
    if (this.winner !== -1){
        console.log("Here")
        this.renderWinner(this.ctx)
    }
}

render(){
    return (
        <div>
        <canvas ref = {this.canvasRef} onMouseMove={this.onMouseMove} onClick={this.onMouseClick} width={1250} height={595}/>
        </div>
    );
}

}

export default GameCanvas;