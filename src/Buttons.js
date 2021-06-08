import React from "react";
import reactDom from "react-dom";
import "./style.css";
import "./Button.css";

class MenuButton extends React.Component {
    constructor(props){
        super();
        this.state = {
            style: props.style,
            answer: props.text
        }
    }

    render(props) {
        return <button className="reactButton" onClick = {this.props.onClick} style = {this.state.style}>{this.state.answer}</button>
    }
}

export default MenuButton;