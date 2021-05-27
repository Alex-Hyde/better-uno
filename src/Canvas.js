import React from "react";
import firebase from "./firebase.js";
import Card from "./Card.js"
import Player from "./player.js";
import MasterDeck from "./Deck.js";
import specialdeck from "./SpecialDeck.js";

import { CanvasButton, CanvasButtonCircle } from "./Canvasbutton.js";

const godRandom = false; // whether hand of got discards random cards or you get to choose (I'm not sure)

var redButton = new CanvasButtonCircle(window.innerWidth/2 + 2, window.innerHeight/2 + 2, 100, 1, "red");
var blueButton = new CanvasButtonCircle(window.innerWidth/2 - 2, window.innerHeight/2 + 2, 100, 2, "blue");
var yellowButton = new CanvasButtonCircle(window.innerWidth/2 - 2, window.innerHeight/2 - 2, 100, 3, "yellow");
var greenButton = new CanvasButtonCircle(window.innerWidth/2 + 2, window.innerHeight/2 - 2, 100, 4, "green");

var sRedButton = new CanvasButton("RedB", 900, 50, 100, 100);
var sBlueButton = new CanvasButton("BlueB", 1010, 50, 100, 100);
var sYellowButton = new CanvasButton("YellowB", 900, 210, 100, 100);
var sGreenButton = new CanvasButton("GreenB", 1010, 210, 100, 100);

var returnbutton = new CanvasButton("returnbutton",(window.innerWidth/2)-160,230,155,70);
var leavebutton = new CanvasButton("leavebutton",(window.innerWidth/2)+5,230,155,70);
var skipbutton = new CanvasButton("SkipButton",(window.innerWidth/8) * 7, (window.innerHeight/8) * 7,155,70);

const CARD_WIDTH = 100;
const CARD_HEIGHT = 151;
const PLACED_CARDS_DECK_SIZE = 10;
const NUM_BACKGROUNDS = 3;


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
        this.Guessdeck = new Card(162,256,"back");
        this.Guessdeck.x = (window.innerWidth/2) - 81;
        this.Guessdeck.y = 150;
        this.specialdeck = new Card(144,211,"SpecialDBack");
        this.specialdeck.x = 350;
        this.player = new Player();
        this.specialdeck.y = 175;
        this.canvasRef = React.createRef()
        this.hasdrawnplayablecard = false;
        this.hasguessed = false
        this.player = new Player();
        this.canvasRef = React.createRef();
        this.playerKey = "Player " + props.turnnumber.toString();
        this.data = {currentcard:"none"};
        this.playernum = props.players.length;
        this.players = props.players;
        this.winner = -1;
        this.sparehand = [];
        //this.guessing = false;
        this.sparecard = null;
        this.placedCards = [];
        this.playedCardsBefore = -1;
        this.background = "gameBG_" + (Math.floor(Math.random() * NUM_BACKGROUNDS) + 1).toString(10);

        this.listentodoc = this.listentodoc.bind(this)
        this.updateCanvas = this.updateCanvas.bind(this)

        this.renderhand = this.renderHand.bind(this)
        this.renderOthers = this.renderOthers.bind(this)
        this.renderWinner = this.renderWinner.bind(this)
        this.renderWildOptions = this.renderWildOptions.bind(this)
        this.renderSpecial = this.renderSpecial.bind(this)

        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseClick = this.onMouseClick.bind(this)

        this.playCard = this.playCard.bind(this)
        this.discard = this.discard.bind(this)
        this.cardCanPlay = this.cardCanPlay.bind(this)
        this.shuffleArray = this.shuffleArray.bind(this)
        this.checkguess = this.checkguess.bind(this)
        this.renderCorrect = this.renderCorrect.bind(this)
        this.resetGuess = this.resetGuess.bind(this)
        this.resetwrongGuess = this.resetwrongGuess.bind(this)
        //this.forcedPull = this.forcedPull.bind(this)

        this.maxWidth = 1000;
        this.sizeMult = 1;
        if (window.innerWidth > 2000) {
            this.sizeMult = 2
            this.maxWidth = 2000;
        } else if (window.innerWidth > 1500) {
            this.sizeMult = 1.5
            this.maxWidth = 1500;
        } else if (window.innerWidth > 1000) {
            this.sizeMult = 1
            this.maxWidth = 1000;
        } else {
            this.sizeMult = 0.5
            this.maxWidth = 500;
        }
        
        this.maxWidth -= CARD_WIDTH*this.sizeMult;

        redButton.x = window.innerWidth/2 + 2;
        redButton.y = window.innerHeight/2 + 2;
        redButton.radius = 70 * this.sizeMult;
        blueButton.x = window.innerWidth/2 - 3;
        blueButton.y = window.innerHeight/2 + 2;
        blueButton.radius = 70 * this.sizeMult;
        greenButton.x = window.innerWidth/2 + 2;
        greenButton.y = window.innerHeight/2 - 2;
        greenButton.radius = 70 * this.sizeMult;
        yellowButton.x = window.innerWidth/2 - 2;
        yellowButton.y = window.innerHeight/2 - 2;
        yellowButton.radius = 70 * this.sizeMult;

        this.deck = new Card(CARD_WIDTH*this.sizeMult, CARD_HEIGHT*this.sizeMult,"back");
        this.specialdeck = new Card(CARD_WIDTH*this.sizeMult, CARD_HEIGHT*this.sizeMult,"SpecialDBack");
    }

    handleResize = () => {
        this.maxWidth = 1000;
        this.sizeMult = 1;
        if (window.innerWidth > 2000) {
            this.sizeMult = 2
            this.maxWidth = 2000;
        } else if (window.innerWidth > 1500) {
            this.sizeMult = 1.5
            this.maxWidth = 1500;
        } else if (window.innerWidth > 1000) {
            this.sizeMult = 1
            this.maxWidth = 1000;
        } else {
            this.sizeMult = 0.75
            this.maxWidth = 500;
        }
        
        this.maxWidth -= CARD_WIDTH*this.sizeMult;

        this.setState({ width: window.innerWidth * 2, height: window.innerHeight * 2 });

        this.deck.width = CARD_WIDTH*this.sizeMult;
        this.deck.height = CARD_HEIGHT*this.sizeMult;
        
        this.specialdeck.width = CARD_WIDTH*this.sizeMult;
        this.specialdeck.height = CARD_HEIGHT*this.sizeMult;
    
        redButton.x = window.innerWidth/2 + 2;
        redButton.y = window.innerHeight/2 + 2;
        redButton.radius = 70 * this.sizeMult;
        blueButton.x = window.innerWidth/2 - 3;
        blueButton.y = window.innerHeight/2 + 2;
        blueButton.radius = 70 * this.sizeMult;
        greenButton.x = window.innerWidth/2 + 2;
        greenButton.y = window.innerHeight/2 - 2;
        greenButton.radius = 70 * this.sizeMult;
        yellowButton.x = window.innerWidth/2 - 2;
        yellowButton.y = window.innerHeight/2 - 2;
        yellowButton.radius = 70 * this.sizeMult;
    
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };


