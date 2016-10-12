import Chance from 'chance';
const chance = new Chance();
import React, { PropTypes } from 'react';
import { TransitionMotion, spring } from 'react-motion';

import './Explosion.css';

const Explosion = (props) => {
  let booms = [];
  for (let i = 0; i < chance.natural({min: 50, max: 150}); ++i) {
    booms.push({
      fontSize: chance.pickone([0.5,1,1.5,2,2.5]),
      top: chance.natural({min: 0, max: 100}),
      left: chance.natural({min: 0, max: 100}),
    });
  }
  if (!props.active) {
    booms = [];
  }

  function renderBoom(interpolated) {
    const { key, style: { fontSize, top, left } } = interpolated;

    return (
      <div
        key={key}
        style={{
          fontSize: `${fontSize}rem`,
          position: 'absolute',
          top: `${top}%`,
          left: `${left}%`
        }}
      >
        💥
      </div>
    );
  }

  const config = { stiffness: 150, damping: 5 };

  const boomStyles = booms.map((boom, i) => ({
    key: i,
    style: {
      fontSize: spring(boom.fontSize),
      top: spring(boom.top, config),
      left: spring(boom.left, config),
    },
  }));

  return (
    <TransitionMotion
      willEnter={() => ({ fontSize: 1, top: 0, left: 0 })}
      styles={boomStyles}>
      {(interpolateds) => (
        <div className="Explosion">
          {interpolateds.map((interpolated) => {
            return renderBoom(interpolated);
          })}
        </div>
      )}
    </TransitionMotion>
  );
};

Explosion.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default Explosion;
