import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, AppBar, Typography, Tabs, Tab, withStyles } from '@material-ui/core';
import ParamPanel from './ParamPanel';
import PaymentTable  from './PaymentTable';

const styles = theme => ({
  root: {
    marginTop: 16,
  },
  tablePaper: {
    height: 700,
    overflowY: 'auto',
  }
});

function LoanTask(props) {
  return <Grid container spacing={16} justify="center" className={props.classes.root}>
    <Grid item>
      <Paper>
        <ParamPanel 
          baseLoan={props.baseLoan}
          onBaseLoanChange={props.onBaseLoanChange} 
          basePeriods={props.basePeriods}
          onBasePeriodsChange={props.onBasePeriodsChange}
          baseLoanRate={props.baseLoanRate}
          onBaseLoanRateChange={props.onBaseLoanRateChange}
          />
      </Paper>
    </Grid>
    <Grid item>
      <Paper className={props.classes.tablePaper}>
        <PaymentTable payments={props.payments} />
      </Paper>
    </Grid>
  </Grid>;
}

export default withStyles(styles)(LoanTask);