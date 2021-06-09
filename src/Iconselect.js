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
        console.log(this.props.pfp,this.text)
        if (this.props.pfps.includes(this.text) === false){
            return (<button style = {{backgroundColor : "rgba(0,0,0,0)", borderColor: "rgba(0,0,0,0)", margin : "3px"}}><img width={75} height = {125} src = {this.active} onClick = {this.setpfp}/></button>)
        }
        else if (this.props.pfp === this.text){
            return(<button style = {{backgroundColor : "rgba(0,0,0,0)", borderColor: "rgba(0,0,0,0)"}}><img width={75} height = {125} style={{border: "3px solid #7C40A9 "}} src = {this.alt} /></button>)
        }
        else{
            return(<button style = {{backgroundColor : "rgba(0,0,0,0)", borderColor: "rgba(0,0,0,0)", margin : "3px"}}><img  width={75} height = {125} src = {this.alt} /></button>)
        }
    }
    
    setpfp(){
        this.props.onClick(this.text)
    }
}

class ImgRow extends React.Component {

    render(){
        console.log(this.props.pfp)
        return(
            <div style={{display: "flex"}}>
                <ImgButton pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.onClick} things = {this.props.images[0]}/>
                <ImgButton pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.onClick} things = {this.props.images[1]}/>
                <ImgButton pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.onClick} things = {this.props.images[2]}/>    
            </div>
        )
    }
}

export default ImgRow;