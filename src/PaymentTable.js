import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles';
import { Table, TableRow, TableCell, TableHead, TableBody } from '@material-ui/core';

var dateFormat = require('dateformat');

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});

var moneyFormat = (value) => Math.floor(value * 100) / 100;

function PaymentTable(props) {
  const listItems = props.payments.map((item, index) => 
    <TableRow key={index.toString()}>
      <TableCell>{index+1}.</TableCell>
      <TableCell>{dateFormat(new Date(item.periodDate), "yyyy.mm")}</TableCell>
      <TableCell>{moneyFormat(item.currentDebt)}</TableCell>
      <TableCell>{moneyFormat(item.payment)}</TableCell>
      <TableCell>{moneyFormat(item.interest)}</TableCell>
      <TableCell>{moneyFormat(item.retirement)}</TableCell>
    </TableRow>
  );
  return <Table>
    <TableHead>
      <TableRow>
        <TableCell>Period</TableCell>
        <TableCell>Date</TableCell>
        <TableCell>Loan amount</TableCell>
        <TableCell>Minimal payment</TableCell>
        <TableCell>Interests</TableCell>
        <TableCell>Debt retirement</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {listItems}
    </TableBody>
  </Table>;
}

export default withStyles(styles)(PaymentTable)