listentodoc(){
    this.unsubscribe = firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).onSnapshot(snapshot => {
        if (snapshot.data()) {
            this.data = snapshot.data()
           // console.log(this.playernum)
            for (var i = 0; i < this.playernum; i++) {
            //    console.log(this.data.hands)
                if(this.data.hands["Player " + i].length === 0) {
                    this.winner = i;
                    if (this.props.turnnumber === 0){
                 //       console.log("Hi");
                        firebase.firestore().doc("Games/Game " + this.props.Game_Key).update({
                            gameAction: false,
                            inGame: false
                        })    
                    }
                }
            }
            if (this.data.currentcard != "none" && this.data.playedCards != this.playedCardsBefore) {
                this.playedCardsBefore = this.data.playedCards;
                this.placedCards.push([this.data.currentcard, Math.random()*Math.PI-Math.PI/2]);
                if (this.placedCards.length > PLACED_CARDS_DECK_SIZE) {
                    this.placedCards.shift();
                }
            }
            if (this.data.currentcard != "none" && this.placedCards[this.placedCards.length-1][0][0] == "!") {
                this.playedCardsBefore = this.data.playedCards;
                this.placedCards[this.placedCards.length-1][0] = this.data.currentcard;
            }
            this.player.cardsInHand = []
            if (this.data.currentplayer != this.player.turnNum || !this.data.guessing) {
                this.player.loadCards(this.data.hands[this.playerKey])
                this.data.hands[this.playerKey] = this.player.cardsInHand.map(card => card.strvalue)
            } else {
                this.player.loadCards(this.data.guessHand)
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
    //var rect = this.canvasRef.current.getBoundingClientRect()
    //this.canvasRef.current.width = rect.width * devicePixelRatio;
   // this.canvasRef.current.height = rect.height * devicePixelRatio;
   // this.ctx.scale(devicePixelRatio, devicePixelRatio)
   // this.canvasRef.current.width = rect.width + "px"
   // this.canvasRef.current.height = rect.height + "px"
    this.player.turnNum = this.props.turnnumber;
    var unsub = firebase.firestore().doc("Games/Game " + this.props.Game_Key).onSnapshot(snapshot => {
        if (snapshot.data()){
            this.data = snapshot.data()
            this.player.loadCards(this.data.hands[this.playerKey]);
            //this.placedCards = [[this.data.currentcard, Math.random()*Math.PI-Math.PI/2]]
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
        } else if (card.strvalue === "!!" && this.data.chainCard === "4") {
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
        var rect = this.canvasRef.current.getBoundingClientRect();
        var ex = e.clientX - rect.left;
        var ey = e.clientY - rect.top;

        if (redButton.on) {
            var render = redButton.hovered || blueButton.hovered || greenButton.hovered || yellowButton.hovered;
            redButton.hovered = false;
            blueButton.hovered = false;
            greenButton.hovered = false;
            yellowButton.hovered = false;
            
            if (redButton.clicked(ex,ey)) {
                redButton.hovered = true;
            } else if (blueButton.clicked(ex,ey)) {
                blueButton.hovered = true;
            } else if (greenButton.clicked(ex,ey)) {
                greenButton.hovered = true;
            } else if (yellowButton.clicked(ex,ey)) {
                yellowButton.hovered = true;
            } else {
                if (render) {
                    this.updateCanvas();
                }
                return;
            }
            this.updateCanvas();
        }
    }
}

pullSpecialCard(){
    //this.data.breakaway = false;
    this.data.gameAction = true;
    this.data.turn += 1;
    this.data.guessing = true;
    var newCard = this.data.specialdeck.splice(0,1);
    this.data.hands[this.playerKey] = this.data.hands[this.playerKey].concat(newCard)
    this.player.loadCards(newCard);
    if (this.data.specialdeck.length === 0) {
        this.shuffleArray(specialdeck)
        this.data.specialdeck = specialdeck.slice()
    }
    this.data.guessing = false;
    this.updateCanvas()
    firebase.firestore().doc("Games/Game " + this.props.Game_Key).update(this.data)
}

pullCard() {
    //this.data.breakaway = false;
    this.data.gameAction = true;
    this.data.turn += 1;
    if (this.data.chain > 0) {
        for (var i = 0; i < this.data.chain; i++) {
            var newCard = this.data.Deck.splice(0,1);
            var testCard = new Card(0,0,newCard[0]);
            this.data.hands[this.playerKey] = this.data.hands[this.playerKey].concat(newCard)
            this.player.loadCards(newCard);
            if (this.data.Deck.length === 5) {
                this.shuffleArray(MasterDeck)
                this.data.Deck = this.data.Deck.concat(MasterDeck.slice())
            }
            console.log(testCard.strvalue,this.cardCanPlay(testCard),this.data.currentcard)
            if (this.cardCanPlay(testCard)){
                this.hasdrawnplayablecard = true;
            }
        }
    } else {
        var newCard = this.data.Deck.splice(0,1);
        var testCard = new Card(0,0,newCard[0]);
        this.data.hands[this.playerKey] = this.data.hands[this.playerKey].concat(newCard)
        this.player.loadCards(newCard);
        if (this.data.Deck.length === 5) {
            this.shuffleArray(MasterDeck)
            this.data.Deck = this.data.Deck.concat(MasterDeck.slice())
        }
        console.log(testCard.strvalue,this.cardCanPlay(testCard),this.data.currentcard)
        if (this.cardCanPlay(testCard)){
            this.hasdrawnplayablecard = true;
        }
    }
    this.data.chain = 0
    this.data.guessing = false;
    this.updateCanvas()
    firebase.firestore().doc("Games/Game " + this.props.Game_Key).update(this.data)
}

guess() {
    this.data.gameAction = true;
    this.data.turn += 1;
    //this.guessing = true;
    this.data.guessing = true;
    var guesshand = [];
    var potentialcards = ["W1","W2","W3","W4","W5","W6","W7","W8","W9","W+","!D","!!","WS","WR"];
    guesshand[0] = "W" + this.data.Deck[0][1];
    potentialcards.splice(potentialcards.indexOf(guesshand[0]),1);
    // console.log(guesshand)
   // console.log(potentialcards)
    for(var i = 1; i < 4; i++){
        var ri = Math.floor(Math.random() * potentialcards.length)
        guesshand[i] = potentialcards[ri]
        potentialcards.splice(ri,1);
    }
   // console.log(guesshand)
    this.sparehand = this.player.cardsInHand 
    this.player.cardsInHand = [];
    this.player.loadCards(guesshand);
    this.data.guessHand = guesshand;
    firebase.firestore().doc("Games/Game " + this.props.Game_Key).update(this.data);
    this.updateCanvas();
    }

playCard(index) {
    this.data.turn += 1;
    this.data.playedCards += 1;
    var prevCard = this.data.currentcard;
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
        this.player.cardsInHand = [];
        this.player.loadCards(this.data.hands[this.playerKey]);
    } else if (this.data.currentcard === "!B") { // bodyguard card
        var prevPlayer = "Player " + ((this.player.turnNum - 1 + this.playernum) % this.playernum)
        var nextPlayer = "Player " + ((this.player.turnNum + 1) % this.playernum)
        this.data.hands[prevPlayer] = this.data.hands[prevPlayer].filter(card => (card[1] !== "+" && card !== "!!"))
        this.data.hands[nextPlayer] = this.data.hands[nextPlayer].filter(card => (card[1] !== "+" && card !== "!!"))
    } else if (this.data.currentcard === "!G") { // gravedigger card
        this.data.currentcard = prevCard;
        this.data.hands[this.playerKey].push(prevCard)
        this.player.loadCards([prevCard])
        this.data.playedCards -= 1;
    } else if (this.data.currentcard === "!H") { // hand of god card
        var discards = Math.floor(this.data.hands[this.playerKey].length / 2)
        if (godRandom) {
            for (var i = 0; i < discards; i++) {
                var len = this.data.hands[this.playerKey].length
                this.data.hands[this.playerKey].splice(Math.floor(Math.random() * len), 1)
            }
        } else {
            this.data.discards = discards
        }
    } else if (this.data.currentcard[1] === "S") { // any skip card
        this.data.currentplayer = (this.player.turnNum - (this.data.reversed * 4) + 2 + this.playernum) % this.playernum
    }
    this.updateCanvas()
    firebase.firestore().doc("Games/Game " + this.props.Game_Key).update(this.data)
}

discard(index) {
    this.data.turn += 1;
    this.data.discards -= 1;
    this.player.cardsInHand.splice(index,1);
    this.data.hands[this.playerKey].splice(index,1);
    this.gameAction = true;
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

resetGuess(){
    if (this.data.guessing === "correct"){
        this.player.cardsInHand = this.sparehand;
        this.pullSpecialCard();
        this.updateCanvas()
    }
}

resetwrongGuess(){
    if (this.data.guessing === "incorrect"){
        this.player.cardsInHand = this.sparehand;
        this.data.chain = 3;
        this.pullCard();
        this.updateCanvas()
    }
}

checkguess(card){
    this.sparecard = this.data.Deck.splice(0,1)[0];
    this.sparecard = new Card(162,256,this.sparecard);
    this.sparecard.x = (window.innerWidth/2) - 81;
    this.sparecard.y = 150;
    if(card.strvalue[1] === this.sparecard.strvalue[1]){
        this.data.guessing = "correct";
        this.updateCanvas()
        setTimeout(this.resetGuess, 2000)
        
    }
    else {
        this.data.guessing = "incorrect";
        this.updateCanvas()
        setTimeout(this.resetwrongGuess, 2000)
    }
}

onMouseClick(e){
    if (this.data.guessing === "correct" && this.data.currentplayer === this.player.turnNum){
        this.resetGuess();
    }
    if (this.data.guessing === "incorrect" && this.data.currentplayer === this.player.turnNum){
        this.resetwrongGuess();
    }
    var rect = this.canvasRef.current.getBoundingClientRect();
    var ex = e.clientX - rect.left
    var ey = e.clientY - rect.top 
    if (this.winner !== -1){
        if(returnbutton.clicked(ex,ey)){
            this.props.setInLobby(true,this.props.Game_Key,this.players[this.props.turnnumber])
        }
        else if(leavebutton.clicked(ex,ey)){
            this.leaveLobby();
        }     
    } else if (this.data.discards > 0) {
        if (this.data.currentplayer === this.player.turnNum) {
            for(var i = 0; i < this.player.cardsInHand.length; i++) {
                if (this.player.cardsInHand[i]) {
                    if (this.player.cardsInHand[i].hovered) {
                        this.discard(i); 
                    }
                }
            }   
        }
    } else if (this.data.guessing) {
        if (this.data.currentplayer === this.player.turnNum){
            for(var i = 0; i < this.player.cardsInHand.length; i++){
                if(this.player.cardsInHand[i].hovered){
                    this.checkguess(this.player.cardsInHand[i])
                }
            }    
        }
    } else {
        for(var i = 0; i < this.player.cardsInHand.length; i++) {
            if (this.player.cardsInHand[i]) {
                if (this.player.cardsInHand[i].hovered && this.data.currentcard[0] != "!" && (
                ( this.player.turnNum === this.data.currentplayer && this.cardCanPlay(this.player.cardsInHand[i])) ||
                (this.options.jumpin && (this.data.currentcard === this.player.cardsInHand[i].strvalue || 
                    (this.data.currentcard[1] === this.player.cardsInHand[i].strvalue[1] && this.player.cardsInHand[i].strvalue[0] === "!"))) )) {
                    this.playCard(i); 
                }
            }
        }
        if (skipbutton.clicked(ex,ey) && this.hasdrawnplayablecard){
            this.data.currentplayer = (this.player.turnNum - (this.data.reversed*2) + 1 + this.playernum) % this.playernum
            this.data.turn += 1;
            this.hasguessed = false;
            this.hasdrawnplayablecard = false
            firebase.firestore().doc("Games/Game " + this.props.Game_Key).update(this.data)

        }   
        if (this.deck.onCard(ex,ey) && (this.player.turnNum === this.data.currentplayer) && (this.hasdrawnplayablecard === false)){
            this.pullCard();
        }
        if (this.specialdeck.onCard(ex,ey) && (this.player.turnNum === this.data.currentplayer) && this.data.chain === 0&& (this.hasguessed === false)){
            this.guess()
            this.hasguessed = true;
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
}

componentDidUpdate(){
    this.updateCanvas();
}

componentWillUnmount(){
    //this.unsubscribe();
    window.removeEventListener("resize", this.handleResize);
}


renderBoard(ctx){
    this.placedCards.forEach(card => {
        //shadow
        let shadowx = 2 * this.sizeMult;
        let shadowy = 3 * this.sizeMult;
        ctx.save();
        ctx.translate(window.innerWidth/2 + shadowx, window.innerHeight/2 + shadowy);
        ctx.rotate(card[1]);
        ctx.translate(-window.innerWidth/2 - shadowx, -window.innerHeight/2 - shadowy);
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "black";
        ctx.fillRect(window.innerWidth/2-CARD_WIDTH*this.sizeMult/2 + shadowx,window.innerHeight/2-CARD_HEIGHT*this.sizeMult/2 + shadowy,CARD_WIDTH*this.sizeMult, CARD_HEIGHT*this.sizeMult);
        ctx.restore();

        ctx.save();
        ctx.translate(window.innerWidth/2, window.innerHeight/2);
        ctx.rotate(card[1]);
        ctx.translate(-window.innerWidth/2, -window.innerHeight/2);
        ctx.drawImage(document.getElementById(card[0]),window.innerWidth/2-CARD_WIDTH*this.sizeMult/2,window.innerHeight/2-CARD_HEIGHT*this.sizeMult/2,CARD_WIDTH*this.sizeMult, CARD_HEIGHT*this.sizeMult);
        ctx.restore(); 
    });

    this.deck.x = window.innerWidth/2 + CARD_WIDTH*this.sizeMult*1.5 + 18*this.sizeMult;
    this.deck.y = window.innerHeight/2 - CARD_HEIGHT*this.sizeMult/2 + 12*this.sizeMult;
    for (let i = 0; i < 5; i++) {
        this.deck.x -= 3*this.sizeMult;
        this.deck.y -= 2*this.sizeMult; 
        this.deck.draw(ctx);    
    }
    this.specialdeck.x = window.innerWidth/2 - CARD_WIDTH*this.sizeMult*2.5 + 18*this.sizeMult;
    this.specialdeck.y = window.innerHeight/2 - CARD_HEIGHT*this.sizeMult/2 + 12*this.sizeMult;
    for (let i = 0; i < 5; i++) {
        this.specialdeck.x -= 3*this.sizeMult;
        this.specialdeck.y -= 2*this.sizeMult; 
        this.specialdeck.draw(ctx);    
    }
}

renderHand(ctx){
   // console.log(this.player.cardsInHand)
    for (let i = 0; i < this.player.cardsInHand.length; i++) {
        var card = this.player.cardsInHand[i];
        card.x = window.innerWidth/2 + (i-this.player.cardsInHand.length/2)*(Math.min(CARD_WIDTH*this.sizeMult*0.7, this.maxWidth/this.player.cardsInHand.length)) - CARD_WIDTH*this.sizeMult/2;
        card.y = window.innerHeight - CARD_HEIGHT*this.sizeMult - 20;
        card.width = CARD_WIDTH*this.sizeMult;
        card.height = CARD_HEIGHT*this.sizeMult;
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
        this.player.cardsInHand[i].draw(ctx, (i > hoveredIndex && hoveredIndex != -1) ? Math.max(0, CARD_WIDTH*this.sizeMult*0.7 - this.maxWidth/this.player.cardsInHand.length) : 0);
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
    if (this.data.currentcard[0] === "!" && this.data.currentplayer === this.player.turnNum && !this.data.special && this.data.discards === 0) {
        var grdSize = 160;
        var grd = ctx.createRadialGradient(window.innerWidth/2, window.innerHeight/2, 100, window.innerWidth/2, window.innerHeight/2, grdSize);
        grd.addColorStop(0, "#000000");
        grd.addColorStop(1, "#00000000");

        ctx.fillStyle = grd;
        ctx.fillRect(window.innerWidth/2 - grdSize/2*this.sizeMult, window.innerHeight/2 - grdSize/2*this.sizeMult, grdSize*this.sizeMult, grdSize*this.sizeMult);
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
       // console.log(this.players[i], this.hands[i])
    } 
}

renderIncorrect(ctx){
    ctx.font = "50px Comic Sans";
    ctx.textAlign="center"
    ctx.fillStyle = "Red"
    this.ctx.fillText("Sucks to suck!", (window.innerWidth/2), 100);
    ctx.font = "30px Comic Sans";
    this.ctx.fillText("Draw 3 Cards", (window.innerWidth/2), 140);
    this.sparecard.draw(ctx)
}

renderCorrect(ctx){
    ctx.font = "50px Comic Sans";
    ctx.textAlign="center"
    ctx.fillStyle = "Green"
    this.ctx.fillText("Correct!", (window.innerWidth/2), 100);
    this.sparecard.draw(ctx)
}

renderGuess(ctx){
    ctx.font = "50px Comic Sans";
    ctx.textAlign="center"
    this.ctx.fillText("Guess the type of card at the top of the deck", (window.innerWidth/2), 100);
    this.Guessdeck.draw(ctx)
}

renderWinner(ctx){
    ctx.font = "50px Comic Sans";
    ctx.fillStyle = "Red"
    ctx.drawImage(document.getElementById("winnerbackground"),0,0,window.innerWidth,window.innerHeight);
    ctx.textAlign="center"
    this.ctx.fillText(this.players[this.winner] + " wins!", (window.innerWidth/2), window.innerHeight/2 -100);
    returnbutton.draw(ctx);
    leavebutton.draw(ctx);
}

updateCanvas(){
    this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    this.ctx.drawImage(document.getElementById(this.background), 0, 0, window.innerWidth, window.innerHeight);
    if (this.data.guessing === false || this.data.currentplayer != this.player.turnNum){
        this.renderBoard(this.ctx)
        this.renderHand(this.ctx)
        this.renderWildOptions(this.ctx)
        this.renderSpecial(this.ctx)
        if (this.winner !== -1){
            this.renderWinner(this.ctx)
        }
        if (this.hasdrawnplayablecard){
            skipbutton.draw(this.ctx);
        }
    }
    else if (this.data.guessing === true && this.data.currentplayer === this.player.turnNum){
        this.renderHand(this.ctx) 
        this.renderGuess(this.ctx)   
    }
    else if (this.data.guessing === "correct" && this.data.currentplayer === this.player.turnNum){
        //this.renderHand(this.ctx);
        this.renderCorrect(this.ctx);    
    }
    else if (this.data.guessing === "incorrect" && this.data.currentplayer === this.player.turnNum){
        this.renderIncorrect(this.ctx);
    }
}

render(){
    return (
        <div>
        <canvas ref = {this.canvasRef} onMouseMove={this.onMouseMove} onClick={this.onMouseClick} width = {window.innerWidth} height = {window.innerHeight}/>
        </div>
    );
}

}

export default GameCanvas;