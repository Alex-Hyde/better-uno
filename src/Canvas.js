import React from "react";
import firebase from "./firebase.js";
import Card from "./Card.js"
import Player from "./player.js";
import MasterDeck from "./Deck.js";
import CanvasButton from "./Canvasbutton.js";

var player = new Player();
var backButton = new CanvasButton("BackB",200,450,65,65);
var forwardsButton = new CanvasButton("ForwardsB", 915,450,65,65);
var redButton = new CanvasButton("RedB", 900, 50, 100, 100);
var blueButton = new CanvasButton("BlueB", 1010, 50, 100, 100);
var yellowButton = new CanvasButton("YellowB", 900, 210, 100, 100);
var greenButton = new CanvasButton("GreenB", 1010, 210, 100, 100);

const CARD_WIDTH = 100;
const CARD_HEIGHT = 160;

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
        this.deck = new Card(144,211,"back");
        this.specialdeck = new Card(144,211,"SpecialDBack");
        this.specialdeck.x = 350;
        this.specialdeck.y = 175;
        this.canvasRef = React.createRef();
        this.playerKey = "Player " + props.turnnumber.toString();
        this.deck.x = 670;
        this.deck.y = 175;
        this.data = {currentcard: "none"};
        this.playernum = props.players.length;
        this.players = props.players;
        this.winner = -1;

        this.listentodoc = this.listentodoc.bind(this)
        this.updateCanvas = this.updateCanvas.bind(this)

        this.renderhand = this.renderHand.bind(this)
        this.renderOthers = this.renderOthers.bind(this)
        this.renderWinner = this.renderWinner.bind(this)
        this.renderWildOptions = this.renderWildOptions.bind(this)
        this.renderDeck = this.renderDeck.bind(this)

        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseClick = this.onMouseClick.bind(this)

        this.playCard = this.playCard.bind(this)
        this.cardCanPlay = this.cardCanPlay.bind(this)
        this.shuffleArray = this.shuffleArray.bind(this)
        //this.forcedPull = this.forcedPull.bind(this)
        
    }

handleResize = () => {
    this.updateCanvas();
    this.setState({ width: window.innerWidth, height: window.innerHeight });
};


