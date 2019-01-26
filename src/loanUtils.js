function getMounthlyPayment(debt, yearRate, periods) {
  const currentMounthRateRought = yearRate / 12.0;
  const currentTempRateK = Math.pow((1.0 + currentMounthRateRought), periods);
  const currentK = currentMounthRateRought * currentTempRateK / (currentTempRateK - 1.0);
  return debt * currentK;
}

export function calculateSchedule(loanParams) {
    var payments = [];
    const currentYearRate = parseFloat(loanParams.baseLoanRate);
    var currentDebt = parseFloat(loanParams.baseLoan);
    var restPeriods = parseFloat(loanParams.basePeriods) * 12;
    var iteration = 200;
    console.assert(loanParams.issueDate, "issue date was not specified");
    const issueDate = loanParams.issueDate || new Date().toDateString();
    var currentYear = new Date(issueDate).getYear() + 1900;
    var currentMonth = new Date(issueDate).getMonth();

    var currentMounthPayment = getMounthlyPayment(currentDebt, currentYearRate, restPeriods);
    const baseMounthPayment = currentMounthPayment;
    var currentPaymentNumber = 1;
    const additionalPayments = loanParams.additionalPayments;

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
      const paymentYear = currentYear + (currentMonth === 11 ? 1 : 0);
      var payment = currentMounthPayment;
      const currentAdditionalPayment = additionalPayments ? (additionalPayments[currentPaymentNumber - 1] ? additionalPayments[currentPaymentNumber - 1].value : 0) : 0;
      var retirement = payment - interest + currentAdditionalPayment;
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
        currentDebt: parseFloat(currentDebt),
        periodDate: paymentYear + "-" + (paymentDate+1), // [0 .. 11] => [1 .. 12]
        paymentNumber: currentPaymentNumber,
        payment: payment,
        interest: interest,
        retirement: retirement
      });
      interestsOverall += interest;
      
      currentPaymentNumber += 1;
      currentMonth += 1;
      if (currentMonth >= 12) {
        currentMonth = currentMonth % 12;
        currentYear += 1;
      }
      currentDebt -= retirement;
      restPeriods -= 1;
      if(currentAdditionalPayment > 0) {
        currentMounthPayment = getMounthlyPayment(currentDebt, currentYearRate, restPeriods);
      }
    }
    return {
      payments : payments,
      baseLoan : loanParams.baseLoan,
      baseMounthPayment : baseMounthPayment,
      interestsOverall : interestsOverall,

    };
  }