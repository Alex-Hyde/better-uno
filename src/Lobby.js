import React from "react";
import Banner from "./Banner" ;
import Lobbylist from "./lobbylist";
import HostLobbylist from "./hostlobbylist";
import MenuButton from "./Buttons.js";
import firebase from "./firebase.js";
import "./LobbyStyle.css";
import ImgRow from "./Iconselect.js"
import pfp1 from "./images/pfp1.png"
import pfp2 from "./images/pfp2.png"
import pfp3 from "./images/pfp3.png"
import pfp4 from "./images/pfp4.png"
import pfp5 from "./images/pfp5.png"
import pfp6 from "./images/pfp6.png"
import pfp7 from "./images/pfp7.png"
import pfp8 from "./images/pfp8.png"
import pfp9 from "./images/pfp9.png"
import pfp10 from "./images/pfp10.png"
import pfp11 from "./images/pfp11.png"
import pfp12 from "./images/pfp12.png"
import pfp13 from "./images/pfp13.png"

class Lobby extends React.Component {

    constructor(props){
        super();
        this.state = {
            Lobbycode: props.Lobbycode,
            players: props.players,
            pfps: props.pfps,
            name: props.name,
            pfp: props.pfp
        }
        this.ishost = props.ishost;
        this.leaveLobby = this.leaveLobby.bind(this)
    }

    leaveLobby(e) {
        e.preventDefault();
        var firestore = firebase.firestore();  
        var docRef = firestore.doc("Games/Game " + this.state.Lobbycode);
        docRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.data().PlayerAmnt === 1) {
                    firestore.doc("Games/Active Games").update({
                        "Active Games" : firebase.firestore.FieldValue.arrayRemove(this.state.Lobbycode)
                    })
                    firestore.doc("Games/Game " + this.state.Lobbycode).delete();
                } else {
                    docRef.update({
                        players : firebase.firestore.FieldValue.arrayRemove(this.state.name),
                        pfps: firebase.firestore.FieldValue.arrayRemove(this.state.pfp),
                        PlayerAmnt : firebase.firestore.FieldValue.increment(-1)
                    }) 
                }
            this.props.setInLobby(false, "", this.state.name, this.state.pfp);
            })
        return
    }

    componentDidMount() {
        window.onbeforeunload = this.leaveLobby;
    }
      
    componentWillUnmount() {
        //window.removeEventListener("beforeunload", this.props.onBeforeUnload);
    }

    render(props){
        console.log(this.props.pfps)
        if (!this.props.ishost){
            return(
                <div>
                    <div id = "banner" style = {{textAlign: "center"}}>
                    <Banner lobby_num = {this.props.Lobbycode}/>
                    </div>
                    <div className = "split left" style = {{marginTop : "5%", marginLeft: "20%", width: "25%" , height : "70%", borderRadius: "2%" , backgroundColor: "#B15BF1"}}>
                    <Lobbylist name = {this.props.name} leavefunc = {this.leaveLobby} players={this.props.playerlist} images={this.props.pfps}/> 
                    </div>
                    <div className = "split right">
                        <h1 style = {{marginLeft:"118px"}}>Pick a Profile Picture</h1>
                        <div className = "centered" style = {{height : "85%", width : "100%"}}>
                        <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp1,pfp13,"pfp1"],[pfp2,pfp13,"pfp2"],[pfp3,pfp13,"pfp3"]]}/>
                        <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp4,pfp13,"pfp4"],[pfp5,pfp13,"pfp5"],[pfp6,pfp13,"pfp6"]]}/>
                        <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp7,pfp13,"pfp7"],[pfp8,pfp13,"pfp8"],[pfp9,pfp13,"pfp9"]]}/>
                        <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp10,pfp13,"pfp10"],[pfp11,pfp13,"pfp11"],[pfp12,pfp13,"pfp12"]]}/>
                        </div>
                    </div>
                </div>
            ) 
        }
        return(
            <div>
                <div>
                <div style = {{display: "flex", justifyContent: "center"}}>
                <Banner lobby_num = {this.props.Lobbycode}/>
                </div>
                <div className = "split left">
                <HostLobbylist name = {this.props.name} leavefunc = {this.leaveLobby} images={this.props.pfps} players={this.props.playerlist} Lobbycode = {this.props.Lobbycode}/> 
                <div style = {{display: "flex", justifyContent: "center"}}>
                    <MenuButton 
                        style={{fontSize: "30px"}} 
                        text="Start Game"
                        style={{
                            fontSize: "30px", 
                            height: "25%", 
                            width: "25%" ,
                            borderRadius: "10px",
                            border: "0px solid white",
                            backgroundImage: "linear-gradient(20deg, #730C99 0%, #9F05C5 100%)"
                        }} 
                        onClick = {this.props.setInGame}
                    />
                    </div> 
                </div>
                <div className = "split right">
                        <h1>Pick a Profile Picture</h1>
                        <div className = "centered">
                        <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp1,pfp13,"pfp1"],[pfp2,pfp13,"pfp2"],[pfp3,pfp13,"pfp3"]]}/>
                        <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp4,pfp13,"pfp4"],[pfp5,pfp13,"pfp5"],[pfp6,pfp13,"pfp6"]]}/>
                        <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp7,pfp13,"pfp7"],[pfp8,pfp13,"pfp8"],[pfp9,pfp13,"pfp9"]]}/>
                        <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp10,pfp13,"pfp10"],[pfp11,pfp13,"pfp11"],[pfp12,pfp13,"pfp12"]]}/>
                        </div>
                    </div>
                </div>     
            </div>
        )
    }
}

export default Lobby;