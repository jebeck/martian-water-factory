import React, { Component } from 'react';
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
      staticElectricity: 5000,
      hydrazineDrip: 1500,
      dihydrogenMonoxideViaCombustion: 1250,
    },
    rate: 10,
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

  burnWoodShavings() {
    if (!this.state.fireBurning) {
      this.setState({
        fireBurning: true,
      }, () => {
        this.dihydrogenMonoxideViaCombustion = setInterval(() => {
          if (this.state.hydrogen >= this.props.rate &&
            (this.state.oxygen.tank1 + this.state.oxygen.tank2) >= 25) {
            this.setState({
              hydrogen: this.state.hydrogen - (0.8 * this.props.rate),
              oxygen: update(
                this.state.oxygen,
                {
                  tank1: { $apply: (val) => (val - (0.5 * this.props.rate)) },
                  tank2: { $apply: (val) => (val + (0.1 * this.props.rate)) },
                }
              ),
              water: this.state.water + (0.8 * this.props.rate),
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
          this.setState({
            hydrazine: this.state.hydrazine - this.props.rate,
            hydrogen: this.state.hydrogen + 2 * this.props.rate,
          });
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
