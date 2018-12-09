import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ParamPanel from './ParamPanel';
import PaymentTable  from './PaymentTable';
import { Grid, Paper } from '@material-ui/core';

class App extends Component {
  constructor (props) {
    super(props);
    this.handleBaseLoanChange = this.handleBaseLoanChange.bind(this);
    this.handleBasePeriodsChange = this.handleBasePeriodsChange.bind(this);
    this.handleBaseLoanRateChange = this.handleBaseLoanRateChange.bind(this);

    this.state = {
      baseLoan: 1000000,
      basePeriods: 1,
      baseLoanRate: 0.10,
      baseDate: "2018-12"
    };
  }

  handleBaseLoanChange(e) {
    if (! isNaN(e.target.value)) {
      this.setState({baseLoan: e.target.value});
    } else {
      this.setState({baseLoan: this.state.baseLoan});
    }
  }

  handleBasePeriodsChange(e) {
    if (! isNaN(e.target.value)) {
      this.setState({basePeriods: e.target.value});
    } else {
      this.setState({basePeriods: this.state.basePeriods});
    }
  }

  handleBaseLoanRateChange(e) {
    if (! isNaN(e.target.value)) {
      this.setState({baseLoanRate: e.target.value});
    } else {
      this.setState({baseLoanRate: this.state.baseLoanRate});
    }
  }

  calculateSchedule(loanParams) {
    var payments = [];
    const currentYearRate = loanParams.baseLoanRate;
    var currentDebt = loanParams.baseLoan;
    var restPeriods = loanParams.basePeriods * 12;
    var iteration = 200;
    var currentYear = new Date(loanParams.baseDate).getYear() + 1900;
    var currentMonth = new Date(loanParams.baseDate).getMonth();

    var dayOfYears = [365, 365, 365, 366];
    var getDaysInYear = (year) => dayOfYears[year % 4];
    var getDaysInMonth = function(month,year) {
      return new Date(year, month, 0).getDate();
    };

    while (currentDebt >= 0.01 && iteration-- > 0) {
      const monthRate = currentYearRate / getDaysInYear(currentYear) * getDaysInMonth(currentYear, currentMonth);
      const mounthRateRought = currentYearRate / 12.0;
      const tempRateK = Math.pow((1.0 + mounthRateRought), restPeriods);
      const k = mounthRateRought * tempRateK / (tempRateK - 1.0);
      var payment = currentDebt * k;
      const interest = currentDebt * monthRate;
      var retirement = payment - interest;
      if (currentDebt - retirement < 300) {
        payment = interest + currentDebt;
        retirement = currentDebt;
      }
      console.log(payments.length + ". " 
        + currentDebt + ": " 
        + interest + " + " 
        + retirement + " = "
        + payment);
      payments.push({
        currentDebt: currentDebt,
        periodDate: currentYear + "-" + (currentMonth+1),
        payment: payment,
        interest: interest,
        retirement: retirement
      });
      
      currentMonth += 1;
      if (currentMonth >= 12) {
        currentMonth = currentMonth % 12;
        currentYear += 1;
      }
      currentDebt -= retirement;
      restPeriods -= 1;
    }
    return payments;
  }

  render() {
    var payments = this.calculateSchedule({
      baseLoanRate: this.state.baseLoanRate,
      baseDate: this.state.baseDate,
      baseLoan: this.state.baseLoan,
      basePeriods: this.state.basePeriods
    });

    return (
      <div className="App">
        <Grid container spacing={16} justify="center">
          <Grid item>
            <Paper>
              <ParamPanel 
                baseLoan={this.state.baseLoan}
                onBaseLoanChange={this.handleBaseLoanChange} 
                basePeriods={this.state.basePeriods}
                onBasePeriodsChange={this.handleBasePeriodsChange}
                baseLoanRate={this.state.baseLoanRate}
                onBaseLoanRateChange={this.handleBaseLoanRateChange}
                />
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <PaymentTable baseLoan={this.state.baseLoan} 
                payments={payments} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
