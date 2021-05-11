import React from "react";
import firebase from "./firebase.js";

class GameCanvas extends React.Component {

    constructor(){
        super();
        this.state = {
            currentcard: ""
        }
        this.listentodoc = this.listentodoc.bind(this)
        this.updateCanvas = this.updateCanvas.bind(this)
    }

listentodoc(){
    const db = firebase.firestore
    this.unsubscribe = firebase.firestore().collection("Games").doc("Game " + this.props.Game_Key).onSnapshot(snapshot => {
        if (snapshot.data()){
            this.setState({
                currentcard : snapshot.data().currentcard
            })
        }
    })
}

componentDidMount(){
    this.updateCanvas();
    this.listentodoc()
}

componentDidUpdate(){
    this.updateCanvas();
}

componentWillUnmount(){

}

updateCanvas(){
    console.log("Here")
    const ctx = this.refs.canvas.getContext("2d");
    ctx.clearRect(0,0,1350,595);
    if(this.state.currentcard != ""){
        if (this.state.currentcard === "1"){
            ctx.drawImage(document.getElementById("1card"),0,0,211,327)
        }
        else if(this.state.currentcard === "2")
        ctx.drawImage(document.getElementById("2card"),60,0,211,327)
    }
    
}

render(){
    return (
        <canvas ref="canvas" width={1250} height={595}/>
    );
}

}

export default GameCanvas;