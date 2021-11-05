import React, {useState, useEffect, createRef} from 'react';
import ReactDOM from 'react-dom';
class Square extends React.Component {
  constructor(props){
    super(props);
    this.sqref=createRef(null);
  }

  getObjectCoordsRange(){
    let ret={
      leftX: 0,
      bottomY: 0,
      rightX: 0,
      topY: 0,
      xInc: true,
      yInc: true,
    }
    ret.leftX = this.props.value.x;
    ret.topY = this.props.value.y;
    ret.rightX = ret.leftX + this.sqref.offsetWidth;
    ret.bottomY = ret.topY + this.sqref.offsetHeight;
    ret.xInc = this.props.value.xInc;
    ret.yInc = this.props.value.yInc;
    return ret
  }

  render() {
    return (<button ref={(r) => {this.sqref = r}} className="square" style={{position: 'absolute', left: this.props.value.x, top: this.props.value.y}} onClick={() => this.props.onClick()}>
      {this.props.value.x}
    </button>)
  }
}
export default Square;
