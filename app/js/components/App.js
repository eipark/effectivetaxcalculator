import React from 'react/addons';

export default React.createClass({

  mixins: [
    React.addons.LinkedStateMixin
  ],

  getInitialState() {
    return {
      year: '2015',
    };
  },

  render() {
    return (
      <h1>
        <input type='number' valueLink={this.linkState('year')}/> <h1>Effective Tax Rate Calculator</h1>
        {this.state.year} sdfs
      </h1>
    );
  }
});
