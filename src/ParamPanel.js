import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import FormControl from '@material-ui/core/FormControl';

function ParamPanel(props) {
  return <FormControl>
    <InputLabel>Loan amount</InputLabel>
    <Input></Input>
  </FormControl>;
}

export default ParamPanel
