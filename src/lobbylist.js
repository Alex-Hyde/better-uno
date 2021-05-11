import React from 'react';

class PlayerIcon extends React.Component{

    render(){
        return(
            <div>
                <h1>{this.props.name}</h1>
            </div>
        )
    }
}

class Lobbylist extends React.Component {
    
    render(){
            var playerstorender = this.props.players.map(player => <PlayerIcon key={player} name={player}/>)
        return(
            <div>
                {playerstorender}  
            </div>   
        ) 
    }
}

export default Lobbylist