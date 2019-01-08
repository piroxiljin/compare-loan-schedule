import React, { Component } from 'react'
import { Grid, Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    //width: '700',
  },
  overallCol1: {
    textAlign: 'left'
  },
  overallCol2: {
    textAlign: 'right'
  },
  moneyTypography: {
    fontFamily: "Courier New",
  }
});

var moneyFormat = (value) => (Math.floor(value * 100) / 100).toLocaleString('ru-RU', {minimumFractionDigits: 2});

function OverallInfo(props) {
  return <>
    <table>
      <tbody>
        <tr>
          <td className={props.classes.overallCol1}>
            <Typography>Base loan : </Typography>
          </td>
          <td className={props.classes.overallCol2}>
            <Typography className={props.classes.moneyTypography}>{moneyFormat(props.baseLoan)}</Typography>
          </td>
        </tr>
        <tr>
          <td className={props.classes.overallCol1}>
            <Typography>Mounth payment : </Typography>
          </td>
          <td className={props.classes.overallCol2}>
            <Typography className={props.classes.moneyTypography}>{moneyFormat(props.baseMounthPayment)}</Typography>
          </td>
        </tr>
        <tr>
          <td className={props.classes.overallCol1}>
            <Typography>Interests overall : </Typography>
          </td>
          <td className={props.classes.overallCol2}>
            <Typography className={props.classes.moneyTypography}>{moneyFormat(props.interestsOverall)}</Typography>
          </td>
        </tr>
      </tbody>
    </table>
    {/* <Grid container className={props.classes.root} direction="row" xs='auto'>
      <Grid item container direction="column">
        <Grid item>
          <Typography>Base loan : </Typography>
        </Grid>
        <Grid item>
          <Typography>Mounth payment : </Typography>
        </Grid>
        <Grid item>
          <Typography>Mounth payment : </Typography>
        </Grid>
      </Grid>
      <Grid item container direction="column">
        <Grid item>
          <Typography>{props.baseLoan}</Typography>
        </Grid>
        <Grid item>
          <Typography>{props.baseMounthPayment}</Typography>
        </Grid>
        <Grid item>
          <Typography>{props.baseMounthPayment}</Typography>
        </Grid>
      </Grid>
    </Grid> */}
  </>
}

export default withStyles(styles)(OverallInfo);
