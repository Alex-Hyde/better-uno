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
                <p className="Eina" style={{margin: "0px", fontSize: "30px"}}>{this.props.name}</p>
            </div>
        )
    }
}

class Lobbylist extends React.Component {
    
    render(){
            var playerstorender = this.props.players.map((player,index) => 
            <div key={player} style = {{display: "flex", backgroundImage: "radial-gradient(ellipse at bottom, #ffbffe55, transparent)", borderRadius: "25px", margin: "5px", padding: "5px", boxShadow: "3px 6px 5px #00000033"}}>
                <PlayerIcon  name={player} src={imgdict[this.props.images[index]]}/>
            </div>)
            var replacement = this.props.players.indexOf(this.props.name)
            playerstorender[replacement] = (<div key = {this.props.name} style = {{alignItems : "center", display: "flex", backgroundImage: "radial-gradient(ellipse at bottom, #ffbffe55, transparent)", borderRadius: "25px", margin: "5px", width: "400px", padding: "5px", boxShadow: "3px 6px 5px #00000033"}}>
                <PlayerIcon  name={this.props.name} src={imgdict[this.props.images[this.props.players.indexOf(this.props.name)]]}/>
                <MenuButton 
                        style={{fontSize: "20px", height : "50px", width: "100px", verticalAlign: "middle", marginLeft: "25px", marginBottom: "5px", marginLeft: "auto", marginRight: "15px"}} 
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