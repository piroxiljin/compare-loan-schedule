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
var dateFormat = require('dateformat');

const styles = theme => ( {
  app: {
    display: "flex",
    flexFlow: "column",
    height: "100vh"
  },
  taskContent: {
    flex: 1,
    marginTop: 16,
    overflowY: 'auto',
  }
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
    this.handleAddPaymentClicked = this.handleAddPaymentClicked.bind(this);
    this.handleAdditionalPaymentChanged = this.handleAdditionalPaymentChanged.bind(this)
    this.handleAdditionalPaymentFocus = this.handleAdditionalPaymentFocus.bind(this);
    this.handleAdditionalPaymentBlur = this.handleAdditionalPaymentBlur.bind(this);
    this.updateContent = this.updateContent.bind(this);

    var pages = {};
    var pagesIds = [];
    var activePage = "";
    
    try {
      var restoredPages = JSON.parse(localStorage.getItem("pages") );
      var restoredPagesIds = JSON.parse(localStorage.getItem("pagesIds") );
      var restoredActivePage = localStorage.getItem("activePage");
      pages = restoredPages || pages;
      pagesIds = restoredPagesIds || pagesIds;
      activePage = restoredActivePage || activePage;
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
      issueDate: dateFormat(new Date(), "yyyy-mm-dd"),
      activePage: activePage || "",
      pages: pages || {},
      pagesIds: pagesIds || [],
      renameLoan: false,
      minimalAdditionalPayment: 1000
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
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];

    const newId = uniqueID();
    pagesIds.push(newId);
    pages[newId] = {id: newId,
      title: currentPage ? currentPage.title : "new loan",
      baseLoanRate: currentPage ? currentPage.baseLoanRate : this.state.baseLoanRate,
      issueDate: currentPage ? currentPage.issueDate : this.state.issueDate,
      baseLoan: currentPage ? currentPage.baseLoan : this.state.baseLoan,
      basePeriods: currentPage ? currentPage.basePeriods : this.state.basePeriods,
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

  handleAddPaymentClicked(paymentIndex) {
    var pages = this.state.pages;
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];
    var additionalPayments = currentPage.additionalPayments ? currentPage.additionalPayments : {};
    if (additionalPayments[paymentIndex]) {
      additionalPayments[paymentIndex].makeEdit = true;
      additionalPayments[paymentIndex].editValue = this.state.minimalAdditionalPayment;
      additionalPayments[paymentIndex].value = this.state.minimalAdditionalPayment;
    } else {
      additionalPayments[paymentIndex] = { makeEdit: true, value: this.state.minimalAdditionalPayment, editValue: this.state.minimalAdditionalPayment };
    }

    currentPage.additionalPayments = additionalPayments;
    pages[activePageId] = currentPage;
    this.setState({
      pages: pages,
    });
    
    this.updateContent();
  }

  handleAdditionalPaymentChanged(paymentIndex, e) {
    var pages = this.state.pages;
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];
    var additionalPayments = currentPage.additionalPayments ? currentPage.additionalPayments : {};
    console.assert(additionalPayments[paymentIndex], "Attempt to change not existed additional payment");

    additionalPayments[paymentIndex].editValue = e.target.value;

    currentPage.additionalPayments = additionalPayments;
    pages[activePageId] = currentPage;
    this.setState({
      pages: pages,
    });
    
    this.updateContent();
  }

  handleAdditionalPaymentFocus(paymentIndex, e) {
    var pages = this.state.pages;
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];
    var additionalPayments = currentPage.additionalPayments ? currentPage.additionalPayments : {};

    additionalPayments[paymentIndex].editValue = additionalPayments[paymentIndex].value;
    additionalPayments[paymentIndex].makeEdit = true;

    currentPage.additionalPayments = additionalPayments;
    pages[activePageId] = currentPage;
    this.setState({
      pages: pages,
    });
    
    this.updateContent();
  }

  handleAdditionalPaymentBlur(paymentIndex, e) {
    var pages = this.state.pages;
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];
    var additionalPayments = currentPage.additionalPayments ? currentPage.additionalPayments : {};

    try {
      var newValue = parseFloat(additionalPayments[paymentIndex].editValue);
      additionalPayments[paymentIndex].value = isNaN(newValue) ? 0 : newValue;
    } 
    catch(e) {
      additionalPayments[paymentIndex].value = 0;
    }
    additionalPayments[paymentIndex].makeEdit = false;
    if (additionalPayments[paymentIndex].value === 0) {
      delete additionalPayments[paymentIndex];
    }

    currentPage.additionalPayments = additionalPayments;
    pages[activePageId] = currentPage;
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

      if (currentPage === undefined) {
        return;
      }

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
        basePeriods: currentPage ? currentPage.basePeriods : state.basePeriods,
        additionalPayments: currentPage ? currentPage.additionalPayments : {}
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

    const payments = (currentPage && currentPage.payments) ? currentPage.payments : [];
    const additionalPayments = (currentPage && currentPage.additionalPayments) ? currentPage.additionalPayments : {};
    const contentIsReady = currentPage && currentPage.isReady;
    
    const content = currentPage && <div className={this.props.classes.taskContent}>
                            <LoanTask
                              baseLoan={currentPage.baseLoan} 
                              onBaseLoanChange={this.handleBaseLoanChange}
                              basePeriods={currentPage.basePeriods}
                              onBasePeriodsChange={this.handleBasePeriodsChange}
                              baseLoanRate={currentPage.baseLoanRate}
                              onBaseLoanRateChange={this.handleBaseLoanRateChange}
                              issueDate={currentPage.issueDate}
                              onIssueDateChange={this.handleIssueDateChange}
                              isReady={contentIsReady} payments={payments} additionalPayments={additionalPayments}
                              baseMounthPayment={currentPage.baseMounthPayment}
                              interestsOverall={currentPage.interestsOverall} 
                              onAddPaymentClicked={this.handleAddPaymentClicked}
                              onAdditionalPaymentChanged={this.handleAdditionalPaymentChanged}
                              onAdditionalPaymentFocus={this.handleAdditionalPaymentFocus}
                              onAdditionalPaymentBlur={this.handleAdditionalPaymentBlur} /> 
                          </div>;
    
    return (
        <div className={this.props.classes.app}>
          <AppBar color="primary">
            <Typography variant="h3" color="textPrimary" align="center">
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
