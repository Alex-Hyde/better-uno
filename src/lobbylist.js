import React from 'react';
import imgdict from "./imgdict.js"
import MenuButton from "./Buttons.js";
import firebase from "./firebase.js";
import pfp1 from "./images/pfp1.png"
import "./LobbyStyle.css";

class PlayerIcon extends React.Component{

    render() {
        return(                
            <div style={{display: "flex", alignItems : "center", marginLeft :"1%"}}>
                <img className="pfpstyle" width={65} height={65} src ={this.props.src}/>
                <h1>{this.props.name}</h1>
            </div>
        )
    }
}

class Lobbylist extends React.Component {
    
    render(){
            var playerstorender = this.props.players.map((player,index) => 
            <div key={player} style = {{display: "flex", backgroundColor: "#7C40A9", borderRadius: "25px", margin: "5px",}}>
                <PlayerIcon  name={player} src={imgdict[this.props.images[index]]}/>
            </div>)
            var replacement = this.props.players.indexOf(this.props.name)
            playerstorender[replacement] = (<div key = {this.props.name} style = {{alignItems : "center", display: "flex", backgroundColor: "#7C40A9", borderRadius: "25px", margin: "5px"}}>
                <PlayerIcon  name={this.props.name} src={imgdict[this.props.images[this.props.players.indexOf(this.props.name)]]}/>
                <MenuButton 
                        style={{fontSize: "20px", height : "30px", verticalAlign: "middle", marginLeft: "25px"}} 
                        text="Leave"
                        onClick={this.props.leavefunc}
                    />
            </div>)
        return(
            <div>
                {playerstorender}  
            </div>   
        ) 
    }
}

export default Lobbylist