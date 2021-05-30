import React from "react";
import "./style.css";

class LobbyBanner extends React.Component {
    constructor(props){
        super();
        this.state = {
            style: props.style,
            lobby_num: props.lobby_num
        }
    }

    render(props) {
        return <h1 style = {this.state.style}>Game {this.state.lobby_num}</h1>
    }
}

export default LobbyBanner;