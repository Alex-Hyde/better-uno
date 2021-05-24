import React from "react";
import firebase from "./firebase.js";
import Card from "./Card.js"
import Player from "./player.js";
import MasterDeck from "./Deck.js";
import CanvasButton from "./Canvasbutton.js";

var redButton = new CanvasButton("RedB", 900, 50, 100, 100);
var blueButton = new CanvasButton("BlueB", 1010, 50, 100, 100);
var yellowButton = new CanvasButton("YellowB", 900, 210, 100, 100);
var greenButton = new CanvasButton("GreenB", 1010, 210, 100, 100);

var sRedButton = new CanvasButton("RedB", 900, 50, 100, 100);
var sBlueButton = new CanvasButton("BlueB", 1010, 50, 100, 100);
var sYellowButton = new CanvasButton("YellowB", 900, 210, 100, 100);
var sGreenButton = new CanvasButton("GreenB", 1010, 210, 100, 100);

var returnbutton = new CanvasButton("returnbutton",(window.innerWidth/2)-160,230,155,70);
var leavebutton = new CanvasButton("leavebutton",(window.innerWidth/2)+5,230,155,70);

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
        this.player = new Player();
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
        this.renderSpecial = this.renderSpecial.bind(this)

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
                    if (this.props.turnnumber === 0){
                        console.log("Hi");
                        firebase.firestore().doc("Games/Game " + this.props.Game_Key).update({
                            gameAction: false,
                            inGame: false
                        })    
                    }
                }
            }
            this.player.cardsInHand = []
            this.player.loadCards(this.data.hands[this.playerKey])
            this.data.hands[this.playerKey] = this.player.cardsInHand.map(card => card.strvalue)
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
    this.player.turnNum = this.props.turnnumber;
    var unsub = firebase.firestore().doc("Games/Game " + this.props.Game_Key).onSnapshot(snapshot => {
        if (snapshot.data()){
            this.data = snapshot.data()
            this.player.loadCards(this.data.hands[this.playerKey]);
            this.updateCanvas();
            this.listentodoc();
            unsub();
        }
    })
}

