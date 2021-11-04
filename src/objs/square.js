import React, {useState, useEffect, createRef} from 'react';
import ReactDOM from 'react-dom';
class Square extends React.Component {
  constructor(props){
    super(props);
    this.ref=createRef();
  }

  getObjectCoordsRange(){
    let ret={
      leftX: 0,
      bottomY: 0,
      rightX: 0,
      topY: 0,
    }
    ret.leftX = this.props.value.x;
    ret.topY = this.props.value.y;
    ret.rightX = ret.leftX + this.ref.offsetWidth;
    ret.bottomY = ret.topY + this.ref.offsetHeight;
    //console.log("left, top, right, bottom: " + ret.leftX + "," + ret.topY + ","+ ret.rightX +"," + ret.bottomY)
    return ret
  }

  render() {
    return (<button className="square" style={{position: 'absolute', left: this.props.value.x, top: this.props.value.y}} onClick={() => this.props.onClick()}>
      {this.props.value.x}
    </button>)
  }
}
export default Square;
