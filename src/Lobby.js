import React from "react";
import Banner from "./Banner";
import Lobbylist from "./lobbylist";
import HostLobbylist from "./hostlobbylist";
import MenuButton from "./Buttons.js";
import firebase from "./firebase.js";
import "./LobbyStyle.css";
import ImgRow from "./Iconselect.js"

class Lobby extends React.Component {

    constructor(props){
        super();
        this.state = {
            Lobbycode: props.Lobbycode,
            players: props.players,
            pfps: props.pfps,
            name: props.name,
            pfp: props.pfp
        }
        this.ishost = props.ishost;
        this.leaveLobby = this.leaveLobby.bind(this)
    }

    leaveLobby(e) {
        e.preventDefault();
        var firestore = firebase.firestore();  
        var docRef = firestore.doc("Games/Game " + this.state.Lobbycode);
        docRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.data().PlayerAmnt === 1) {
                    firestore.doc("Games/Active Games").update({
                        "Active Games" : firebase.firestore.FieldValue.arrayRemove(this.state.Lobbycode)
                    })
                    firestore.doc("Games/Game " + this.state.Lobbycode).delete();
                } else {
                    docRef.update({
                        players : firebase.firestore.FieldValue.arrayRemove(this.state.name),
                        pfps: firebase.firestore.FieldValue.arrayRemove(this.state.pfp),
                        PlayerAmnt : firebase.firestore.FieldValue.increment(-1)
                    }) 
                }
            this.props.setInLobby(false, "", this.state.name, this.state.pfp);
            })
        return
    }

    componentDidMount() {
        window.onbeforeunload = this.leaveLobby;
    }
      
    componentWillUnmount() {
        //window.removeEventListener("beforeunload", this.props.onBeforeUnload);
    }

    render(props){
        if (!this.props.ishost){
            return(
                <div>
                    <div className = "titleBar" style = {{display: "flex", justifyContent: "center"}}>
                    <Banner lobby_num = {this.props.Lobbycode}/>
                    </div>
                    <div className = "split left">
                    <Lobbylist players={this.props.playerlist}/>  
                    <MenuButton 
                        style={{fontSize: "30px"}} 
                        text="Leave"
                        onClick={this.leaveLobby}
                    />
                    </div>
                    <div className = "split right">
                        <h1>Pick a Profile Picture</h1>
                        <div className = "centered">
                        <ImgRow onClick = {function(){console.log("wow")}} images = {["pfp1.png","../public/Textures/pfp2.png","../public/Textures/pfp3.png"]}/>
                        <ImgRow onClick = {function(){console.log("wow")}} images = {["../public/Textures/pfp4.png","../public/Textures/pfp5.png","../public/Textures/pfp6.png"]}/>
                        <ImgRow onClick = {function(){console.log("wow")}} images = {["../public/Textures/pfp7.png","../public/Textures/pfp8.png","../public/Textures/pfp9.png"]}/>
                        <ImgRow onClick = {function(){console.log("wow")}} images = {["../public/Textures/pfp7.png","../public/Textures/pfp8.png","../public/Textures/pfp9.png"]}/>
                        </div>
                    </div>
                </div>
            ) 
        }
        return(
            <div>
                <div style = {{display: "flex", justifyContent: "center"}}>
                <Banner lobby_num = {this.props.Lobbycode}/>
                </div>
                <HostLobbylist players={this.props.playerlist} Lobbycode = {this.props.Lobbycode}/>
                <div style = {{display: "flex", justifyContent: "center"}}>
                    <MenuButton 
                        style={{fontSize: "30px"}} 
                        text="Start Game"
                        onClick = {this.props.setInGame}
                    />
                    </div>   
                <MenuButton 
                    style={{fontSize: "30px"}} 
                    text="Leave"
                    onClick={this.leaveLobby}
                />
            </div>
        )
    }
}

export default Lobby;