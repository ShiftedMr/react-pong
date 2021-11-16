import React, {useState, useEffect, createRef} from 'react';
import ReactDOM from 'react-dom';
class Paddle extends React.Component {
  constructor(props){
    super(props)
    this.paddleRef = createRef(null);
    this.testmsg = "fred"
  }

  getObjectCoordsRange(){
    let ret={
      leftX: 0,
      bottomY: 0,
      rightX: 0,
      topY: 0,
      xInc: false,
      yInc: false,
    }
    ret.leftX = this.props.value.coords.x;
    ret.topY = this.props.value.coords.y;
    ret.rightX = ret.leftX + this.paddleRef.offsetWidth;
    ret.bottomY = ret.topY + this.paddleRef.offsetHeight;
    ret.xInc = this.props.value.coords.xInc;
    ret.yInc = this.props.value.coords.yInc;
    //console.log("In paddle func xandY inc: "+ret.inc)
    //Object.keys(this.props.value.coords).forEach((prop)=> console.log(prop));
    return ret
  }

  render() {
      return (
        <button ref={(r) => {this.paddleRef = r}} className="paddle" style={
          {
            position: 'absolute',
            left: this.props.value.coords.x,
            top: this.props.value.coords.y}}
            onClick={(player) => this.props.onClick(this.props.player)}>
          {this.props.value.name}
        </button>
      );
  }
}
export default Paddle;