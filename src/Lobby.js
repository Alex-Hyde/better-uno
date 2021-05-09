import React from "react";
import Banner from "./Banner";
import Lobbylist from "./lobbylist";
import firebase from "./firebase.js";

class Lobby extends React.Component {

    render(){
        return(
            <div>
                <div style = {{display: "flex", justifyContent: "center"}}>
                <Banner lobby_num = {this.props.Lobbycode} />
                </div>
                <Lobbylist players={this.props.playerlist}/>
            </div>
        )
    }
}

export default Lobby;