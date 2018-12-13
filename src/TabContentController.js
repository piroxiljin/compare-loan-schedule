import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid, Tabs, Tab, withStyles, IconButton } from '@material-ui/core';
import AddTab from './AddTab';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import RenameLoanDialog from './RenameLoanDialog';

const styles = theme => ( {
  tabPanel: {
    marginTop: 48
  },
  delButtonContainer: {
    position: 'absolute',
    right: theme.spacing.unit * 2,
    top: 48
  }
});

class TabContentController extends Component {
  constructor(props) {
    super(props);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleRenameTabClick = this.handleRenameTabClick.bind(this);
    this.handleRenameTabCancel = this.handleRenameTabCancel.bind(this);
    this.handleRenameTabAccept = this.handleRenameTabAccept.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleTabDoubleClick = this.handleTabDoubleClick.bind(this);

    this.state = {
      renameTab: false,
      renameTabDraft: ""
    }
  }

  handleTabChange = (event, value) => {
    const activePage = this.props.pages[this.props.activePage];
    this.setState({
      renameTabDraft: activePage.title
    });
    this.props.onTabChange(value);
  }

  handleRenameTabClick() {
    const activePage = this.props.pages[this.props.activePage];
    this.setState({
      renameTab: true,
      renameTabDraft: activePage.title
    });
  }

  handleTabDoubleClick() {
    const activePage = this.props.pages[this.props.activePage];
    this.setState({
      renameTab: true,
      renameTabDraft: activePage.title
    });
  }

  handleRenameTabCancel() {
    const activePage = this.props.pages[this.props.activePage];
    this.setState({
      renameTab: false,
      renameTabDraft: activePage.title
    });
  }

  handleRenameTabAccept(newName) {
    this.props.onRenameTab(newName);
    this.setState({
      renameTab: false
    });
  }

  handleNameChange(newName) {
    this.setState({
      renameTabDraft: newName
    });
  }

  render() {
    const activePage = this.props.pages[this.props.activePage];

    const tabList = this.props.pagesIds.map((pageId, index) => {
      return <Tab label={this.props.pages[pageId].title} value={pageId} key={pageId} onDoubleClick={this.handleTabDoubleClick}/>
    });

    return(
    <>
      <Grid container direction="row" className={this.props.classes.tabPanel}>
        <Grid item>
          <Grid container direction="row">
            <Grid item>
              <Tabs value={this.props.activePage} onChange={this.handleTabChange}>
                {tabList}
              </Tabs>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <AddTab onClick={this.props.onAddTabClicked}></AddTab>
        </Grid>  {/* outer item */}
        <Grid container direction="row">
          <Grid item>
            <div className={this.props.classes.delButtonContainer}>
              <IconButton onClick={this.handleRenameTabClick}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={this.props.onDeleteTabClicked}>
                <DeleteIcon />
              </IconButton>
            </div>
          </Grid> {/* button item */}
        </Grid> {/* button container*/}
      </Grid>
      <RenameLoanDialog open={this.state.renameTab}
        name={this.state.renameTabDraft}
        onCancel={this.handleRenameTabCancel}
        onAccept={this.handleRenameTabAccept} 
        onNameChanged={this.handleNameChange}/>
    </>
    )
  } 
}


export default withStyles(styles)(TabContentController);
