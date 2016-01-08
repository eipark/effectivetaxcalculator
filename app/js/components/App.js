import React from 'react/addons';
import BracketData from '../data/brackets';

export default React.createClass({

  mixins: [
    React.addons.LinkedStateMixin
  ],

  filingTypes: {
    SINGLE: "Single filers",
    JOINT_OR_WIDOW: "Married filing jointly or qualifying widow(er)",
    SEPARATE: "Married filing separately",
    HOH: "Head of household"
  },

  getInitialState() {
    return {
      year: '2015',
      taxableIncome: '50000',
      filingType: "SINGLE"
    };
  },

  rateToString({LOWER, UPPER}) {
    if (LOWER === 0) {
      return `Up to ${UPPER}`;
    } else if (UPPER === Infinity) {
      return `${LOWER} or more`;
    } else {
      return `${LOWER} - ${UPPER}`;
    }
  },

  renderBracketRangeCells(taxableIncome, filingType, rateData) {
    let classNames;
    return Object.keys(rateData).map(fileType => {
      if (filingType == fileType) {
        classNames = 'selected-file-type';
      } else {
        classNames = '';
      }
      return (<td className={classNames}>{this.rateToString(rateData[fileType])}</td>);
    });
  },

  renderBracketRows(taxableIncome, year, filingType) {
    const yearData = BracketData[year];
     let classNames;

    return Object.keys(yearData).map(rate => {
      const rateData = yearData[rate];
      const range = rateData[filingType];

      // TODO: not sure which end is inclusive or not
      if (range.LOWER <= taxableIncome && range.UPPER > taxableIncome) {
        classNames = 'selected-rate';
      } else {
        classNames = '';
      }

      return (
        <tr className={classNames}>
          <td>{rate}%</td>
          {this.renderBracketRangeCells(taxableIncome, filingType, rateData)}
        </tr>
      );
    });

  },

  renderBracketTable(taxableIncome, year, filingType) {
    return (
      <table className="bracket-table">
        <caption>2015 IRS Tax Brackets</caption>
        <thead>
          <tr>
            <th>Tax rate</th>
            <th>Single filers</th>
            <th>Married filing jointly or qualifying widow(er)</th>
            <th>Married filing separately</th>
            <th>Head of household</th>
          </tr>
        </thead>
        <tbody>
          {this.renderBracketRows(taxableIncome, year, filingType)}
        </tbody>
      </table>
    );
  },

  renderFilingTypeSelect() {
    const options = Object.keys(this.filingTypes).map(key => {
      return <option value={key}>{this.filingTypes[key]}</option>;
    });
    return (
      <label>
        Filing Status:
        <select valueLink={this.linkState('filingType')}>
          {options}
        </select>
      </label>
    );
  },

  render() {
    const {year, taxableIncome, filingType} = this.state;

    return (
      <div>
        <h1>Effective Tax Rate Calculator (United States)</h1>
        <label>
          2015 Taxable Income:
          <input type='number' valueLink={this.linkState('taxableIncome')}/>
        </label>
        {this.renderFilingTypeSelect()}
        {this.renderBracketTable(taxableIncome, year, filingType)}
      </div>
    );
  }
});
