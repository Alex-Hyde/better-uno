import React from "react";
import "./style.css";

class Banner extends React.Component {
    render(props) {
        return <h1 >Game {this.props.lobby_num}</h1>
    }
}

export default Banner;