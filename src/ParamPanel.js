import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import FormControl from '@material-ui/core/FormControl';
import { Grid } from '@material-ui/core';

function ParamPanel(props) {
    return <Grid container spacing={8}>
      <Grid item>
        <FormControl>
          <InputLabel>Loan amount</InputLabel>
          <Input value={props.baseLoan}
            type="number"
            onChange={props.onBaseLoanChange} />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <InputLabel>Loan duration</InputLabel>
          <Input value={props.basePeriods}
            type="number"
            onChange={props.onBasePeriodsChange} />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <InputLabel>Loan rate</InputLabel>
          <Input value={props.baseLoanRate}
            type="number"
            onChange={props.onBaseLoanRateChange} />
        </FormControl>
      </Grid>
    </Grid>
}


export default ParamPanel