cardCanPlay(card){
    if (this.data.chain > 0) {
        if (card.strvalue === "!D") {
            return true;
        } if (!this.options.chaining) {
            return false;
        } else if (card.strvalue === "!!") {
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
    if (this.winner === -1){
        var rect = this.canvasRef.current.getBoundingClientRect();
        var rerender = false;
        this.x = e.clientX - rect.left
        this.y = e.clientY - rect.top
        for(var i = 0; i < this.player.cardsInHand.length; i++ ){
            if ( this.player.cardsInHand[i].onCard(this.x,this.y)){
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
    else {
        //Insert code here maybe
        return;
    }
}

pullCard() {
    this.data.gameAction = true;
    this.data.turn += 1;
    if (this.data.chain > 0) {
        for (var i = 0; i < this.data.chain; i++) {
            var newCard = this.data.Deck.splice(0,1);
            this.data.hands[this.playerKey] = this.data.hands[this.playerKey].concat(newCard)
            this.player.loadCards(newCard);
            if (this.data.Deck.length === 0) {
                this.shuffleArray(MasterDeck)
                this.data.Deck = MasterDeck.slice()
            }
        }
    } else {
        var newCard = this.data.Deck.splice(0,1);
        this.data.hands[this.playerKey] = this.data.hands[this.playerKey].concat(newCard)
        this.player.loadCards(newCard);
        if (this.data.Deck.length === 0) {
            this.shuffleArray(MasterDeck)
            this.data.Deck = MasterDeck.slice()
        }
    }
    this.data.chain = 0
    this.updateCanvas()
    firebase.firestore().doc("Games/Game " + this.props.Game_Key).update(this.data)
}

playCard(index) {
    this.data.turn += 1;
    this.data.playedCards += 1;
    this.data.currentcard = this.player.cardsInHand[index].strvalue;
    this.player.cardsInHand.splice(index,1);
    this.data.hands[this.playerKey].splice(index,1);
    this.gameAction = true;
    if (this.data.currentcard[0] === "!") { // any wild card
        this.data.currentplayer = this.player.turnNum;
    } else {
        this.data.currentplayer = (this.player.turnNum - (this.data.reversed*2) + 1 + this.playernum) % this.playernum;
    }
    if (this.data.currentcard[1] === "R") { // any reverse card
        this.data.reversed = !this.data.reversed
        this.data.currentplayer = (this.player.turnNum - (this.data.reversed*2) + 1 + this.playernum) % this.playernum
    } else if (this.data.currentcard[1] === "+") { // any +2 card
        if (this.options.chaining) {
            this.data.chain = this.data.chain + 2
            this.data.chainCard = "2"
        } else {
            this.data.chain = 2
        }
    } else if (this.data.currentcard === "!!") { // +4 card
        if (this.options.chaining) {
            this.data.chain += 4
            this.data.chainCard = "4"
        } else {
            this.data.chain = 4
        }
    } else if (this.data.currentcard === "!P") { // paradigm shift special card
        console.log("hands: ", this.data.hands)
        console.log("players: ", this.playernum)
        if (!this.data.reversed) {
            var temp = this.data.hands["Player " + (this.playernum - 1)]
            for (var i = this.playernum - 1; i > 0; i--) {
                this.data.hands["Player " + i] = this.data.hands["Player " + (i - 1)]
            }
            this.data.hands["Player 0"] = temp
        } else {
            var temp = this.data.hands["Player 0"]
            for (var i = 0; i < this.playernum - 1; i++) {
                this.data.hands["Player " + i] = this.data.hands["Player " + (i + 1)]
            }
            this.data.hands["Player " + (this.playernum - 1)] = temp
        }
        console.log("new hands: ", this.data.hands)
        this.player.cardsInHand = [];
        this.player.loadCards(this.data.hands[this.playerKey]);
    } else if (this.data.currentcard[1] === "S") { // any skip card
        this.data.currentplayer = (this.player.turnNum - (this.data.reversed * 4) + 2 + this.playernum) % this.playernum
    }
    this.updateCanvas()
    firebase.firestore().doc("Games/Game " + this.props.Game_Key).update(this.data)
}

leaveLobby() {
    var firestore = firebase.firestore();  
    var docRef = firestore.doc("Games/Game " + this.props.Game_Key);
    docRef.get()
    .then((docSnapshot) => {
            if (docSnapshot.data().PlayerAmnt === 1) {
                firestore.doc("Games/Active Games").update({
                    "Active Games" : firebase.firestore.FieldValue.arrayRemove(this.props.Game_Key)
                })
                firestore.doc("Games/Game " + this.props.Game_Key).delete();
            } else {
                docRef.update({
                    players : firebase.firestore.FieldValue.arrayRemove(this.players[this.props.turnnumber]),
                    PlayerAmnt : firebase.firestore.FieldValue.increment(-1)
                }) 
            }
        this.props.setInLobby(false, "", this.state.name);
        })
    return
}

onMouseClick(e){
    var rect = this.canvasRef.current.getBoundingClientRect();
    var ex = e.clientX - rect.left
    var ey = e.clientY - rect.top
    if (this.winner === -1){
        for(var i = 0; i < this.player.cardsInHand.length; i++){
            if( this.player.cardsInHand[i]){
                if ( this.player.cardsInHand[i].hovered && this.data.currentcard[0] != "!" && (
                ( this.player.turnNum === this.data.currentplayer && this.cardCanPlay( this.player.cardsInHand[i])) ||
                (this.options.jumpin && (this.data.currentcard === this.player.cardsInHand[i].strvalue || 
                    (this.data.currentcard[1] === this.player.cardsInHand[i].strvalue[1] && this.player.cardsInHand[i].strvalue[0] === "!"))) )) {
                    this.playCard(i); 
                }
            }
        }   
        if (this.deck.onCard(ex,ey) && (this.player.turnNum === this.data.currentplayer)){
            this.pullCard();
        }
        if (this.specialdeck.onCard(ex,ey) && (this.player.turnNum === this.data.currentplayer)){

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
                this.data.currentplayer = ( this.player.turnNum - (this.data.reversed*2) + 1 + this.playernum) % this.playernum;
                firebase.firestore().doc("Games/Game " + this.props.Game_Key).update(this.data)
            }
        }
    }
    else {
        if(returnbutton.clicked(ex,ey)){
            this.props.setInLobby(true,this.props.Game_Key,this.players[this.props.turnnumber])
        }
        else if(leavebutton.clicked(ex,ey)){
            this.leaveLobby();
        }     
    }
}

componentDidUpdate(){
    this.updateCanvas();
}

componentWillUnmount(){
    this.unsubscribe();
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

    for (let i = 0; i < this.player.cardsInHand.length; i++) {
        var card = this.player.cardsInHand[i];
        card.x = window.innerWidth/2 + (i- this.player.cardsInHand.length/2)*(Math.min(CARD_WIDTH*sizeMult*0.7, maxWidth/ this.player.cardsInHand.length));
        card.y = window.innerHeight - CARD_HEIGHT*sizeMult - 20;
        card.width = CARD_WIDTH*sizeMult;
        card.height = CARD_HEIGHT*sizeMult;
        card.angle = -(window.innerWidth/2-card.x)/10000;
    }
    var alreadyHovered = false;
    var hoveredIndex = -1;
    for (let i = 0; i < this.player.cardsInHand.length; i++) {
        var card = this.player.cardsInHand[this.player.cardsInHand.length-i-1];
        if (card.onCard(this.x, this.y) && !alreadyHovered) {
            card.hovered = true;
            hoveredIndex = this.player.cardsInHand.length-1-i;
            alreadyHovered = true;
        } else {
            card.hovered = false;
        }
    }
    for (let i = 0; i < this.player.cardsInHand.length; i++) {
        this.player.cardsInHand[i].draw(ctx, (i > hoveredIndex && hoveredIndex != -1) ? 50 : 0);
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

renderWildOptions(ctx) {
    if (this.data.currentcard[0] === "!" && this.data.currentplayer === this.player.turnNum && !this.data.special) {
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

renderSpecial(ctx) {
    if (!this.data.special) return;

    if (this.data.currentcard === "!C") {
        sRedButton.draw(ctx);
        sBlueButton.draw(ctx);
        sYellowButton.draw(ctx);
        sGreenButton.draw(ctx);
        sRedButton.on = true;
        sBlueButton.on = true;
        sGreenButton.on = true;
        sYellowButton.on = true;
    } else {
        sRedButton.on = false;
        sBlueButton.on = false;
        sGreenButton.on = false;
        sYellowButton.on = false;
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
    ctx.drawImage(document.getElementById("winnerbackground"),0,0,window.innerWidth,window.innerHeight);
    //ctx.drawImage(document.getElementById("winnerbanner"),(window.innerWidth - 536)/2,(window.innerHeight - 293)/2,536,293);
    ctx.textAlign="center"
    this.ctx.fillText(this.players[this.winner] + " wins!", (window.innerWidth/2), window.innerHeight/2 -100);
    returnbutton.draw(ctx);
    leavebutton.draw(ctx);
}

updateCanvas(){
    this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    this.renderDeck(this.ctx)
    this.renderBoard(this.ctx)
    this.renderHand(this.ctx)
    this.renderWildOptions(this.ctx)
    this.renderSpecial(this.ctx)
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