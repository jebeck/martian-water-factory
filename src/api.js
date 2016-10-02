import superagentPromisePlugin from 'superagent-promise-plugin';
const superagent = superagentPromisePlugin.patch(require('superagent'));

export default {
  burnWoodShavings: (cb) => {
    return superagent.get('http://localhost:4000/burn');
  }
};