import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
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


function Square(props) {
    return (
      <button className="square" style={{position: 'absolute', left: props.value.x, top: props.value.y}} onClick={() => props.onClick()}>
        {props.value.x}
      </button>
    );
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

class Board extends React.Component {
  renderSquare(i) {
    console.log("renderSquare")
    console.log("win dims:"+getWindowDimensions().height+"x"+getWindowDimensions().width)
    return (<Square 
      value={this.props.ball_coords}
      onClick={()=>this.props.onClick()}
    />);
  }

  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(2)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state={
      ball_coords : {x:0,y:0},
      dim: {x:19000, y:19000},
      xInc: true,
      yInc: true,
    }
  }
  handleClick(){
    console.log("Clicked")
    const ballLoc = this.state.ball_coords
    this.setState({
      ball_coords: {x: ballLoc.x+1, y:ballLoc.y+1},
    });
    console.log("current state: x:"+(ballLoc.x+1)+" y:"+(ballLoc.y))
  }
  incrementLocation(){
    const cur_dims = getWindowDimensions();
    const maxX = this.state.dim.x;
    const maxY = this.state.dim.y;
    if (cur_dims.height != maxY || cur_dims.width != maxX){
      console.log("Window has been resized since rendering started")
    }

    const curX = this.state.ball_coords.x;
    const curY = this.state.ball_coords.y;
    const xInc = (( this.state.xInc && curX < maxX ) || (!this.state.xInc && curX<=0));
    const yInc = (( this.state.yInc && curY < maxY ) || (!this.state.yInc && curY<=0));
    console.log(
      "MaxX: " + maxX +
      "\nMaxY: " + maxY +
      "\ncurX: " + curX +
      "\ncurY: " + curY +
      "\nxInc: " + xInc +
      "\nyInc: " + yInc 
    )
    const newX = this.state.ball_coords.x + (xInc?1:-1);
    const newY = this.state.ball_coords.y + (yInc?1:-1);
    this.setState({ 
      ball_coords: {
        x: newX, 
        y: newY,
      },
      xInc: xInc,
      yInc: yInc,
    })
  }
  componentDidMount(){
    const dims = getWindowDimensions();
    console.log("Setting dimensions: "+dims.width+"x"+dims.height)
    this.setState({dim:{x:dims.width, y:dims.height}});

    setInterval(() => this.incrementLocation(), 10)
  }
  updateWindowDimensions() {
    const dims = getWindowDimensions();
    console.log("RESIZED: Setting dimensions: "+dims.height+"x"+dims.width)
    this.setState({dim:{x:dims.height, y:dims.width}});
  }
  render() {
    const coords = this.state.ball_coords;
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            ball_coords={coords}
            onClick={() => this.handleClick()}
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
