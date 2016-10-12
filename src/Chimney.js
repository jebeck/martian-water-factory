import React, { Component, PropTypes } from 'react';
import Dimensions from 'react-dimensions';

import './Chimney.css';

class Chimney extends Component {
  static propTypes = {
    burn: PropTypes.func.isRequired,
    containerHeight: PropTypes.number.isRequired,
    containerWidth: PropTypes.number.isRequired,
  };

  render() {
    const { containerHeight: h, containerWidth: w } = this.props;

    const topOfChimney = 150;

    return (
      <svg height={h} width={w}>
        <polygon
          className="Chimney"
          points={`${w/2 - w/5}, ${topOfChimney} ${w/2 + w/5}, ${topOfChimney} ${w - 5}, ${h - 5}, 5, ${h - 5}`}
        />
        <ellipse
          fill="SteelBlue"
          cx={w/2}
          cy={topOfChimney}
          rx={w/5}
          ry={2.5}
        />
        <circle
          className="Sparker"
          cx={w/2}
          cy={topOfChimney + (h - topOfChimney)/5}
          onClick={this.props.burn}
          r={15}
        />
      </svg>
    );
  }
};

export default Dimensions()(Chimney);
