export function calculateSchedule(loanParams) {
    var payments = [];
    const currentYearRate = loanParams.baseLoanRate;
    var currentDebt = loanParams.baseLoan;
    var restPeriods = loanParams.basePeriods * 12;
    var iteration = 200;
    console.assert(loanParams.issueDate, "issue date was not specified");
    const issueDate = loanParams.issueDate || new Date().toDateString();
    var currentYear = new Date(issueDate).getYear() + 1900;
    var currentMonth = new Date(issueDate).getMonth();

    var currentMounthRateRought = currentYearRate / 12.0;
    var currentTempRateK = Math.pow((1.0 + currentMounthRateRought), restPeriods);
    var currentK = currentMounthRateRought * currentTempRateK / (currentTempRateK - 1.0);
    var currentMounthPayment = currentDebt * currentK;
    const baseMounthPayment = currentMounthPayment;

    var dayOfYears = [366, 365, 365, 365];
    var getDaysInYear = (year) => dayOfYears[year % 4];
    var getDaysInMonth = function(year, month) {
      // day = 0 - returns amount of days in previous mounth
      return new Date(year, month+1, 0).getDate();
    };
    var interestsOverall = 0.0;

    while (currentDebt >= 0.01 && iteration-- > 0) {
      const daysInYear = getDaysInYear(currentYear);
      const daysInMonth = getDaysInMonth(currentYear, currentMonth);
      const monthRate = currentYearRate / daysInYear * daysInMonth;
      const interest = currentDebt * monthRate;
      const paymentDate = (currentMonth + 1) % 12;
      var payment = currentMounthPayment;
      var retirement = payment - interest;
      if (currentDebt - retirement < 300) {
        payment = interest + currentDebt;
        retirement = currentDebt;
      }
      // console.log(payments.length + ". " 
      //   + currentDebt + ": " 
      //   + interest + " + " 
      //   + retirement + " = "
      //   + payment);
      payments.push({
        currentDebt: currentDebt,
        periodDate: currentYear + "-" + (paymentDate+1), // [0 .. 11] => [1 .. 12]
        payment: payment,
        interest: interest,
        retirement: retirement
      });
      interestsOverall += interest;
      
      currentMonth += 1;
      if (currentMonth >= 12) {
        currentMonth = currentMonth % 12;
        currentYear += 1;
      }
      currentDebt -= retirement;
      restPeriods -= 1;
    }
    return {
      payments : payments,
      baseLoan : loanParams.baseLoan,
      baseMounthPayment : baseMounthPayment,
      interestsOverall : interestsOverall,

    };
  }