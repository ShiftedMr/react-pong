import React, {useState, useEffect, createRef} from 'react';
import Paddle from './paddle'
import Square from './square'

class Board extends React.Component {
  constructor(props){
    super(props);
    this.ball=null;
    this.boardRef = createRef();
    this.childPaddle = [];
    this.childPaddle[0] = null;
    this.childPaddle[1] = null;
    this.childPaddle[2] = null;

  }
  renderPaddle(player, clickFunc){
    //console.log("rendering paddle: "+player);
    return (<Paddle
      ref={(r) => {this.childPaddle[player.id] = r}}
      value={player}
      onClick={(player)=>clickFunc(player)}
      />);
  }
  getBall(){
    return this.ball;
  }
  getPaddles(){
    return [null,this.childPaddle[1],this.childPaddle[2]];
  }
  componentDidMount() {
    //Access the child component function from here
    console.log("VIDTH: " +this.childPaddle[1].getObjectCoordsRange());
    console.log("VIDTH: " +this.childPaddle[2].getObjectCoordsRange());
  }
  renderSquare(i) {
    //console.log("renderSquare");
    //console.log("win dims:"+getWindowDimensions().height+"x"+getWindowDimensions().width);
    return (<Square 
      ref={(r) => {this.ball = r}}
      value={this.props.ball.coords}
      onClick={()=>this.props.onClick()}
    />);
  }

  render() {

    return (
      <div>
        <div ref={(r) => {this.boardRef = r}} className="board-row">
          {this.renderPaddle(this.props.player1_object, this.props.paddle1Click)}
          {this.renderSquare(2)}
          {this.renderPaddle(this.props.player2_object, this.props.paddle2Click)}
        </div>
      </div>
    );
  }
}

export default Board;