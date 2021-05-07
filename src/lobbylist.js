import React from 'react';

class PlayerIcon extends React.Component{

    constructor(props){
        super();
        this.state = {
            name : props.name
        }
    }

    render(){
        return(
            <div>
                <h1>{this.state.name}</h1>
            </div>
        )
    }
}

class Lobbylist extends React.Component {

    constructor(props){
        super();
        this.state = {
            players : props.players.map(player => <PlayerIcon key={player} name={player}/>)
        }
    }
    
    render(){
        return(
            <div>
                {this.state.players}  
            </div>   
        ) 
    }
}

export default Lobbylist