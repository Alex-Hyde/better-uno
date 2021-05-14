import React from "react";
import Banner from "./Banner";
import Lobbylist from "./lobbylist";
import HostLobbylist from "./hostlobbylist";
import MenuButton from "./Buttons.js";
import firebase from "./firebase.js";

class Lobby extends React.Component {

    constructor(props){
        super();
        this.state = {
            Lobbycode: props.Lobbycode,
            players: props.players,
            name: props.name
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
                        PlayerAmnt : firebase.firestore.FieldValue.increment(-1)
                    }) 
                }
            this.props.setInLobby(false, "", this.state.name);
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
        console.log("Is the host:", this.ishost, this.props.ishost)
        if (!this.props.ishost){
            return(
                <div>
                    <div style = {{display: "flex", justifyContent: "center"}}>
                    <Banner lobby_num = {this.props.Lobbycode}/>
                    </div>
                    <Lobbylist players={this.props.playerlist}/>  
                    <MenuButton 
                        style={{fontSize: "30px"}} 
                        text="Leave"
                        onClick={this.leaveLobby}
                    />
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