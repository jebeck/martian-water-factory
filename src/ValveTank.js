import React, { Component, PropTypes } from 'react';
import Dimensions from 'react-dimensions';
import { Motion, spring } from 'react-motion';

import './ValveTank.css';

class ValveTank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      capY: spring(0),
      capAngle: spring(0),
    };
  };

  static propTypes = {
    capacity: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    toggleValve: PropTypes.func.isRequired,
    valveIsOpen: PropTypes.bool.isRequired,
  };

  renderTankSVG(interpolated) {
    const { color, containerHeight: h, label, containerWidth: w } = this.props;
    const { toggleValve } = this.props;

    const topOfTank = 100;
    const ridgeHeight = topOfTank + (h - topOfTank)/2;
    const ridgeStroke = 25;

    const innerPadding = 5;
    const topInnerTank = topOfTank + 5;
    const innerTankHeight = h - topInnerTank - innerPadding;

    // insp: https://thenounproject.com/term/gas-tank/196929/
    return (
      <svg height={h} width={w}>
        <defs>
          <clipPath id="ValveTank-contents">
            <rect
              x={15}
              y={topInnerTank}
              width={w - 30}
              height={innerTankHeight}
              rx={45}
              ry={65}
            />
          </clipPath>
        </defs>
        <text className="Tank-label" x={w/2} y={25}>{label}</text>
        <line
          className="ValveTank-ridge"
          strokeWidth={ridgeStroke}
          x1={ridgeStroke/2}
          x2={w - ridgeStroke/2}
          y1={ridgeHeight}
          y2={ridgeHeight}
        />
        <rect
          className="ValveTank-container"
          x={w/2 - w/8}
          y={topOfTank - 20}
          width={w/4}
          height={40}
          rx={5}
          ry={5}
        />
        <rect
          className="ValveTank-container"
          x={10}
          y={topOfTank}
          width={w - 20}
          height={h - topOfTank}
          rx={45}
          ry={65}
        />
        <rect
          fill="white"
          x={w/2 - w/12}
          y={topOfTank - 20}
          width={w/6}
          height={80}
        />
        <rect
          clipPath="url(#ValveTank-contents)"
          fill={color}
          x={0}
          y={h - interpolated.percentage * innerTankHeight}
          width={w}
          height={interpolated.percentage * innerTankHeight}
        />
        <line
          className="ValveTank-highlight"
          strokeWidth={ridgeStroke/5}
          x1={10}
          x2={w - 10}
          y1={ridgeHeight + 15}
          y2={ridgeHeight + 15}
        />
        <line
          className="ValveTank-cap"
          onClick={toggleValve}
          strokeWidth={10}
          transform={`translate(0, ${interpolated.capY}) rotate(-${interpolated.capAngle} ${w/2 - w/7} ${topOfTank - 22.5})`}
          x1={w/2 - w/7}
          x2={w/2 + w/7}
          y1={topOfTank - 22.5}
          y2={topOfTank - 22.5}
        />
      </svg>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.valveIsOpen !== this.props.valveIsOpen) {
      this.setState({
        capY: nextProps.valveIsOpen ? spring(2) : spring(0),
        capAngle: nextProps.valveIsOpen ? spring(45) : spring(0),
      });
    }
  }

  render() {
    const { capacity, level } = this.props;
    const percentage = spring((level/capacity), {stiffness: 150, damping: 5});

    return (
      <Motion style={{ percentage, capY: this.state.capY, capAngle: this.state.capAngle }}>
        {(interpolated) => (
          this.renderTankSVG(interpolated)
        )}
      </Motion>
    );
  }
};

export default Dimensions()(ValveTank);
