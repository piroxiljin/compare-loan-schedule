import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ParamPanel from './ParamPanel';
import PaymentTable  from './PaymentTable';
import { Grid, Paper } from '@material-ui/core';

class App extends Component {
  constructor (props) {
    super(props);
    this.handleLoanChange = this.handleLoanChange.bind(this);

    this.state = {
      baseLoan: 1000000,
      basePeriods: 12,
      baseLoanRate: 0.10
    };
  }

  handleLoanChange(e) {
    this.setState({baseLoan: e.target.value});
  }

  render() {
    return (
      <div className="App">
        <Grid container spacing={16} justify="center">
          <Grid item>
            <Paper>
              <ParamPanel baseLoan={this.state.baseLoan}
                onBaseLoanChange={this.handleLoanChange}/>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <PaymentTable baseLoan={this.state.baseLoan}></PaymentTable>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
