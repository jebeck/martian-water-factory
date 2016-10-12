import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { burnWoodShavings, toggleHydrazineValve } from './state';

import './App.css';

import Chimney from './Chimney';
import Explosion from './Explosion';
import Spark from './Spark';
import Tank from './Tank';
import ValveTank from './ValveTank';

export const App = (props) => {
  function renderExplosion() {
    return (
      <Explosion active={props.explosion} />
    );
  }

  return (
    <div className="App">
      {renderExplosion()}
      <div className="Hab">
        <div className="OxygenTank">
          <Tank
            capacity={200}
            color="Aquamarine"
            label="O₂ Tank #1"
            level={props.oxygen.tank1}
          />
        </div>
        <div className="Hydrazine">
          <ValveTank
            capacity={300}
            color="Coral"
            label="Hydrazine"
            level={props.hydrazine}
            toggleValve={props.toggleHydrazineValve}
            valveIsOpen={props.hydrazineValveOpen}
          />
        </div>
        <div className="ChimneyAndSparker">
          <Spark active={props.sparked} fireBurning={props.fireBurning} />
          <Chimney burn={props.burnWoodShavings} />
        </div>
        <div className="WaterTank">
          <Tank
            capacity={600}
            color="CornflowerBlue"
            label="Water"
            level={props.water}
          />
        </div>
        <div className="OxygenTank">
          <Tank
            capacity={200}
            color="Aquamarine"
            label="O₂ Tank #2"
            level={props.oxygen.tank2}
          />
        </div>
      </div>
    </div>
  );
};

App.propTypes = {
  api: PropTypes.shape({
    burnWoodShavings: PropTypes.func.isRequired,
  }),
  burnWoodShavings: PropTypes.func.isRequired,
  explosion: PropTypes.bool.isRequired,
  fireBurning: PropTypes.bool.isRequired,
  hydrazine: PropTypes.number.isRequired,
  hydrazineValveOpen: PropTypes.bool.isRequired,
  hydrogen: PropTypes.number.isRequired,
  oxygen: PropTypes.shape({
    tank1: PropTypes.number.isRequired,
    tank2: PropTypes.number.isRequired,
  }).isRequired,
  sparked: PropTypes.bool.isRequired,
  toggleHydrazineValve: PropTypes.func.isRequired,
  water: PropTypes.number.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    burnWoodShavings: _.wrap(ownProps.api, bindActionCreators(burnWoodShavings, dispatch)),
    toggleHydrazineValve: bindActionCreators(toggleHydrazineValve, dispatch),
  };
};

export default connect((state) => (state), mapDispatchToProps)(App);
