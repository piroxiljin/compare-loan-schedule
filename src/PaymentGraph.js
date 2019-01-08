import React, { Component } from 'react'
import { Chart, SplineSeries, ValueAxis, ArgumentAxis, LineSeries, Legend } from '@devexpress/dx-react-chart-material-ui';
import { ValueScale } from '@devexpress/dx-react-chart';

function PaymentGraph(props) {
  return <Chart data={props.data} width={650} height={500}>
    <ValueScale name="payment" />
    <ValueScale name="debt" />

    <ArgumentAxis showGrid={true} />
    <ValueAxis name="Mounthly" scaleName="payment" showGrid={true} showLine showTicks />
    <ValueAxis name="Overall" scaleName="debt" position="right" showGrid={false} showLine showTicks />

    <LineSeries name="Payment" scaleName="payment" valueField="payment" argumentField="paymentNumber" />
    <LineSeries name="Interest" scaleName="payment" valueField="interest" argumentField="paymentNumber" />
    <LineSeries name="Retirement" scaleName="payment" valueField="retirement" argumentField="paymentNumber" />
    <LineSeries name="Debt" scaleName="debt" valueField="currentDebt" argumentField="paymentNumber" />
    <Legend />
  </Chart>
}

export default PaymentGraph;
