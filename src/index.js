import React, {useState, useEffect, createRef} from 'react';
import ReactDOM from 'react-dom';
import Board from './objs/board'
import './index.css';


// both window funcs stolen from https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}
export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}



/*
class Ball extends Square{
  constructor(props){
    super(props);
    var ballX = 0;
    var ballY = 0;
    var ballSpeedPx = 0;
    var ballAngleDirection = 0; //radians

  }
}*/


class Game extends React.Component {
  constructor(props){
    super(props);
    this.boardRef= null;
    this.state={
      board: null,
      ball: {coords : {x:30,y:0,xInc: true,yInc: true}},
      player1_object: {coords: {x:0, y:0,xInc: true,yInc: true}, name:"player1", score:0, id: 1},
      player2_object: {coords: {x:1000, y:0,xInc: true,yInc: true}, name:"player2", score:0, id: 2},
      //windowdims
      dim: {x:19000, y:19000},
      refs: {ball:null,
             player1: null,
             player2: null,
             board: null}
    }
  }
  checkForCollision(shapeRef, point){
    if(shapeRef == null || point == null){
      console.log("collision check had nref");
      return false;
    }
    const shape1=shapeRef.getObjectCoordsRange();
    let collided=false;
    if ((shape1.leftX <= point.x && shape1.topY <= point.y) &&
        (shape1.rightX >= point.x && shape1.bottomY >= point.y)){
            collided=true
    }
    return collided;
  }

  handleClick(){
    console.log("Clicked");
    const ballLoc = this.state.ball.coords
    this.setState({
      ball:{coords: {x: ballLoc.x+1, y:ballLoc.y+1}},
    });
    console.log("current state: x:"+(ballLoc.x+1)+" y:"+(ballLoc.y));
  }

  handlePaddleClick(player){
    console.log("play"+player.id)
    //Object.keys(this.boardRef.props).forEach((prop)=> console.log(prop));

    console.log("length: "+this.boardRef.getPaddles()[player.id]);
    console.log("clicked: "+this.boardRef.getPaddles()[player.id]);
    console.log(this.getObjectCoordsPaddle(player));
  }
  
  getObjectCoordsPaddle(playObj){
    let paddles = this.boardRef.getPaddles();
    let paddle= paddles[playObj.id];
    // console.log("gocr length: "+paddles.length)
    // console.log("gocr paddle: "+paddle.props)
    // Object.keys(paddle).forEach((prop)=> console.log(prop));
    // console.log("OUTERWIDTH:" + paddle.getObjectCoordsRange());
    if(paddle==null)
    {
      console.log("getPaddleCoords had nref for p#" + playObj.id);
      return null;
    }
    return paddle.getObjectCoordsRange();
  }
  incrementLocations(){
    let state_clone=JSON.parse(JSON.stringify(this.state))
    state_clone = this.incrementLocation(state_clone);
    state_clone = this.wigglePaddles(state_clone);
    this.setState(state_clone);
  }

  wigglePaddles(stateobj){
    const cur_dims = getWindowDimensions();
    const maxY = cur_dims.height;
    let paddle1coords=this.getObjectCoordsPaddle(this.state.player1_object);
    let paddle2coords=this.getObjectCoordsPaddle(this.state.player2_object);
    if(paddle1coords == null || paddle2coords == null){
      return null
    }
    let curY1=paddle1coords.topY;
    let curY2=paddle2coords.topY;
    let ybuffer=140;
    const inc1_amt=3;
    const inc2_amt=2;
    const incY1 = ((paddle1coords.yInc&&(curY1+ybuffer+inc1_amt)<=maxY)||(!paddle1coords.yInc && (curY1-inc1_amt)<=0));
    const incY2 = ((paddle2coords.yInc&&(curY2+ybuffer+inc2_amt)<=maxY)||(!paddle2coords.yInc && (curY2-inc2_amt)<=0));

    const newY1 = this.state.player1_object.coords.y + (incY1?inc1_amt:0-inc1_amt);
    const newY2 = this.state.player2_object.coords.y + (incY2?inc2_amt:0-inc2_amt);
    console.log("Player1 moves from: "+ curY1 + "to:" + newY1 +
                "\nPlayer2 moves from: "+ curY2 + "to:" + newY2+ "\n"+
                "maxY: "+maxY+ "p1 math " +(curY1+ybuffer+inc1_amt) + "<= " +maxY+"\n"+
                "maxY: "+maxY+ "p2 math " +(curY2+ybuffer+inc2_amt) + "<= " +maxY)
    stateobj.player1_object.coords.y=newY1;
    stateobj.player1_object.coords.yInc=incY1;
    stateobj.player2_object.coords.y=newY2;
    stateobj.player2_object.coords.yInc=incY2;
    return stateobj;
  }

