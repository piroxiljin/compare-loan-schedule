import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles';
import { Table, TableRow, TableCell, TableHead, TableBody, IconButton, FormControl, InputLabel, Input, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

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
  currencyCell: {
    fontFamily: "Courier New",
    textAlign: "right"
  }
});

var moneyFormat = (value) => (Math.floor(value * 100) / 100).toLocaleString('ru-RU', {minimumFractionDigits: 2});

function PaymentTable(props) {
  const addPayment = (index) =>
    <IconButton>
      <AddIcon onClick={() => {
          if (typeof(props.onAddPaymentClicked) === 'function') {
            props.onAddPaymentClicked(index);
          }
        }
      }/>
    </IconButton>

  const paymentEdit = (index, value, paymentDate) =>
    <FormControl>
      <InputLabel>Additional payment for {paymentDate}</InputLabel>
      <Input value={props.baseLoanRate}
        type="number"
        value={value}
        autoFocus={true}
        onChange={(e) => { if (typeof(props.onAdditionalPaymentChanged) === 'function') {
              props.onAdditionalPaymentChanged(index, e);
            }
          }
        }
        onBlur={(e) => { if (typeof(props.onAdditionalPaymentBlur) === 'function') {
              props.onAdditionalPaymentBlur(index, e)
            }
          }
        } />
    </FormControl>

  const paymentLabel = (index, value) => 
    // <Typography className={props.classes.currencyCell}
    <div
    onClick={(e) => { if (typeof(props.onAdditionalPaymentFocus) === 'function') {
          props.onAdditionalPaymentFocus(index, e)
        }
      }
    }>{moneyFormat(value)} </div> // </Typography>

  const additionalPaymentComponent = (index, makeEdit, value, editValue, paymentDate) => {
    if (makeEdit) {
      return paymentEdit(index, editValue, paymentDate);
    } else {
      if (value > 0) {
        return paymentLabel(index, value);
      } else {
        return addPayment(index);
      }
    }
  }
    
  const listItems = props.payments.map((item, index) => 
    <TableRow key={index.toString()}>
      <TableCell>{index+1}.</TableCell>
      <TableCell>{dateFormat(new Date(item.periodDate), "mm.yyyy")}</TableCell>
      <TableCell className={props.classes.currencyCell}>{moneyFormat(item.currentDebt)}</TableCell>
      <TableCell className={props.classes.currencyCell}>{moneyFormat(item.payment)}</TableCell>
      <TableCell className={props.classes.currencyCell}>{moneyFormat(item.interest)}</TableCell>
      <TableCell className={props.classes.currencyCell}>
        {additionalPaymentComponent(index, item.makeEdit, item.additionalPayment, item.additionalPaymentEdit, dateFormat(new Date(item.periodDate), "mm.yyyy"))}
      </TableCell>
      <TableCell className={props.classes.currencyCell}>{moneyFormat(item.retirement)}</TableCell>
    </TableRow>
  );
  return <Table>
    <TableHead>
      <TableRow>
        <TableCell>Period</TableCell>
        <TableCell>Payment date</TableCell>
        <TableCell>Loan amount</TableCell>
        <TableCell>Minimal payment</TableCell>
        <TableCell>Interests</TableCell>
        <TableCell>Additional payment</TableCell>
        <TableCell>Debt retirement</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {listItems}
    </TableBody>
  </Table>;
}

export default withStyles(styles)(PaymentTable)
