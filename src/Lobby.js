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
                <div id = "lobbyParent">
                    <div id = "banner"style = {{textAlign: "center", marginBottom: "10px"}}>
                        <Banner lobby_num = {this.props.Lobbycode}/>
                    </div>
                    <div id = "splitScreen">
                        <div style = {{flex: "50%", marginBottom: "4px"}}>
                            <div style={{marginRight: "10px", borderRadius: "10px", border: "2px solid #ffbffe", height: "100%", overflowY: "auto"}}>
                                <Lobbylist name = {this.props.name} leavefunc = {this.leaveLobby} players={this.props.playerlist} images={this.props.pfps}/> 
                            </div>
                        </div>
                        <div style = {{flex: "50%"}}>
                            <div style={{marginLeft: "10px", borderRadius: "10px", border: "2px solid #ffbffe"}}>
                                <div id="iconSelect" style = {{width : "100%", alignContent: "center"}}>
                                    <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp1,pfp13,"pfp1"],[pfp2,pfp13,"pfp2"],[pfp3,pfp13,"pfp3"]]}/>
                                    <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp4,pfp13,"pfp4"],[pfp5,pfp13,"pfp5"],[pfp6,pfp13,"pfp6"]]}/>
                                    <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp7,pfp13,"pfp7"],[pfp8,pfp13,"pfp8"],[pfp9,pfp13,"pfp9"]]}/>
                                    <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp10,pfp13,"pfp10"],[pfp11,pfp13,"pfp11"],[pfp12,pfp13,"pfp12"]]}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) 
        }
        return(
            <div id = "lobbyParent" style={{paddingBottom: "25px"}}>
                <div id = "banner" style = {{textAlign: "center", marginBottom: "10px"}}>
                    <Banner lobby_num = {this.props.Lobbycode}/>
                </div>
                <div id = "splitScreen">
                    <div style = {{flex: "50%", marginBottom: "4px"}}>
                        <div style={{marginRight: "10px", borderRadius: "10px", border: "2px solid #ffbffe", height: "100%", overflowY: "auto"}}>
                            <HostLobbylist name = {this.props.name} leavefunc = {this.leaveLobby} images={this.props.pfps} players={this.props.playerlist} Lobbycode = {this.props.Lobbycode}/> 
                        </div>
                    </div>
                    <div style = {{flex: "50%"}}>
                        <div style={{marginLeft: "10px", borderRadius: "10px", border: "2px solid #ffbffe"}}>
                            <div id="iconSelect" style = {{width : "100%", alignContent: "center"}}>
                                <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp1,pfp13,"pfp1"],[pfp2,pfp13,"pfp2"],[pfp3,pfp13,"pfp3"]]}/>
                                <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp4,pfp13,"pfp4"],[pfp5,pfp13,"pfp5"],[pfp6,pfp13,"pfp6"]]}/>
                                <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp7,pfp13,"pfp7"],[pfp8,pfp13,"pfp8"],[pfp9,pfp13,"pfp9"]]}/>
                                <ImgRow pfp = {this.props.pfp} pfps = {this.props.pfps} onClick = {this.props.func} images = {[[pfp10,pfp13,"pfp10"],[pfp11,pfp13,"pfp11"],[pfp12,pfp13,"pfp12"]]}/>
                            </div>
                        </div>
                    </div>
                </div>
                <MenuButton
                    text="Start Game"
                    style={{ 
                        height: "80px", 
                        width: "300px" ,
                        borderRadius: "10px",
                        marginLeft: "200px",
                        marginTop: "10px"
                    }} 
                    onClick = {this.props.setInGame}
                />
            </div>
        )
    }
}

export default Lobby;