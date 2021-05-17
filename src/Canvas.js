import React from "react";
import firebase from "./firebase.js";
import Card from "./Card.js"

function createDeck(inputs){
    var cards = []
    for(var i = 0; i < inputs.length; i++){
        cards.push(new Card(106,184,inputs[i]));
    }
    return cards;
}

class GameCanvas extends React.Component {

    constructor(props){
        super();
        this.state = {
            cards: createDeck(["1","2","3","4","1"]),
            currentcard: "none",
            oncard: false,
            turn: 0,
            currentplayer : 0
        }
        this.turnnumber = props.turnnumber
        this.playernum = props.playernum
        this.reversed = false;
        this.listentodoc = this.listentodoc.bind(this)
        this.updateCanvas = this.updateCanvas.bind(this)
        this.renderhand = this.renderHand.bind(this)
        this.renderDeck = this.renderDeck.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseClick = this.onMouseClick.bind(this)
    }

listentodoc(){
    const db = firebase.firestore
    this.unsubscribe = firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).onSnapshot(snapshot => {
        if (snapshot.data()){
            if (snapshot.data().turn != this.state.turn) {
                console.log(snapshot.data())
                if (snapshot.data().currentplayer === (this.turnnumber + 1) % this.playernum) {
                    this.setState({
                        cards: this.state.cards.slice(0, snapshot.data().cardIndex).concat(this.state.cards.slice(snapshot.data().cardIndex + 1)),
                        currentcard : snapshot.data().currentcard,
                        oncard : this.state.oncard,
                        turn : snapshot.data().turn,
                        currentplayer : snapshot.data().currentplayer
                    })
                } else {
                    this.setState({
                        cards: this.state.cards,
                        currentcard : snapshot.data().currentcard,
                        oncard : this.state.oncard,
                        turn : snapshot.data().turn,
                        currentplayer : snapshot.data().currentplayer
                    })
                }
            }   
        }
    })
}

componentDidMount(){
    this.updateCanvas();
    this.listentodoc()
}

onMouseMove(e){
    var rect = this.refs.canvas.getBoundingClientRect();
    var rerender = false;
      this.x = e.clientX - rect.left
      this.y = e.clientY - rect.top
      for(var i = 0; i < this.state.cards.length; i++ ){
        if (this.state.cards[i].onCard(this.x,this.y)){
            rerender = true
        }
      }
      if (rerender){
        this.setState({
            currentcard: this.state.currentcard,
            oncard: true    
        })
      }
      else if (this.state.oncard && !rerender){
        this.setState({
            currentcard: this.state.currentcard,
            oncard: false
        })    
      }
}

onMouseClick(e){
    var rect = this.refs.canvas.getBoundingClientRect();
    var ex = e.clientX - rect.left
    var ey = e.clientY - rect.top
    for(var i = 0; i < this.state.cards.length; i++ ){
        if (this.state.cards[i].onCard(ex,ey) && (this.turnnumber === this.state.currentplayer)){
            this.state.cards[i].playCard(this.props.Game_Key, this.state.turn, this.turnnumber, this.playernum, i); 
            //cardsInHand.splice(i,1);   
        }
    }    
}

componentDidUpdate(){
    this.updateCanvas();
}

componentWillUnmount(){

}

renderHand(){
    const ctx = this.refs.canvas.getContext("2d"); 
    var currentx = 0;
    for(var i = 0; i < this.state.cards.length; i++ ){
        this.state.cards[i].x = currentx;
        this.state.cards[i].y = 400; 
        this.state.cards[i].width = 106
        this.state.cards[i].height = 184      
        if (this.state.cards[i].onCard(this.x,this.y)){
            this.state.cards[i].y = 350;
            this.state.cards[i].width = 135
            this.state.cards[i].height = 234
            this.state.cards[i].enlarged = true;
        }
        else{
            this.state.cards[i].enlarged = false;
        }
        currentx += this.state.cards[i].width
        this.state.cards[i].draw(ctx);
    } 
}

renderDeck(){
    const ctx = this.refs.canvas.getContext("2d");
    ctx.drawImage(document.getElementById(this.state.currentcard),0,0,211,327)
}

updateCanvas(){
    const ctx = this.refs.canvas.getContext("2d");
    ctx.clearRect(0,0,1350,595);
    this.renderDeck()
    this.renderHand()
}

render(){
    return (
        <canvas onMouseMove={this.onMouseMove} onClick={this.onMouseClick} ref="canvas" width={1250} height={595}/>
    );
}

}

export default GameCanvas;