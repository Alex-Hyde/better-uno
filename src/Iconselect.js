//import { ReactComponent } from '*.svg';
import React from 'react';
import firebase from "./firebase.js";
import "./LobbyStyle.css";

class ImgButton extends React.Component {

    constructor(props){
        super();
        this.img = props.things[0];
        this.alt = props.things[1];
        this.active = props.things[0];
        this.text = props.things[2];
        this.setpfp = this.setpfp.bind(this)
    }

    render(){
        if (this.props.pfps.includes(this.text) === false){
            return (<button style = {{backgroundColor : "rgba(0,0,0,0)", borderColor: "rgba(0,0,0,0)"}}><img src = {this.active} onClick = {this.setpfp}/></button>)
        }
        else{
            return(<button style = {{backgroundColor : "rgba(0,0,0,0)", borderColor: "rgba(0,0,0,0)"}}><img src = {this.alt} /></button>)
        }
    }
    
    setpfp(){
        this.props.onClick(this.text)
    }
}

class ImgRow extends React.Component {

    render(){
        return(
            <div style={{display: "flex"}}>
                <ImgButton pfps = {this.props.pfps} onClick = {this.props.onClick} things = {this.props.images[0]}/>
                <ImgButton pfps = {this.props.pfps} onClick = {this.props.onClick} things = {this.props.images[1]}/>
                <ImgButton pfps = {this.props.pfps} onClick = {this.props.onClick} things = {this.props.images[2]}/>    
            </div>
        )
    }
}

export default ImgRow;