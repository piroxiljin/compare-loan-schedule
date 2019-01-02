import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Grid, Paper, AppBar, Typography, Tabs, Tab, Zoom, Fab, withStyles, IconButton, NoSsr } from '@material-ui/core';
import LoanTask from './LoanTask';
import RenameLoanDialog from './RenameLoanDialog';
import TabContentController from './TabContentController';
import { calculateSchedule } from './loanUtils';


var objectHash = require('object-hash');
var deepEqual = require('deep-equal');

const styles = theme => ( {
  
});

function uniqueID(){
  function chr4(){
    return Math.random().toString(16).slice(-4);
  }
  return chr4() + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() + chr4() + chr4();
}

class App extends Component {
  constructor (props) {
    super(props);
    this.handleBaseLoanChange = this.handleBaseLoanChange.bind(this);
    this.handleBasePeriodsChange = this.handleBasePeriodsChange.bind(this);
    this.handleBaseLoanRateChange = this.handleBaseLoanRateChange.bind(this);
    this.handleIssueDateChange = this.handleIssueDateChange.bind(this);
    this.handleAddLoanTask = this.handleAddLoanTask.bind(this);
    this.handleRemoveLoanTask = this.handleRemoveLoanTask.bind(this);
    this.handleRenameLoan = this.handleRenameLoan.bind(this);
    this.updateContent = this.updateContent.bind(this);

    var pages = {};
    var pagesIds = [];
    var activePage = "";
    
    try {
      var restoredPages = JSON.parse(localStorage.getItem("pages") );
      var restoredPagesIds = JSON.parse(localStorage.getItem("pagesIds") );
      var restoredActivePage = localStorage.getItem("activePage");
      pages = restoredPages;
      pagesIds = restoredPagesIds;
      activePage = restoredActivePage;
    } catch(e) {
      console.log("catch while parse stored items: " + e.what());
      pages = {};
      pagesIds = [];
      activePage = "";
    }

    if (pages[activePage] === undefined && pagesIds.length > 0) {
      activePage = pagesIds[0];
    }

    this.state = {
      baseLoan: 1000000,
      basePeriods: 1,
      baseLoanRate: 0.10,
      issueDate: new Date().toString(),
      activePage: activePage || "",
      pages: pages || {},
      pagesIds: pagesIds || [],
      renameLoan: false
    };
  }

  componentDidMount() {
    this.updateContent();
  }

  handleBaseLoanChange(e) {
    var pages = this.state.pages;
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];

    if (! isNaN(e.target.value)) {
      currentPage["baseLoan"] = e.target.value;
    }
    currentPage.isReady = false;
    pages[activePageId] = currentPage;
    this.setState({
      pages: pages
    });

