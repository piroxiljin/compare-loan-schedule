import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import FormControl from '@material-ui/core/FormControl';

class ParamPanel extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(e) {
    this.setState({});
  }

  render() {
    const baseLoan = this.props.baseLoan;
    return <FormControl>
      <InputLabel>Loan amount</InputLabel>
      <Input value={baseLoan} onChange={this.props.onBaseLoanChange} />
    </FormControl>
  }
}


export default ParamPanel
