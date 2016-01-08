const BracketData = {
  2015: {
    "10": {
      SINGLE: {
        LOWER: 0,
        UPPER: 9225,
      },
      JOINT_OR_WIDOW: {
        LOWER: 0,
        UPPER: 18450
      },
      SEPARATE: {
        LOWER: 0,
        UPPER: 9225
      },
      HOH: {
        LOWER: 0,
        UPPER: 13150
      }
    },
    "15": {
      SINGLE: {
        LOWER: 9226,
        UPPER: 37450
      },
      JOINT_OR_WIDOW: {
        LOWER: 18451,
        UPPER: 74900
      },
      SEPARATE: {
        LOWER: 9226,
        UPPER: 37450
      },
      HOH: {
        LOWER: 13151,
        UPPER: 50200
      }
    },
    "25": {
      SINGLE: {
        LOWER: 37451,
        UPPER: 90750
      },
      JOINT_OR_WIDOW: {
        LOWER: 74901,
        UPPER: 151200
      },
      SEPARATE: {
        LOWER: 37451,
        UPPER: 75600
      },
      HOH: {
        LOWER: 50201,
        UPPER: 129600
      }
    },
    "28": {
      SINGLE: {
        LOWER: 90751,
        UPPER: 189300
      },
      JOINT_OR_WIDOW: {
        LOWER: 151201,
        UPPER: 230450
      },
      SEPARATE: {
        LOWER: 75601,
        UPPER: 115225
      },
      HOH: {
        LOWER: 129601,
        UPPER: 209850
      }
    },
    "33": {
      SINGLE: {
        LOWER: 189301,
        UPPER: 411500
      },
      JOINT_OR_WIDOW: {
        LOWER: 230451,
        UPPER: 411500
      },
      SEPARATE: {
        LOWER: 115226,
        UPPER: 205750
      },
      HOH: {
        LOWER: 209851,
        UPPER: 411500
      }
    },
    "35": {
      SINGLE: {
        LOWER: 411501,
        UPPER: 413200
      },
      JOINT_OR_WIDOW: {
        LOWER: 411501,
        UPPER: 464850
      },
      SEPARATE: {
        LOWER: 205751,
        UPPER: 232425
      },
      HOH: {
        LOWER: 411501,
        UPPER: 439000
      }
    },
    "39.6": {
      SINGLE: {
        LOWER: 413201,
        UPPER: Infinity
      },
      JOINT_OR_WIDOW: {
        LOWER: 464851,
        UPPER: Infinity
      },
      SEPARATE: {
        LOWER: 232426,
        UPPER: Infinity
      },
      HOH: {
        LOWER: 439001,
        UPPER: Infinity
      }
    },
  }
};

const getTaxValues = function(year, taxableIncome, filingType) {
  let totalTaxPaid = 0;
  let bracket;
  let calculation = [];

  /*
    calculation = [
      [{rate, lower, upper, totalTaxPaid}]
    ]
  */

  const yearData = BracketData[year];
  Object.keys(yearData).some(rate => {
    const rateData = yearData[rate];
    const range = rateData[filingType];

    const taxPaidInStep = (Math.min(taxableIncome, range.UPPER) - range.LOWER) * (rate/100);
    totalTaxPaid += taxPaidInStep;

    calculation.push({
      rate,
      lower: range.LOWER,
      upper: range.UPPER,
      taxPaid: taxPaidInStep

    })
    if (range.LOWER <= taxableIncome && range.UPPER >= taxableIncome) {
      bracket = rate;
      return true; // short circuit the some
    } else {
      return false;
    }
  });

  const effectiveRate = totalTaxPaid / taxableIncome;

  return {
    totalTaxPaid,
    effectiveRate,
    bracket,
    calculation
  }
}

export default {
  BracketData,
  getTaxValues
}
