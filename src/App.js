import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { burnWoodShavings, toggleHydrazineValve } from './state';

import './App.css';

export const App = (props) => {
  function renderExplosion() {
    if (props.explosion) {
      return (
        <h1 className="Explosion"><marquee>BOOM! BOOM! BOOM!</marquee></h1>
      );
    }
    return null;
  }

  return (
    <div className="App">
      <div className="Hab">
        {renderExplosion()}
        <div className="OxygenTank">
          <h3>O₂ Tank #1</h3>
          <p>{`${Math.round(props.oxygen.tank1)}L`}</p>
        </div>
        <div className="Hydrazine">
          <h3>Hydrazine</h3>
          <p>{`${props.hydrazine}L`}</p>
          <button onClick={props.toggleHydrazineValve}>
            {props.hydrazineValveOpen ? 'Close Valve' : 'Open Valve'}
          </button>
        </div>
        <div className="Chimney">
          <button onClick={props.burnWoodShavings}>Burn Wood Shavings</button>
        </div>
        <div className="WaterTank">
          <h3>Water</h3>
          <p>{`${Math.round(props.water)}L`}</p>
        </div>
        <div className="OxygenTank">
          <h3>O₂ Tank #2</h3>
          <p>{`${Math.round(props.oxygen.tank2)}L`}</p>
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
