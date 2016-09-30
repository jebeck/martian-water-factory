import superagent from 'superagent';

export default {
  burnWoodShavings: (cb) => {
    return superagent.get('http://localhost:4000/burn').end(cb);
  }
};