    this.updateContent();
  }

  handleBasePeriodsChange(e) {
    var pages = this.state.pages;
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];

    if (! isNaN(e.target.value)) {
      currentPage["basePeriods"] = e.target.value;
    }
    currentPage.isReady = false;

    pages[activePageId] = currentPage;
    this.setState({
      pages: pages
    });

    this.updateContent();
  }

  handleBaseLoanRateChange(e) {
    var pages = this.state.pages;
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];

    if (! isNaN(e.target.value)) {
      currentPage["baseLoanRate"] = e.target.value;
    }
    currentPage.isReady = false;

    pages[activePageId] = currentPage;
    this.setState({
      pages: pages
    });

    this.updateContent();
  }

  handleIssueDateChange(e) {
    var pages = this.state.pages;
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];

    currentPage["issueDate"] = e.target.value;
    currentPage.isReady = false;

    pages[activePageId] = currentPage;
    this.setState({
      pages: pages
    });

    this.updateContent();
  }

  handleAddLoanTask() {
    var pages = this.state.pages;
    var pagesIds = this.state.pagesIds;

    const newId = uniqueID();
    pagesIds.push(newId);
    pages[newId] = {title: "new loan", id: newId,
      baseLoanRate: this.state.baseLoanRate,
      issueDate: this.state.issueDate,
      baseLoan: this.state.baseLoan,
      basePeriods: this.state.basePeriods,
      isReady: false,
    };
    this.setState({
      pages: pages,
      pagesIds: pagesIds,
      activePage: newId,
    });

    this.updateContent();
  }

  handleRemoveLoanTask() {
    var pages = this.state.pages;
    var pagesIds = this.state.pagesIds;
    var activePageId = this.state.activePage;
    var activeIndex = pagesIds.indexOf(activePageId);
    var newPagesIds = pagesIds.filter((id) => id != activePageId);
    pages[activePageId] = undefined;

    activeIndex = activeIndex < 0 ? 0 : 
    activeIndex > newPagesIds.length - 1 ? newPagesIds.length - 1 : activeIndex;

    this.setState({
      pages: pages,
      pagesIds: newPagesIds,
      activePage: newPagesIds[activeIndex]
    });

    this.updateContent();
  }

  handleRenameLoan(newName) {
    var activePage = this.state.activePage;
    var pages = this.state.pages;
    var page = pages[activePage];
    page.title = newName;

    pages[activePage] = page;
    this.setState({
      pages: pages,
    });
    
    this.updateContent();
  }

  handleTabChange = (value) => {
    this.setState({
      activePage: value,
    });

    this.updateContent();
  }

  preparePayments(loanDesc) {
    //const loanKey = objectHash(loanDesc);
    //const loanDeskKey = loanKey + '-desc';
    //var storedLoanDesc = JSON.parse(sessionStorage.getItem(loanDeskKey) );

    var payments;
    //if (storedLoanDesc && deepEqual(loanDesc, storedLoanDesc)) {
      //payments = JSON.parse(sessionStorage.getItem(loanKey));
    //}

    //if (!payments) {
      payments = calculateSchedule(loanDesc);
      //sessionStorage.setItem(loanDeskKey, JSON.stringify(loanDesc));
      //sessionStorage.setItem(loanKey, JSON.stringify(payments));
    //}
    return payments;
  }

  updateContent() {
    this.setState((state, props) => {
      var pages = state.pages;
      var pagesIds = state.pagesIds;
      var activePageId = state.activePage;
      var currentPage = pages[activePageId];

      var pagesStr = JSON.stringify(pages);
      localStorage.setItem("pages", pagesStr);
      var idsStr = JSON.stringify(pagesIds);
      localStorage.setItem("pagesIds", idsStr);
      localStorage.setItem("activePage", activePageId);

      const loanDesc = {
        title: currentPage ? currentPage.title : 'New loan', 
        baseLoanRate: currentPage ? currentPage.baseLoanRate : state.baseLoanRate, 
        issueDate: currentPage ? currentPage.issueDate : state.issueDate,
        baseLoan: currentPage ? currentPage.baseLoan : state.baseLoan,
        basePeriods: currentPage ? currentPage.basePeriods : state.basePeriods
      };

      var calcResults = this.preparePayments(loanDesc);
      // paymentsPromise.then((function() {
      //   const localPageId = activePageId;
      //   return function(payments) {
      //     this.setState((state, props) => {
      //       var currentPage = state.pages[localPageId];
      
      //       currentPage.isReady = true;
      //       currentPage.payments = payments;
      //       pages[activePageId] = currentPage;
      //       return {
      //         pages: pages
      //       }
      //     });
      //   }
      // })().bind(this), function() {
      //   console.log("Payment promise rejected");
      // });
      currentPage.payments = calcResults.payments;
      currentPage.baseMounthPayment = calcResults.baseMounthPayment;
      currentPage.interestsOverall = calcResults.interestsOverall;
      currentPage.isReady = true;
      pages[activePageId] = currentPage;
      return {
        pages: pages
      }
    });
  }

  render() {
    var pages = this.state.pages;
    var pagesIds = this.state.pagesIds;
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];

    const payments = currentPage && currentPage.payments;
    const contentIsReady = currentPage && currentPage.isReady;
    
    const content = currentPage && <LoanTask baseLoan={currentPage.baseLoan} 
                              onBaseLoanChange={this.handleBaseLoanChange}
                              basePeriods={currentPage.basePeriods}
                              onBasePeriodsChange={this.handleBasePeriodsChange}
                              baseLoanRate={currentPage.baseLoanRate}
                              onBaseLoanRateChange={this.handleBaseLoanRateChange}
                              issueDate={currentPage.issueDate}
                              onIssueDateChange={this.handleIssueDateChange}
                              isReady={contentIsReady} payments={payments}
                              baseMounthPayment={currentPage.baseMounthPayment}
                              interestsOverall={currentPage.interestsOverall} />;
    
    return (
        <div className="App">
          <AppBar color="primary">
            <Typography variant="h3" color="textPrimary">
              Loan calculator
            </Typography>
          </AppBar>
          <TabContentController pagesIds={this.state.pagesIds}
            pages={this.state.pages} 
            activePage={this.state.activePage}
            onTabChange={this.handleTabChange}
            onRenameTab={this.handleRenameLoan} 
            onAddTabClicked={this.handleAddLoanTask}
            onDeleteTabClicked={this.handleRemoveLoanTask} />
          {content}
        </div>
    );
  }
}

export default withStyles(styles)(App);
