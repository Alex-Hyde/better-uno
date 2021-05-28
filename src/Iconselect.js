//import { ReactComponent } from '*.svg';
import React from 'react';
import firebase from "./firebase.js";
import "./LobbyStyle.css";
import pfp1 from "./images/pfp1.png"

class ImgButton extends React.Component {

    constructor(props){
        super();
    }

    render(props){
        return (<button style = {{backgroundColor : "rgba(0,0,0,0)", borderColor: "rgba(0,0,0,0)"}}><img src = {pfp1} onClick = {this.props.onClick}/></button>)
    }
}

class ImgRow extends React.Component {

    render(){
        var iconlist = this.props.images.map(image => 
            <div key = {image} >
                <ImgButton onClick = {this.props.onClick} img = {image}/>
            </div>
        )
        return(
            <div style={{display: "flex"}}>
                {iconlist}
            </div>
        )
    }
}

export default ImgRow;