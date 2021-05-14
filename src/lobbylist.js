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

class Lobbylist extends React.Component {
    
    render(){
            var playerstorender = this.props.players.map(player => 
            <div>
                <PlayerIcon key={player} name={player}/>
            </div>)
        return(
            <div>
                {playerstorender}  
            </div>   
        ) 
    }
}

export default Lobbylist