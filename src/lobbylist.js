import React from 'react';
import imgdict from "./imgdict.js"
import MenuButton from "./Buttons.js";
import firebase from "./firebase.js";
import pfp1 from "./images/pfp1.png"
import "./LobbyStyle.css";

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

class Lobbylist extends React.Component {
    
    render(){
            var playerstorender = this.props.players.map((player,index) => 
            <div key={player}>
                <PlayerIcon  name={player} src={imgdict[this.props.images[index]]}/>
            </div>)
        return(
            <div>
                {playerstorender}  
            </div>   
        ) 
    }
}

export default Lobbylist