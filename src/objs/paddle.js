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
    }
    ret.leftX = this.props.value.coords.x;
    ret.topY = this.props.value.coords.y;
    ret.rightX = ret.leftX + this.paddleRef.offsetWidth;
    ret.bottomY = ret.topY + this.paddleRef.offsetHeight;
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