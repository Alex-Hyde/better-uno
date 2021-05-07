import React from "react";
import MenuPage from './Menu.js'
import Lobby from "./Lobby.js"

class GamePage extends React.Component {

    constructor(){
        super()
        this.state = {
            inLobby: false,
            Game_Key: "",
            name: ""
        }
        this.setInLobby = this.setInLobby.bind(this)
        this.onBackClick = this.onBackClick.bind(this)
    }

    onBackClick(){
        this.setState(
            {
                inLobby : false,
                Game_Key : this.state.Game_Key,
                name : this.state.name
            })
    }

    setInLobby(status, gamekey, playername) {
        this.setState({
            inLobby : status,
            Game_Key : gamekey,
            name : playername
        });
    }

    render(){
        console.log(this.state.inLobby)
        return (
            <div>
             {this.state.inLobby === true && 
             (
                <Lobby Lobbycode = {this.state.Game_Key} players = {["john","Monica","Steve","Abby"]}/>
             )}
             {this.state.inLobby === false && (<MenuPage setInLobby = {this.setInLobby}/>)}
             </div>
        )
    }
}
export default GamePage;