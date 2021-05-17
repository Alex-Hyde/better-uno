import React from 'react';
import MenuButton from "./Buttons.js";
import firebase from "./firebase.js";

class PlayerIcon extends React.Component{

    render() {
        return(
            <div>
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

class PlayerLobbyElem extends React.Component {

    render(props){
        return (
            <div style={{display: "flex"}}>
                <PlayerIcon name={this.props.player}/>    
                <KickButton kicked={this.props.player} 
                style={{fontSize: "20px", height: "30px", verticalAlign: "middle", margin:"25px"}} 
                Lobbycode={this.props.Lobbycode}/>
            </div>
        )
    }
}

class HostLobbylist extends React.Component {

    render() {
        var playerstorender = [<div style={{display: "flex"}}><PlayerIcon key={this.props.players[0]} name={this.props.players[0]}/></div>].concat(
            this.props.players.slice(1).map( (player, index) =>  {<PlayerLobbyElem key = {player} player = {player} Lobbycode={this.props.Lobbycode}/>}))
                

        return(
            <div>
                {playerstorender} 
            </div>   
        ) 
    }
}

export default HostLobbylist; 