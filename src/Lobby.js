import React from "react";
import Banner from "./Banner";
import Lobbylist from "./lobbylist";
import firebase from "./firebase.js";
import MenuButton from "./Buttons";

class Lobby extends React.Component {

    render(){
        console.log(this.props.playerlist)
        return(
            <div>
                <div style = {{display: "flex", justifyContent: "center"}}>
                <Banner lobby_num = {this.props.Lobbycode} />
                </div>
                <Lobbylist players={this.props.playerlist}/>
                <div style = {{display: "flex", justifyContent: "center"}}>
                    <MenuButton 
                        style={{fontSize: "30px"}} 
                        text="Start Game"
                        onClick = {this.props.setInGame}
                    />
                    </div>
            </div>
        )
    }
}

export default Lobby;