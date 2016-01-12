import React from 'react/addons';
import {BracketData, getTaxValues} from '../data/brackets';
import numeral from 'numeral';

const formatCurrency = function(num) {
  return numeral(num).format('$0,0');
};

const formatPercentage = function(num) {
  return numeral(num).format('0.00%');
};


export default React.createClass({

  mixins: [
    React.addons.LinkedStateMixin
  ],

  filingTypes: {
    SINGLE: "Single",
    JOINT_OR_WIDOW: "Married filing jointly/Qualifying widow(er)",
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
      return `Up to ${formatCurrency(UPPER)}`;
    } else if (UPPER === Infinity) {
      return `${formatCurrency(LOWER)} or more`;
    } else {
      return `${formatCurrency(LOWER)} - ${formatCurrency(UPPER)}`;
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

  renderBracketRows(calculatedValues, taxableIncome, year, filingType) {
    const yearData = BracketData[year];
    let classNames;

    return Object.keys(yearData).map(rate => {
      const rateData = yearData[rate];
      const range = rateData[filingType];

      if (calculatedValues.bracket == rate) {
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

  renderBracketTable(calculatedValues, taxableIncome, year, filingType) {
    return (
      <table className="bracket-table">
        <caption>2015 IRS Tax Brackets</caption>
        <thead>
          <tr>
            <th>Tax rate</th>
            <th>Single </th>
            <th>Married filing jointly /<br />Qualifying widow(er)</th>
            <th>Married filing separately</th>
            <th>Head of household</th>
          </tr>
        </thead>
        <tbody>
          {this.renderBracketRows(calculatedValues, taxableIncome, year, filingType)}
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
        <select valueLink={this.linkState('filingType')}>
          {options}
        </select>
      </label>
    );
  },

  renderCalculation(calculatedValues, taxableIncome) {
    const calculation = calculatedValues.calculation;

    const body = calculation.map(step => {
      const {rate, lower, max, taxPaid} = step;
      return (
        <tr>
          <td>{rate/100}</td>
          <td>&times;</td>
          <td>{formatCurrency(max)}</td>
          <td>&#61;</td>
          <td>{formatCurrency(taxPaid)}</td>
        </tr>
      );
    });

    return (
      <table className='rate-calculation-table'>
        <caption>How your effective tax rate is calculated based on {formatCurrency(taxableIncome)} taxable income</caption>
        <thead>
          <tr>
            <th>Rate</th>
            <th>&times;</th>
            <th>Amount</th>
            <th>&#61;</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {body}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className='rate-calculation-total-label'>Total Tax Paid</td>
            <td>&#61;</td>
            <td className='rate-calculation-total'>
              {formatCurrency(calculatedValues.totalTaxPaid)}
            </td>
          </tr>
        </tfoot>
      </table>
    );

  },

  renderCalculatedValues(calculatedValues, taxableIncome) {
    return (
      <div className='calculated-values'>
        <div>
          Effective Tax Rate: {formatPercentage(calculatedValues.effectiveRate)}
        </div>
        <div>
          Tax Bracket: {calculatedValues.bracket}%
        </div>
        <div>
          Total tax paid: {formatCurrency(calculatedValues.totalTaxPaid)}
        </div>
        {this.renderCalculation(calculatedValues, taxableIncome)}

      </div>
    );
  },

  render() {
    const {year, taxableIncome, filingType} = this.state;
    console.log(getTaxValues(year, taxableIncome, filingType));
    const calculatedValues = getTaxValues(year, taxableIncome, filingType);

    return (
      <div>
        <h1>Effective Tax Rate Calculator (United States)</h1>
        <div className='inputs-to-calculation'>
          <label>
            In <strong>2015</strong>, a <strong>taxable income</strong> of $
            <input type='number' valueLink={this.linkState('taxableIncome')}/>
          </label>
            filed as
          {this.renderFilingTypeSelect()}
          would result in ...
        </div>


        <div className='row'>
          {this.renderCalculatedValues(calculatedValues, taxableIncome)}
          {this.renderBracketTable(calculatedValues, taxableIncome, year, filingType)}
        </div>

        <div className='description'>
          This calculator is based only on your taxable income. It does not factor in deductions, exemptions, or other considerations.<br />
          Read more about the  <a href='http://www.investopedia.com/ask/answers/05/marginaltaxrate.asp' target="_blank">marginal tax rate system</a>.
        </div>
      </div>
    );
  },
});
