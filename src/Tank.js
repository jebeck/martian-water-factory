import React, { Component, PropTypes } from 'react';
import Dimensions from 'react-dimensions';
import { Motion, spring } from 'react-motion';

import './Tank.css';

class Tank extends Component {
  static propTypes = {
    capacity: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
  };

  renderTankSVG(interpolated) {
    const { color, containerHeight: h, label, containerWidth: w } = this.props;

    const topOfTank = 120;

    const innerPadding = 5;
    const topInnerTank = topOfTank + 5;
    const innerTankHeight = h - topInnerTank - innerPadding;
    const ridgeStroke = 20;

    return (
      <svg height={h} width={w}>
        <defs>
          <clipPath id="Tank-contents">
            <rect
              x={15}
              y={topInnerTank}
              width={w - 30}
              height={innerTankHeight}
              rx={35}
              ry={45}
            />
          </clipPath>
        </defs>
        <text className="Tank-label" x={w/2} y={75}>{label}</text>
        <line
          className="ValveTank-ridge"
          strokeWidth={ridgeStroke}
          x1={ridgeStroke/2}
          x2={w - ridgeStroke/2}
          y1={topOfTank + (h - topOfTank)/3}
          y2={topOfTank + (h - topOfTank)/3}
        />
        <line
          className="ValveTank-ridge"
          strokeWidth={ridgeStroke}
          x1={ridgeStroke/2}
          x2={w - ridgeStroke/2}
          y1={topOfTank + (h - topOfTank)*2/3}
          y2={topOfTank + (h - topOfTank)*2/3}
        />
        <rect
          className="ValveTank-container"
          x={10}
          y={topOfTank}
          width={w - 20}
          height={h - topOfTank}
          rx={35}
          ry={45}
        />
        <rect
          clipPath="url(#Tank-contents)"
          fill={color}
          x={0}
          y={h - interpolated.percentage * innerTankHeight}
          width={w}
          height={interpolated.percentage * innerTankHeight}
        />
      </svg>
    );
  }

  render() {
    const { capacity, level } = this.props;
    const percentage = spring((level/capacity), {stiffness: 150, damping: 5});

    return (
      <Motion style={{ percentage }}>
        {(interpolated) => (
          this.renderTankSVG(interpolated)
        )}
      </Motion>
    );
  }
};

export default Dimensions()(Tank);