  incrementLocation(stateobj){
    const cur_dims = getWindowDimensions();
    const maxX = this.state.dim.x;
    const maxY = this.state.dim.y;
    if (cur_dims.height !== maxY || cur_dims.width !== maxX){
      console.log("Window has been resized since rendering started");
    }
    const ballRef = this.boardRef.getBall();
    const paddles = this.boardRef.getPaddles();
    const ballCoords = ballRef.getObjectCoordsRange();
    //Check topLeft Ball collision with left paddle
    const collLeftPadBallTopL = this.checkForCollision(paddles[1],{x: ballCoords.leftX, y: ballCoords.topY});
    //Check topRight Ball collision with left paddle
    const collLeftPadBallTopR = this.checkForCollision(paddles[1],{x: ballCoords.leftX, y: ballCoords.topY});
    //Check botLeft Ball collision with left paddle
    const collLeftPadBallBotL = this.checkForCollision(paddles[1],{x: ballCoords.leftX, y: ballCoords.topY});
    //Check botRight Ball collision with left paddle
    const collLeftPadBallBotR = this.checkForCollision(paddles[1],{x: ballCoords.leftX, y: ballCoords.topY});
    //Check topLeft Ball collision with right paddle
    const collRightPadBallTopL = this.checkForCollision(paddles[2],{x: ballCoords.leftX, y: ballCoords.topY});
    //Check topRight Ball collision with right paddle
    const collRightPadBallTopR = this.checkForCollision(paddles[2],{x: ballCoords.leftX, y: ballCoords.topY});
    //Check botLeft Ball collision with right paddle
    const collRightPadBallBotL = this.checkForCollision(paddles[2],{x: ballCoords.leftX, y: ballCoords.topY});
    //Check botRight Ball collision with right paddle
    const collRightPadBallBotR = this.checkForCollision(paddles[2],{x: ballCoords.leftX, y: ballCoords.topY});
    const oneCorner=false;
    const curX = this.state.ball.coords.x;
    const curY = this.state.ball.coords.y;
    const rightPaddleCollison = (
      (collRightPadBallBotR) ||
      (collRightPadBallTopR) ||
      (collRightPadBallTopL) ||
      (collRightPadBallBotL) );
    const leftPaddleCollision = (
      (collLeftPadBallBotR) ||
      (collLeftPadBallTopR) ||
      (collLeftPadBallTopL) ||
      (collLeftPadBallBotL))
    const xInc = (       !( this.state.ball.coords.xInc && curX >= maxX ) && (
      ( this.state.ball.coords.xInc && curX < maxX ) ||
      (!this.state.ball.coords.xInc && curX<=0)||
      (this.state.ball.coords.xInc&&!rightPaddleCollison) ||
      (!this.state.ball.coords.xInc&&leftPaddleCollision)));
    const yInc = (
      ( this.state.ball.coords.yInc && curY < maxY ) ||
      (!this.state.ball.coords.yInc && curY<=0));
    // console.log(
    //   "MaxX: " + maxX +
    //   "\nMaxY: " + maxY +
    //   "\ncurX: " + curX +
    //   "\ncurY: " + curY +
    //   "\nxInc: " + xInc +
    //   "\nyInc: " + yInc 
    // );
    const newX = this.state.ball.coords.x + (xInc?1:-1);
    const newY = this.state.ball.coords.y + (yInc?1:-1);
    stateobj.ball.coords.x = newX;
    stateobj.ball.coords.y = newY;
    stateobj.ball.coords.xInc = xInc;
    stateobj.ball.coords.yInc = yInc;
    return stateobj;
  }
  componentDidMount(){
    const dims = getWindowDimensions();
    console.log("Setting dimensions: "+dims.width+"x"+dims.height);
    this.setState({
      dim:{
        x:dims.width,
        y:dims.height}
    });
    //this.setState({refs:{player1: this.state.board.childPaddle[1], player2: this.state.refs.board.childPaddle[2]}});

    setInterval(() => this.incrementLocations(), 10);
  }

  updateWindowDimensions() {
    const dims = getWindowDimensions();
    console.log("RESIZED: Setting dimensions: "+dims.height+"x"+dims.width)
    this.setState({dim:{x:dims.height, y:dims.width}});
  }

  render() {
    const ball = this.state.ball;
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            ref={(r) => {this.boardRef = r}}
            ball={ball}
            player1_object={this.state.player1_object}
            player2_object={this.state.player2_object}
            onClick={() => this.handleClick()}
            paddle1Click={() => this.handlePaddleClick(this.state.player1_object)}
            paddle2Click={() => this.handlePaddleClick(this.state.player2_object)}
          />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
