import React, { Component, PropTypes } from 'react';
import update from 'react-addons-update';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      explosion: false,
      fireBurning: false,
      // need 300L O₂ to make 600L water
      oxygen: {
        tank1: 144,
        tank2: 179,
      },
      // 300L hydrazine capable of making 600L water
      hydrazine: 300,
      hydrazineValveOpen: false,
      water: 0,
      hydrogen: 0,
    };
    this.burnWoodShavings = this.burnWoodShavings.bind(this);
    this.toggleHydrazineValve = this.toggleHydrazineValve.bind(this);
  }

  static defaultProps = {
    intervals: {
      dihydrogenMonoxideViaCombustion: 125,
      hydrazineDrip: 150,
      staticElectricity: 500,
    },
  };

  static propTypes = {
    intervals: PropTypes.shape({
      dihydrogenMonoxideViaCombustion: PropTypes.number.isRequired,
      hydrazineDrip: PropTypes.number.isRequired,
      staticElectricity: PropTypes.number.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    this.staticElectricity = setInterval(() => {
      if (this.state.hydrogen > 25) {
        this.setState({
          explosion: true,
          fireBurning: false,
          hydrazineValveOpen: false,
        });
        clearInterval(this.dihydrogenMonoxideViaCombustion);
        clearInterval(this.hydrazineDrip);
      }
    }, this.props.intervals.staticElectricity);
  }

  readyToCombust() {
    return this.state.hydrogen > 1 && this.totalOxygen() > 25;
  }

  totalOxygen() {
    return this.state.oxygen.tank1 + this.state.oxygen.tank2;
  }

  burnWoodShavings() {
    if (!this.state.fireBurning && this.readyToCombust()) {
      this.setState({
        fireBurning: true,
      }, () => {
        this.dihydrogenMonoxideViaCombustion = setInterval(() => {
          if (this.readyToCombust()) {
            this.setState({
              hydrogen: this.state.hydrogen - 0.8,
              oxygen: update(
                this.state.oxygen,
                {
                  tank1: { $apply: (val) => (val - 0.5) },
                  tank2: { $apply: (val) => (val + 0.1) },
                }
              ),
              water: this.state.water + 0.8,
            });
          } else {
            clearInterval(this.dihydrogenMonoxideViaCombustion);
            this.setState({
              fireBurning: false,
            });
          }
        }, this.props.intervals.dihydrogenMonoxideViaCombustion);
      });
    }
  }

  toggleHydrazineValve() {
    if (this.state.hydrazineValveOpen) {
      clearInterval(this.hydrazineDrip);
      this.hydrazineDrip = null;
      this.setState({
        hydrazineValveOpen: false,
      });
    } else {
      this.setState({
        hydrazineValveOpen: true,
      }, () => {
        this.hydrazineDrip = setInterval(() => {
          if (this.state.hydrogen < 23) {
            this.setState({
              hydrazine: this.state.hydrazine - 1,
              hydrogen: this.state.hydrogen + 2,
            });
          } else {
            clearInterval(this.hydrazineDrip);
            this.setState({
              hydrazineValveOpen: false,
            });
          }
        }, this.props.intervals.hydrazineDrip);
      });
    }
  }

  renderExplosion() {
    if (this.state.explosion) {
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
            <p>{`${Math.round(this.state.oxygen.tank1)}L`}</p>
          </div>
          <div className="Hydrazine">
            <h3>Hydrazine</h3>
            <p>{`${this.state.hydrazine}L`}</p>
            <button onClick={this.toggleHydrazineValve}>
              {this.state.hydrazineValveOpen ? 'Close Valve' : 'Open Valve'}
            </button>
          </div>
          <div className="Chimney">
            <button onClick={this.burnWoodShavings}>Burn Wood Shavings</button>
          </div>
          <div className="WaterTank">
            <h3>Water</h3>
            <p>{`${Math.round(this.state.water)}L`}</p>
          </div>
          <div className="OxygenTank">
            <h3>O₂ Tank #2</h3>
            <p>{`${Math.round(this.state.oxygen.tank2)}L`}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
