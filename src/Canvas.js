import React from "react";
import firebase from "./firebase.js";
import Card from "./Card.js"
import Player from "./player.js";
import MasterDeck from "./Deck.js";
import CanvasButton from "./Canvasbutton.js";

var player = new Player();
var backButton = new CanvasButton("BackB",100,400,129,129);
var forwardsButton = new CanvasButton("ForwardsB", 1100,400,129,129);

class GameCanvas extends React.Component {

    constructor(props) {
        super();
        this.state = {
            oncard: false
        }
        this.options = {
            chaining : true,
            jumpin : true
        }
        this.deck = new Card(150,240,"back");
        this.specialdeck = new Card(150,240,"SpecialDBack");
        this.specialdeck.x = 300;
        this.specialdeck.y = 75;
        this.canvasRef = React.createRef();
        this.playerKey = "Player " + props.turnnumber.toString();
        console.log(this.playerKey)
        this.deck.x = 750;
        this.deck.y = 75;
        this.data = {currentcard: "none"};
        this.playernum = props.players.length;
        this.mustDraw = false;
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
        //this.forcedPull = this.forcedPull.bind(this)
    }

listentodoc(){
    this.unsubscribe = firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).onSnapshot(snapshot => {
        if (snapshot.data()) {
            console.log("YES")
            this.data = snapshot.data()
            this.updateCanvas()
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
    var unsub = firebase.firestore().doc("Games/Game " + this.props.Game_Key).onSnapshot(snapshot => {
        if (snapshot.data()){
            console.log("Key:", this.playerKey)
            console.log(snapshot.data().hands[this.playerKey])
            console.log(this.data.currentcard)
            this.data = snapshot.data()
            player.loadCards(this.data.hands[this.playerKey]);
            this.updateCanvas();
            this.listentodoc();
            unsub();
        }
    })
}

cardCanPlay(card){
    if (this.data.chain > 0) {
        if (card.strvalue === "DF" || card.strvalue === "!!") {
            return true;
        } else if (this.data.chainCard === "2" && card.strvalue[1] === "+") {
            return true;
        } else {
            return false;
        }
    }
    if ( (this.data.currentcard === "none")|| (this.data.currentcard[0] === card.strvalue[0]) || (this.data.currentcard[1] === card.strvalue[1])){
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
            oncard: true
        })
      }
      else if (this.state.oncard && !rerender){
        this.setState({
            oncard: false
        })    
      }
}

pullCard() {
    this.data.gameAction = true;
    this.data.turn += 1;
    if (this.data.chain > 0) {
        for (var i = 0; i < this.data.chain; i++) {
            var newCard = this.data.Deck.splice(0,1);
            this.data.hands[this.playerKey] = this.data.hands[this.playerKey].concat(newCard)
            player.loadCards(newCard);
            if (this.data.Deck.length === 0) {
                this.shuffleArray(MasterDeck)
                this.data.Deck = MasterDeck.slice()
            }
        }
    } else {
        player.loadCards(this.data.Deck.splice(0,1));
        if (this.data.Deck.length === 0) {
            this.shuffleArray(MasterDeck)
            this.data.Deck = MasterDeck.slice()
        }
    }
    this.data.chain = 0
    this.updateCanvas()
    firebase.firestore().doc("Games/Game " + this.props.Game_Key).update(this.data)
}

/*forcedPull(n, deck) {
    console.log(deck, n)
    if (n === 0) {
        return
    }
    
    var stringHand = player.cardsInHand.map(x => x.strvalue)
    firebase.firestore().doc("Games/Game " + this.props.Game_Key + "/Players/Player " + (player.turnNum + 1)).update({
        Hand: stringHand
    })
    firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).update({
        Deck: deck,
        gameAction: false
    })
}*/

playCard(index) {
    this.data.turn += 1;
    this.data.currentcard = player.cardsInHand[index].strvalue;
    this.gameAction = true;
    this.data.currentplayer = (player.turnNum - (this.data.reversed*2) + 1 + this.playernum) % this.playernum;
    if (player.cardsInHand[index].strvalue[1] === "R") {
        this.data.reversed = !this.data.reversed
        this.data.currentplayer = (player.turnNum - (this.data.reversed*2) + 1 + this.playernum) % this.playernum
    } else if (player.cardsInHand[index].strvalue[1] === "+") {
        if (this.options.chaining) {
            this.data.chain = this.data.chain + 2
            this.data.chainCard = "2"
        } else {
            this.data.chain = 2
        }
    } else if (player.cardsInHand[index].strvalue[1] === "!") {
        if (this.options.chaining) {
            this.data.chain += 4
            this.data.chainCard = "4"
        } else {
            this.data.chain = 4
        }
    }
    player.cardsInHand.splice(index,1);
    this.data.hands[this.playerKey].splice(index,1);
    this.updateCanvas()
    firebase.firestore().doc("Games/Game " + this.props.Game_Key).update(this.data)
}

onMouseClick(e){
    var rect = this.canvasRef.current.getBoundingClientRect();
    var ex = e.clientX - rect.left
    var ey = e.clientY - rect.top
    for(var i = 7*player.handindex; i < 7 * (player.handindex + 1); i++){
        if(player.cardsInHand[i]){
            if (player.cardsInHand[i].onCard(ex,ey) && (
            ((player.turnNum === this.data.currentplayer) && (this.cardCanPlay(player.cardsInHand[i]))) ||
            this.data.currentcard === player.cardsInHand[i].strvalue)) { // add "and jump ins enabled" to this conditional later
                this.playCard(i); 
            }
        }
    }   
    if (this.deck.onCard(ex,ey) && (player.turnNum === this.data.currentplayer)){
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
    var currentx = 550 - 106* Math.floor(cardsnum / 2)
    for(var i = 7*player.handindex; i < 7 * (player.handindex + 1); i++ ){
        if(player.cardsInHand[i]){
            player.cardsInHand[i].x = currentx;
            player.cardsInHand[i].y = 400; 
            player.cardsInHand[i].width = 106
            player.cardsInHand[i].height = 184      
            if (player.cardsInHand[i].onCard(this.x,this.y)){
                player.cardsInHand[i].y = 350;
                player.cardsInHand[i].width = 135
                player.cardsInHand[i].height = 234
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
    ctx.drawImage(document.getElementById(this.data.currentcard),500,50,211,327)
}

updateCanvas(){
    this.ctx.clearRect(0,0,1350,595);
    this.renderDeck(this.ctx)
    this.renderBoard(this.ctx)
    this.renderHand(this.ctx)
    this.renderUI(this.ctx)
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