import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogTitle, DialogContent, Button, DialogContentText, TextField, DialogActions } from '@material-ui/core';

class RenameLoanDialog extends Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAccept = this.handleAccept.bind(this);

    this.state = {
      name: props.oldName
    }
  }

  handleNameChange(e) {
    this.setState( {
      name: e.target.value
    });
  }

  handleAccept = () => {
    this.props.onAccept(this.state.name);
  }

  render() {
    return (
      <div>
        <Dialog open={this.props.open} onClose={this.props.onCancel}
                aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title">Rename current loan</DialogTitle>
          <DialogContent>
            <DialogContentText>Pleace, enter new name for this loan</DialogContentText>
            <TextField autofocus margin="dense" label="loan name" fullWidth value={this.state.name} onChange={this.handleNameChange}/>
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
