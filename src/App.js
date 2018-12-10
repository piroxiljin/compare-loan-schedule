import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Grid, Paper, AppBar, Typography, Tabs, Tab, Zoom, Fab, withStyles } from '@material-ui/core';
import LoanTask from './LoanTask';
import AddIcon from '@material-ui/icons/Add';

var objectHash = require('object-hash');
var deepEqual = require('deep-equal');

const styles = theme => ( {
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  tabs: {
    marginTop: 48
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
    this.handleAddLoanTask = this.handleAddLoanTask.bind(this);

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
    }

    this.state = {
      baseLoan: 1000000,
      basePeriods: 1,
      baseLoanRate: 0.10,
      baseDate: "2018-12",
      activePage: activePage || "",
      pages: pages || {},
      pagesIds: pagesIds || []
    };
  }

  handleBaseLoanChange(e) {
    var pages = this.state.pages;
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];

    if (! isNaN(e.target.value)) {
      currentPage["baseLoan"] = e.target.value;
    }
    pages[activePageId] = currentPage;
    this.setState({
      pages: pages
    });
  }

  handleBasePeriodsChange(e) {
    var pages = this.state.pages;
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];

    if (! isNaN(e.target.value)) {
      currentPage["basePeriods"] = e.target.value;
    }
    pages[activePageId] = currentPage;
    this.setState({
      pages: pages
    });
  }

  handleBaseLoanRateChange(e) {
    var pages = this.state.pages;
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];

    if (! isNaN(e.target.value)) {
      currentPage["baseLoanRate"] = e.target.value;
    }
    pages[activePageId] = currentPage;
    this.setState({
      pages: pages
    });
  }

  calculateSchedule(loanParams) {
    var payments = [];
    const currentYearRate = loanParams.baseLoanRate;
    var currentDebt = loanParams.baseLoan;
    var restPeriods = loanParams.basePeriods * 12;
    var iteration = 200;
    var currentYear = new Date(loanParams.baseDate).getYear() + 1900;
    var currentMonth = new Date(loanParams.baseDate).getMonth();

    var dayOfYears = [365, 365, 365, 366];
    var getDaysInYear = (year) => dayOfYears[year % 4];
    var getDaysInMonth = function(month,year) {
      return new Date(year, month, 0).getDate();
    };

    while (currentDebt >= 0.01 && iteration-- > 0) {
      const monthRate = currentYearRate / getDaysInYear(currentYear) * getDaysInMonth(currentYear, currentMonth);
      const mounthRateRought = currentYearRate / 12.0;
      const tempRateK = Math.pow((1.0 + mounthRateRought), restPeriods);
      const k = mounthRateRought * tempRateK / (tempRateK - 1.0);
      var payment = currentDebt * k;
      const interest = currentDebt * monthRate;
      var retirement = payment - interest;
      if (currentDebt - retirement < 300) {
        payment = interest + currentDebt;
        retirement = currentDebt;
      }
      console.log(payments.length + ". " 
        + currentDebt + ": " 
        + interest + " + " 
        + retirement + " = "
        + payment);
      payments.push({
        currentDebt: currentDebt,
        periodDate: currentYear + "-" + (currentMonth+1),
        payment: payment,
        interest: interest,
        retirement: retirement
      });
      
      currentMonth += 1;
      if (currentMonth >= 12) {
        currentMonth = currentMonth % 12;
        currentYear += 1;
      }
      currentDebt -= retirement;
      restPeriods -= 1;
    }
    return payments;
  }

  handleAddLoanTask() {
    var pages = this.state.pages;
    var pagesIds = this.state.pagesIds;

    const newId = uniqueID();
    pagesIds.push(newId);
    pages[newId] = {title: "new loan", id: newId,
      baseLoanRate: this.state.baseLoanRate,
      baseDate: this.state.baseDate,
      baseLoan: this.state.baseLoan,
      basePeriods: this.state.basePeriods,
    };
    this.setState({
      pages: pages,
      pagesIds: pagesIds,
      activePage: newId,
    });
  }

  handleTabChange = (event, value) => {
    this.setState({
      activePage: value,
    });
  }

  render() {
    var pages = this.state.pages;
    var pagesIds = this.state.pagesIds;
    var activePageId = this.state.activePage;
    var currentPage = pages[activePageId];

    var pagesStr = JSON.stringify(pages);
    localStorage.setItem("pages", pagesStr);
    var idsStr = JSON.stringify(pagesIds);
    localStorage.setItem("pagesIds", idsStr);
    localStorage.setItem("activePage", activePageId);

    const loanDesc = {
      baseLoanRate: currentPage.baseLoanRate,
      baseDate: currentPage.baseDate,
      baseLoan: currentPage.baseLoan,
      basePeriods: currentPage.basePeriods
    };
    const loanKey = objectHash(loanDesc);
    const loanDeskKey = loanKey + '-desc';
    var storedLoanDesc = JSON.parse(sessionStorage.getItem(loanDeskKey) );

    var payments
    if (storedLoanDesc && deepEqual(loanDesc, storedLoanDesc)) {
      payments = JSON.parse(sessionStorage.getItem(loanKey));
    }

    if (!payments) {
      payments = currentPage && this.calculateSchedule(loanDesc);
      sessionStorage.setItem(loanDeskKey, JSON.stringify(loanDesc));
      sessionStorage.setItem(loanKey, JSON.stringify(payments));
    }

    const tabList = this.state.pagesIds.map((pageId, index) => {
      return <Tab label={this.state.pages[pageId].title} value={pageId} key={pageId}/>
    });
    
    const content = currentPage && <LoanTask baseLoan={currentPage.baseLoan} 
                              onBaseLoanChange={this.handleBaseLoanChange}
                              basePeriods={currentPage.basePeriods}
                              onBasePeriodsChange={this.handleBasePeriodsChange}
                              baseLoanRate={currentPage.baseLoanRate}
                              onBaseLoanRateChange={this.handleBaseLoanRateChange}
                              payments={payments}/>;

    return (
      <div className="App">
        <AppBar color="primary">
          <Typography variant="h3" color="textPrimary">
            Loan calculator
          </Typography>
        </AppBar>
        <Tabs className={this.props.classes.tabs} value={this.state.activePage} onChange={this.handleTabChange}>
          {tabList}
        </Tabs>
        {content}
        <Fab>
          <AddIcon onClick={this.handleAddLoanTask} />
        </Fab>
      </div>
    );
  }
}

export default withStyles(styles)(App);
