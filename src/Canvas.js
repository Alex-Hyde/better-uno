import React from "react";
import firebase from "./firebase.js";
import Card from "./Card.js"

function createDeck(inputs){
    var cards =[]
    for(var i = 0; i < inputs.length; i++){
        cards.push(new Card(106,184,inputs[i]));
    }
    return cards;
}


 var cardsInHand = createDeck(["1","2","3","4","1"])

class GameCanvas extends React.Component {

    constructor(props){
        super();
        this.state = {
            currentcard: "none",
            oncard: false
        }
        this.turnnumber = props.turnnumber
        this.playernum = props.playernum
        this.currentplayer = 0;
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
            this.setState({
                currentcard : snapshot.data().currentcard,
                oncard : this.state.oncard
            })
            this.currentplayer = (this.currentplayer + 1) % this.playernum;
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
      for(var i = 0; i < cardsInHand.length; i++ ){
        if (cardsInHand[i].onCard(this.x,this.y)){
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
    for(var i = 0; i < cardsInHand.length; i++ ){
        if (cardsInHand[i].onCard(ex,ey) && (this.turnnumber === this.currentplayer)){
            cardsInHand[i].playCard(this.props.Game_Key); 
            cardsInHand.splice(i,1);   
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
    for(var i = 0; i < cardsInHand.length; i++ ){
        cardsInHand[i].x = currentx;
        cardsInHand[i].y = 400; 
        cardsInHand[i].width = 106
            cardsInHand[i].height = 184      
        if (cardsInHand[i].onCard(this.x,this.y)){
            cardsInHand[i].y = 350;
            cardsInHand[i].width = 135
            cardsInHand[i].height = 234
            cardsInHand[i].enlarged = true;
        }
        else{
            cardsInHand[i].enlarged = false;
        }
        currentx += cardsInHand[i].width
        cardsInHand[i].draw(ctx);
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