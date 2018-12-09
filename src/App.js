import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ParamPanel from './ParamPanel';
import PaymentTable  from './PaymentTable';
import { Grid, Paper } from '@material-ui/core';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Grid container spacing={16} justify="center">
          <Grid item>
            <Paper>
              <ParamPanel />
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <PaymentTable></PaymentTable>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
