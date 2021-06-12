import React from 'react';
import firebase from "./firebase.js";
import "./LobbyStyle.css";
import imgdict from "./imgdict.js"
import MenuButton from "./Buttons.js";

class PlayerIcon extends React.Component{

    render() {
        return(
            <div style={{display: "flex", alignItems : "center", marginLeft :"1%"}}>
                <img className="pfpstyle" width={65} height={65} src ={this.props.src}/>
                <p className="Eina" style={{margin: "0px", fontSize: "30px"}}>{this.props.name}</p>
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
        return <button className="reactButton" onClick = {this.handleKick} style = {this.state.style}>Kick</button>
    }
}

class HostLobbylist extends React.Component {

    render() {
        if (this.props.players.length > 0){
        var playerstorender = [<div key={this.props.players[0]} style={{alignItems : "center", display: "flex", backgroundImage: "radial-gradient(ellipse at bottom, #ffbffe55, transparent)", borderRadius: "25px", margin: "5px", width: "400px", padding: "5px", boxShadow: "3px 6px 5px #00000033"}}>
            <PlayerIcon name={this.props.players[0]} src={imgdict[this.props.images[0]]} />
            <MenuButton 
                    style={{fontSize: "20px", height : "50px", width: "100px", verticalAlign: "middle", marginLeft: "25px", marginBottom: "5px", marginLeft: "auto", marginRight: "15px"}} 
                    text="Leave"
                    onClick={this.props.leavefunc}
                />
                </div>].concat(
            this.props.players.slice(1).map( (player,index) => 
                <div key={player} style={{alignItems : "center", display: "flex", backgroundImage: "radial-gradient(ellipse at bottom, #ffbffe55, transparent)", borderRadius: "25px", margin: "5px", width: "400px", padding: "5px", boxShadow: "3px 6px 5px #00000033"}}>
                <PlayerIcon src={imgdict[this.props.images[index + 1]]} name={player}/>
                <KickButton kicked={player} style={{fontSize: "20px", height : "50px", width: "100px", verticalAlign: "middle", marginLeft: "25px", marginBottom: "5px", marginLeft: "auto", marginRight: "15px"}} Lobbycode={this.props.Lobbycode}/>
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