listentodoc(){
    this.unsubscribe = firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).onSnapshot(snapshot => {
        if (snapshot.data()) {
            this.data = snapshot.data()
            for (var i = 0; i < this.playernum; i++) {
                if(this.data.hands["Player " + i].length === 0) {
                    this.winner = i;
                }
            }
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
    window.addEventListener("resize", this.handleResize);
    this.ctx = this.canvasRef.current.getContext("2d");
    player.turnNum = this.props.turnnumber;
    var unsub = firebase.firestore().doc("Games/Game " + this.props.Game_Key).onSnapshot(snapshot => {
        if (snapshot.data()){
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
        if (card.strvalue === "!D" || card.strvalue === "!!") {
            return true;
        } else if (this.data.chainCard === "2" && card.strvalue[1] === "+") {
            return true;
        } else {
            return false;
        }
    }
    if ( this.data.currentcard === "none" || this.data.currentcard[0] === card.strvalue[0]
    || this.data.currentcard[1] === card.strvalue[1] || card.strvalue[0] === "!") {
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
    } else if (player.cardsInHand[index].strvalue === "!!") {
        this.data.currentplayer = player.turnNum;
        if (this.options.chaining) {
            this.data.chain += 4
            this.data.chainCard = "4"
        } else {
            this.data.chain = 4
        }
    } else if (player.cardsInHand[index].strvalue[1] === "S") {
        this.data.currentplayer = (player.turnNum - (this.data.reversed * 4) + 2 + this.playernum) % this.playernum
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
    for(var i = 0; i < player.cardsInHand.length; i++){
        if(player.cardsInHand[i]){
            if (player.cardsInHand[i].hovered && this.data.currentcard[0] != "!" && (
            (player.turnNum === this.data.currentplayer && this.cardCanPlay(player.cardsInHand[i])) ||
            (this.options.jumpin && (this.data.currentcard === player.cardsInHand[i].strvalue || 
                (this.data.currentcard[1] === player.cardsInHand[i].strvalue[1] && player.cardsInHand[i].strvalue[0] === "!"))) )) { // add "and jump ins enabled" to this conditional later
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
    if (redButton.on) {
        var pressed = false;
        if (redButton.clicked(ex,ey)) {
            pressed = true;
            this.data.currentcard = "R" + this.data.currentcard[1];
        } else if (blueButton.clicked(ex,ey)) {
            pressed = true;
            this.data.currentcard = "B" + this.data.currentcard[1];
        } else if (greenButton.clicked(ex,ey)) {
            pressed = true;
            this.data.currentcard = "G" + this.data.currentcard[1];
        } else if (yellowButton.clicked(ex,ey)) {
            pressed = true;
            this.data.currentcard = "Y" + this.data.currentcard[1];
        }
        if (pressed) {
            this.data.turn += 1;
            this.data.currentplayer = (player.turnNum - (this.data.reversed*2) + 1 + this.playernum) % this.playernum;
            firebase.firestore().doc("Games/Game " + this.props.Game_Key).update(this.data)
        }
    }
}

componentDidUpdate(){
    this.updateCanvas();
}

componentWillUnmount(){
    window.removeEventListener("resize", this.handleResize);
}


renderBoard(ctx){
    this.deck.draw(ctx);
    this.specialdeck.draw(ctx);
}

renderHand(ctx){
    var maxWidth = 1000;
    var sizeMult = 1;
    if (window.innerWidth > 2000) {
        sizeMult = 2
        maxWidth = 2000;
    } else if (window.innerWidth > 1500) {
        sizeMult = 1.5
        maxWidth = 1500;
    } else if (window.innerWidth > 1000) {
        sizeMult = 1
        maxWidth = 1000;
    } else {
        sizeMult = 0.5
        maxWidth = 500;
    }
    maxWidth -= CARD_WIDTH*sizeMult;

    for (let i = 0; i < player.cardsInHand.length; i++) {
        var card = player.cardsInHand[i];
        card.x = window.innerWidth/2 + (i-player.cardsInHand.length/2)*(Math.min(CARD_WIDTH*sizeMult*0.7, maxWidth/player.cardsInHand.length));
        card.y = window.innerHeight - CARD_HEIGHT*sizeMult - 20;
        card.width = CARD_WIDTH*sizeMult;
        card.height = CARD_HEIGHT*sizeMult;
        card.angle = -(window.innerWidth/2-card.x)/10000;
    }
    var alreadyHovered = false;
    var hoveredIndex = -1;
    for (let i = 0; i < player.cardsInHand.length; i++) {
        var card = player.cardsInHand[player.cardsInHand.length-i-1];
        if (card.onCard(this.x, this.y) && !alreadyHovered) {
            card.hovered = true;
            hoveredIndex = player.cardsInHand.length-1-i;
            alreadyHovered = true;
        } else {
            card.hovered = false;
        }
    }
    for (let i = 0; i < player.cardsInHand.length; i++) {
        player.cardsInHand[i].draw(ctx, (i > hoveredIndex && hoveredIndex != -1) ? 50 : 0);
    }

    /*
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
    */
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

renderWildOptions(ctx) {
    if (this.data.currentcard[0] === "!" && this.data.currentplayer === player.turnNum) {
        redButton.draw(ctx);
        blueButton.draw(ctx);
        yellowButton.draw(ctx);
        greenButton.draw(ctx);
        redButton.on = true;
        blueButton.on = true;
        greenButton.on = true;
        yellowButton.on = true;
    } else {
        redButton.on = false;
        blueButton.on = false;
        greenButton.on = false;
        yellowButton.on = false;
    }
}

renderOthers() {
  //  const ctx = this.refs.canvas.getContext("2d");
    for(var i = 0; i < this.playernum; i++ ){
        console.log(this.players[i], this.hands[i])
    } 
}


renderDeck(ctx){
    ctx.drawImage(document.getElementById(this.data.currentcard),500,150,162,256)
}

renderWinner(ctx){
    ctx.font = "50px Comic Sans";
    ctx.fillStyle = "Red"
    ctx.fillText(this.players[this.winner] + " wins!", 50, 50);
}

updateCanvas(){
    this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    this.renderDeck(this.ctx)
    this.renderBoard(this.ctx)
    this.renderHand(this.ctx)
    this.renderUI(this.ctx)
    this.renderWildOptions(this.ctx)
    if (this.winner !== -1){
        this.renderWinner(this.ctx)
    }
}

render(){
    return (
        <div>
        <canvas ref = {this.canvasRef} onMouseMove={this.onMouseMove} onClick={this.onMouseClick} width={window.innerWidth} height={window.innerHeight}/>
        </div>
    );
}

}

export default GameCanvas;