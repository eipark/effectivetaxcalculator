import React from 'react/addons';

export default React.createClass({

  mixins: [
    React.addons.LinkedStateMixin
  ],

  getInitialState() {
    return {
      year: '2014',
    };
  },

  render() {
    return (
      <h1>
        <input type='number' valueLink={this.linkState('year')}/> Marginal Tax Rate Calculator
        {this.state.year} ok
      </h1>
    );
  }
});
