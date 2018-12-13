import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogTitle, DialogContent, Button, DialogContentText, TextField, DialogActions } from '@material-ui/core';

class RenameLoanDialog extends Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleNameChange(e) {
    this.props.onNameChanged(e.target.value);
  }

  handleAccept = () => {
    this.props.onAccept(this.props.name);
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleAccept();
    }
  }

  render() {
    return (
      <div>
        <Dialog open={this.props.open} onClose={this.props.onCancel}
                aria-labelledby="responsive-dialog-title" onKeyPress={this.handleKeyPress}>
          <DialogTitle id="responsive-dialog-title">Rename current loan</DialogTitle>
          <DialogContent>
            <DialogContentText>Pleace, enter new name for this loan</DialogContentText>
            <TextField autoFocus margin="dense" label="loan name" fullWidth value={this.props.name} onChange={this.handleNameChange}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onCancel} color="primary">Cancel</Button>
            <Button onClick={this.handleAccept} color="primary">Rename</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default RenameLoanDialog;
