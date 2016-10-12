import React, { Component, PropTypes } from 'react';
import Dimensions from 'react-dimensions';
import { TransitionMotion, spring } from 'react-motion';

class Spark extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    containerHeight: PropTypes.number.isRequired,
    containerWidth: PropTypes.number.isRequired,
    fireBurning: PropTypes.bool.isRequired,
  };

  renderSpark(interpolated) {
    const { containerWidth: w } = this.props;
    const { key, style: { fontSize, x, y } } = interpolated;

    return (
      <div
        key={key}
        style={{
          fontSize: `${fontSize}rem`,
          position: 'absolute',
          top: y,
          left: x,
          width: w,
          textAlign: 'center'
        }}
      >
        🔥
      </div>
    );
  }

  willLeave() {
    return {
      fontSize: spring(0),
      x: spring(0),
      y: spring(0),
    };
  }

  render() {
    const { active, fireBurning } = this.props;

    return (
      <TransitionMotion
        willEnter={() => ({ x: 0, y: 80 })}
        willLeave={this.willLeave}
        styles={(active || fireBurning) ? [{key: 'spark', style: { fontSize: 4, x: spring(0), y: spring(65) }}] : []}
      >
        {(interpolateds) => (
          <div>
            {interpolateds.map((interpolated) => {
              return this.renderSpark(interpolated);
            })}
          </div>
        )}
      </TransitionMotion>
    );
  }
};

export default Dimensions()(Spark);
