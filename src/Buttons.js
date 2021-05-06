import React from "react";
import reactDom from "react-dom";
import "./style.css";

class MenuButton extends React.Component {
    constructor(props){
        super();
        this.state = {
            onClick: props.onClick,
            style: props.style,
            answer: props.text
        }
    }

    render(props) {
        return <button onClick = {this.state.onClick} style = {this.state.style}>{this.state.answer}</button>
    }
}

export default MenuButton;