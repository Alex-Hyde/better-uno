import React from "react";
import "./style.css";

class Banner extends React.Component {
    render(props) {
        return <p style={{fontSize: "50px", margin: "0px"}}>{this.props.lobby_num}</p>
    }
}

export default Banner;