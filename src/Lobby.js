import React from "react";
import Banner from "./Banner";
import Lobbylist from "./lobbylist";

class Lobby extends React.Component {

    constructor(props){
        console.log(props.Lobbycode);
        super();
        this.state = {
            Lobbycode: props.Lobbycode,
            players: props.players
        }

    }

    render(){
        return(
            <div>
                <div style = {{display: "flex", justifyContent: "center"}}>
                <Banner lobby_num = {this.state.Lobbycode} />
                </div>
                <Lobbylist players={this.state.players}/>
            </div>
        )
    }
}

export default Lobby;