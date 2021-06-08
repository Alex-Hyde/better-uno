import React from 'react';
import ReactDOM from 'react-dom';
import LobbyBanner from './Banner.js';
import MenuButton from "./Buttons.js";
import firebase from "./firebase.js";
import "./menu.css";

class MenuPage extends React.Component {
    constructor(props){
        super();
        this.state = {
            Name: "",
            Game_Key: "",
            message : ""
        }
        this.setName = this.setName.bind(this)
        this.setLobby = this.setLobby.bind(this)
        this.createLobby = this.createLobby.bind(this)
        this.setCode = this.setCode.bind(this)
    }

    setName(event){
        this.setState({
            Name: event.target.value,
            message: "",
            Game_Key: this.state.Game_Key
        })
    }

    setCode(event){
        this.setState({
            Name: this.state.Name,
            Game_Key: event.target.value
        })
    }

    setLobby(e) {
        e.preventDefault();
        if(this.state.Name === ""){
            this.setState({
                Name: this.state.Name,
                message: "Please enter a name",
                Game_Key: this.state.Game_Key,
            }) 
            document.getElementById("nameInput").focus()
            return   
        }
        var firestore = firebase.firestore();  
        var docRef = firestore.doc("Games/Game " + this.state.Game_Key);
        docRef.get()
        .then((docSnapshot) => {
            if ((docSnapshot.exists)){
                if (docSnapshot.data().inGame) {
                    window.alert("Game has already started");
                    this.setState({
                        Name: this.state.Name,
                        message: "Game has already started",
                        Game_Key: this.state.Game_Key,
                    })
                } else if (docSnapshot.data().PlayerAmnt >= 10) {
                    window.alert("Game is full");
                    this.setState({
                        Name: this.state.Name,
                        message: "Game full",
                        Game_Key: this.state.Game_Key,
                    })
                } else if (docSnapshot.data().players.includes(this.state.Name)) {
                    window.alert("Duplicate Name");
                    this.setState({
                        Name: this.state.Name,
                        message: "Duplicate Name",
                        Game_Key: this.state.Game_Key,
                    })
                } else {
                    var current = 1;
                    while (docSnapshot.data().pfps.includes("pfp" + current)) {
                        current += 1;
                    }
                    docRef.update({
                        players : firebase.firestore.FieldValue.arrayUnion(this.state.Name),
                        pfps : firebase.firestore.FieldValue.arrayUnion("pfp" + current),
                        PlayerAmnt : firebase.firestore.FieldValue.increment(1)
                    }).then(
                    this.props.setInLobby(true, parseInt(this.state.Game_Key), this.state.Name, "pfp" + current))
                } 
            } else {
                if (this.state.Game_Key == "") {
                    document.getElementById("codeInput").focus()
                } else {
                    window.alert("Lobby Not Found");
                }
                this.setState({
                    Name: this.state.Name,
                    message: "Lobby Not Found"
                })
                return;
            }
        });
    }

    createLobby(e) {
        e.preventDefault();
        if(this.state.Name === ""){
            this.setState({
                Name: this.state.Name,
                message: "Please enter a name",
                Game_Key: this.state.Game_Key,
            }) 
            document.getElementById("nameInput").focus()
            return   
        }
        var firestore = firebase.firestore();  
        var x = firestore.doc("Games/Active Games");
        var y;
        x.get().then((doc) => {
            y = doc.data()["Active Games"]
            var random_num = Math.floor(Math.random() * 1000000);
            while (y.includes(random_num)) {
                random_num = Math.floor(Math.random() * 1000000);
            }
            this.setState({
                Name: this.state.Name,
                Game_Key: random_num,
            })
            var docRef = firestore.doc("Games/Game " + random_num);
            docRef.set({
                currentcard: "none",
                PlayerAmnt: 1,
                players : firebase.firestore.FieldValue.arrayUnion(this.state.Name),
                pfps: ["pfp1"],
                hands : {},
                turn : 0,
                currentplayer : 0,
                cardInd : -1,
                lastPlayer : -1,
                lastAction : "N/A",
                gameAction : false,
                inGame : false,
                reversed : false,
                chain : 0,
                chainCard : "",
                playedCards: 0,
                special : false,
                guessing : false,
                guessHand: [],
                discards: 0,
                breakaway: false,
                lastSpecial: [],
                specialNext: -1,
                dueling: false,
                duelers: []
            })
            firestore.doc("Games/Active Games").update({
                "Active Games" : firebase.firestore.FieldValue.arrayUnion(random_num)
            })
            this.props.setInLobby(true, random_num, this.state.Name, "pfp1");
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    

    render(){
        return (
            <div id="menuContainer">
                <form>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {/* <h1 style={{fontSize: "30px"}}> Enter Your Name:</h1> */}
                        <input id="nameInput" type="textfield" placeholder="Name" onChange={this.setName} spellCheck="false" autoComplete="off"></input>                 
                    </div>
                    <br/>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <div style={{flex: "50%", paddingRight: "8px"}}>
                            <input id="codeInput" type="textfield" placeholder="Game Code" onChange={this.setCode} spellCheck="false" autoComplete="off"></input>
                            <MenuButton id="joinLobby"
                                style={{
                                        height: "75px", 
                                        width: "100%",
                                        fontSize: "45px"
                                    }} 
                                text="JOIN"
                                onClick={this.setLobby}
                            />
                        </div>
                        <div style={{flex: "50%", paddingLeft: "8px"}}>
                            <div style={{
                                        height: "100%", 
                                        width: "100%" 
                                    }} >
                                <MenuButton id="hostLobby"
                                    style={{
                                            height: "100%", 
                                            width: "100%",
                                            fontSize: "60px"
                                        }} 
                                    text="HOST"
                                    onClick={this.createLobby}
                                />
                            </div>
                        </div>
                    </div>
                </form>
                <div style={{display: "none", justifyContent: "center"}}>
                <h1>{this.state.message}</h1>
                </div>
                <div style={{display: "none", justifyContent: "center"}}>
                <h1>{this.state.Name}</h1>
                </div>
                <div style={{display: "none", justifyContent: "center"}}>
                <h1 style={{display: "none"}} >Lobby: {this.state.Game_Key}</h1>
                </div>
            </div>
        )

    }
}

export default MenuPage;