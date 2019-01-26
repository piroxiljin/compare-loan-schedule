import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, AppBar, Typography, Tabs, Tab, withStyles, CircularProgress } from '@material-ui/core';
import ParamPanel from './ParamPanel';
import PaymentTable  from './PaymentTable';
import OverallInfo from './OverallInfo';
import PaymentGraph from './PaymentGraph';

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
  const loader = <CircularProgress />
  const preparePaymentTable = (payments, additionalPayments) => {
    return payments.map((item, index) => {
      var result = Object.assign(item, additionalPayments[index] );
      result.additionalPayment = additionalPayments[index] ? additionalPayments[index].value : 0;
      result.additionalPaymentEdit = additionalPayments[index] ? additionalPayments[index].editValue : 0;
      delete result.value;
      delete result.editValue;
      return result;
    } );
  }

  const paymentTableValue = preparePaymentTable(props.payments, props.additionalPayments ? props.additionalPayments : {});
  return <Grid container spacing={16} justify="center" >
    <Grid item>
      <Paper>
        <ParamPanel 
          baseLoan={props.baseLoan}
          onBaseLoanChange={props.onBaseLoanChange} 
          basePeriods={props.basePeriods}
          onBasePeriodsChange={props.onBasePeriodsChange}
          baseLoanRate={props.baseLoanRate}
          onBaseLoanRateChange={props.onBaseLoanRateChange}
          issueDate={props.issueDate}
          onIssueDateChange={props.onIssueDateChange}
          />
      </Paper>
    </Grid>
    {(props.isReady 
      && <> <Grid item>
        <Paper className={props.classes.tablePaper}>
          <PaymentTable payments={paymentTableValue}
            onAddPaymentClicked={props.onAddPaymentClicked}
            onAdditionalPaymentChanged={props.onAdditionalPaymentChanged}
            onAdditionalPaymentFocus={props.onAdditionalPaymentFocus}
            onAdditionalPaymentBlur={props.onAdditionalPaymentBlur} />
        </Paper>
      </Grid>
      <Grid item>
        <Paper className={props.classes.overallPaper}>
          <OverallInfo
                      baseMounthPayment={props.baseMounthPayment}
                      interestsOverall={props.interestsOverall}
                      baseLoan={props.baseLoan} />
        </Paper>
      </Grid>
      <Grid>
        <Paper>
          <PaymentGraph data={props.payments}/>
        </Paper>
      </Grid> </>
      ) 
    || <Grid item>{loader}</Grid> }
  </Grid>;
}

export default withStyles(styles)(LoanTask);