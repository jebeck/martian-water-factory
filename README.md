# martian-water-factory

[![CircleCI](https://circleci.com/gh/jebeck/martian-water-factory.svg?style=svg)](https://circleci.com/gh/jebeck/martian-water-factory)

A not-so-simple example application to demonstrate some React application testing techniques, inspired by the water production process designed by Mark Watney in Andy Weir's novel *The Martian*.

## context

This project is a companion to my talk "High-stakes React" from [ReactNL](http://reactnl.org/ 'ReactNL') in October 2016. The [slides](http://janabeck.com/high-stakes-react/ 'High-stakes React') from that talk should be useful as a walk-through of what the code in this repository is intended to demonstrate.

## running the example(s)

To start, clone this repository, then navigate inside the cloned directory `martian-water-factory/` and install the dependencies with:

```bash
$ npm install
```

(You must have `node` and `npm` installed in order to run the examples. Refer to [the Node website](https://nodejs.org/) for installation instructions if you don't already have these installed.)

To run the app in order to understand the functionality being tested, use:

```bash
$ npm start
```

To run the tests, use:

```bash
$ npm test
```

**NB:** On some branches, the tests *fail* intentionally!
