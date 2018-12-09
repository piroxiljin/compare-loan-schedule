import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles';
import { Table, TableRow, TableCell, TableHead, TableBody } from '@material-ui/core';

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


function PaymentTable(props) {
  const numbers = [1, 2, 3, 4, 5];
  const listItems = numbers.map((number) => 
    <TableRow key={number.toString()}>
      <TableCell>{number}</TableCell>
      <TableCell>0</TableCell>
      <TableCell>0</TableCell>
      <TableCell>0</TableCell>
      <TableCell>0</TableCell>
    </TableRow>
  );
  return <Table>
    <TableHead>
      <TableRow>
        <TableCell>Period</TableCell>
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
