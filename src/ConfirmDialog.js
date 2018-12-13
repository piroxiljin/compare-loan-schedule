import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Button } from '@material-ui/core';

function ConfirmDialog(props) {
  return <div>
    <Dialog open={props.open} onClose={props.onCancel}>
      <DialogTitle>
        Confirm deletion of {props.name}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete {props.name} ?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel} color="primary">Cancel</Button>
        <Button onClick={props.onAccept} color="primary">Delete</Button>
      </DialogActions>
    </Dialog>
  </div>
}

export default ConfirmDialog;
