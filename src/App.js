import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { burnWoodShavings, toggleHydrazineValve } from './state';

import './App.css';

export class App extends Component {
  static propTypes = {
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

  renderExplosion() {
    if (this.props.explosion) {
      return (
        <h1 className="Explosion"><marquee>BOOM! BOOM! BOOM!</marquee></h1>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="App">
        <div className="Hab">
          {this.renderExplosion()}
          <div className="OxygenTank">
            <h3>O₂ Tank #1</h3>
            <p>{`${Math.round(this.props.oxygen.tank1)}L`}</p>
          </div>
          <div className="Hydrazine">
            <h3>Hydrazine</h3>
            <p>{`${this.props.hydrazine}L`}</p>
            <button onClick={this.props.toggleHydrazineValve}>
              {this.props.hydrazineValveOpen ? 'Close Valve' : 'Open Valve'}
            </button>
          </div>
          <div className="Chimney">
            <button onClick={this.props.burnWoodShavings}>Burn Wood Shavings</button>
          </div>
          <div className="WaterTank">
            <h3>Water</h3>
            <p>{`${Math.round(this.props.water)}L`}</p>
          </div>
          <div className="OxygenTank">
            <h3>O₂ Tank #2</h3>
            <p>{`${Math.round(this.props.oxygen.tank2)}L`}</p>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    burnWoodShavings: _.wrap(ownProps.api, bindActionCreators(burnWoodShavings, dispatch)),
    toggleHydrazineValve: bindActionCreators(toggleHydrazineValve, dispatch),
  };
};

export default connect((state) => (state), mapDispatchToProps)(App);
