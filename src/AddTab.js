import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';


function AddTab(props) {
  return <IconButton>
    <AddIcon {...props}/>
  </IconButton>;
}

export default AddTab;
