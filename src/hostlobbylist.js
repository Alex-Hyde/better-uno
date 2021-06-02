import React from 'react';
import firebase from "./firebase.js";
import "./LobbyStyle.css";
import imgdict from "./imgdict.js"

class PlayerIcon extends React.Component{

    render() {
        return(
            <div style={{display: "flex", paddingBottom: "10px", borderRadius:"50%"}}>
            <img className="pfpstyle" width={75} height={75} src ={this.props.src}/>
            <h1>{this.props.name}</h1>
        </div>
        )
    }
}

class KickButton extends React.Component {
    constructor(props){
        super();
        this.state = {
            style: props.style,
            player: props.kicked,
            Lobbycode: props.Lobbycode
        }
        this.handleKick = this.handleKick.bind(this)
    }

    handleKick() {
        var firestore = firebase.firestore();  
        var docRef = firestore.doc("Games/Game " + this.state.Lobbycode);
        const confirmed = window.confirm("Do you want to kick " + this.state.player + "?");
        if (confirmed) {
            docRef.get()
                .then((docSnapshot) => {
                    if (docSnapshot.data().PlayerAmnt === 1) {
                        firestore.doc("Games/Active Games").update({
                            "Active Games" : firebase.firestore.FieldValue.arrayRemove(this.state.Lobbycode)
                        })
                        firestore.doc("Games/Game " + this.state.Lobbycode).delete();
                    } else {
                        docRef.update({
                            players : firebase.firestore.FieldValue.arrayRemove(this.state.player),
                            PlayerAmnt : firebase.firestore.FieldValue.increment(-1)
                        }) 
                    }
                })
            return;
        }
    }

    render(props) {
        return <button onClick = {this.handleKick} style = {this.state.style}>Kick</button>
    }
}

class HostLobbylist extends React.Component {

    render() {
        if (this.props.players.length > 0){
        var playerstorender = [<div key={this.props.players[0]} style={{display: "flex"}}><PlayerIcon name={this.props.players[0]} src={imgdict[this.props.images[0]]} /></div>].concat(
            this.props.players.slice(1).map( (player,index) => 
                <div key={player} style={{display: "flex"}}>
                <PlayerIcon src={imgdict[this.props.images[index + 1]]} name={player}/><KickButton kicked={player} style={{fontSize: "20px", height: "30px", verticalAlign: "middle", margin:"25px"}} Lobbycode={this.props.Lobbycode}/>
            </div>))

        return(
            <div>
                {playerstorender} 
            </div>   
        ) 
        }
        return(<div></div>)
    }
}

export default HostLobbylist