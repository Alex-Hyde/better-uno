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
            return (<button style = {{backgroundColor : "rgba(0,0,0,0)", borderColor: "rgba(0,0,0,0)", padding: "0px"}}><img width={74} height = {74} style={{border: "3px solid #00000033"}} src = {this.active} onClick = {this.setpfp}/></button>)
        }
        else if (this.props.pfp === this.text){
            return(<button style = {{backgroundColor : "rgba(0,0,0,0)", borderColor: "rgba(0,0,0,0)", padding: "0px"}}><img width={74} height = {74} style={{border: "3px solid #ffbffe", boxShadow: "0px 0px 10px #ffbffe"}} src = {this.active} /></button>)
        }
        else{
            return(<button style = {{backgroundColor : "rgba(0,0,0,0)", borderColor: "rgba(0,0,0,0)", padding: "0px"}}><img width={74} height = {74} style={{opacity: "0.5", border: "3px solid #00000033"}} src = {this.active} /></button>)
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