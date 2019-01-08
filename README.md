## Compare your loan

### About

[//]: # (Это еще одна вариация кредитного калькулятора с возможностью сравнить платежи и переплату для разных процентных ставок и разных сроков.)

Yet another loan calculator. This version allows to compare several loans with different interest rate and loan term.

Working instance might be checked on github pages: https://piroxiljin.github.io/compare-loan-schedule/

[//]: # (Сумма ежемесячного платежа определяется по формуле)

Amount of montly payment is defined as

![P_{month} = I \tfrac{R}{12} \frac{\left ( 1.0+\frac{R}{12} \right ) \^{n}}{\left (1.0+\frac{R}{12} \right )^{n}-1}](
https://latex.codecogs.com/gif.latex?P_{month}&space;=&space;I%20\tfrac{R}{12}%20\frac{\left%20(%201.0+\frac{R}{12}%20\right%20)%20^{n}}{\left%20(1.0+\frac{R}{12}%20\right%20)^{n}-1})

[//]: # (Где P_{month} — минимальный ежемесячный платеж
I — сумма кредита
R — годовая процентная ставка
n — строк кредита в месяцах)

Where ![P_{month}](https://latex.codecogs.com/gif.latex?P_{month}) — monthly payment

_I_ — loan amount

_R_ — annual interest rate

_n_ — loan duration in terms of month

[//]: # (Сумма выплат по процентам вычисляется по формуле)

Amount of monthly interest is defined as 

![P_{interest} = I R \frac{Days_{mouth}}{Days_{year}}](https://latex.codecogs.com/gif.latex?P_{interest}&space;=&space;I%20R%20\frac{Days_{mouth}}{Days_{year}})

[//]: # (Где P_{interest} — оплата процентов по кредиту
I — сумма кредита
R — годовая процентная ставка
Days_{mouth} — количество дней в месяце
Days_{year} — количество дней в году)

Where ![P_{interest}](https://latex.codecogs.com/gif.latex?P_{interest}) — amount of interest per month

_R_ — annual interest rate

![Days_{month}](https://latex.codecogs.com/gif.latex?Days_{month}) — days in month

![Days_{year}](https://latex.codecogs.com/gif.latex?Days_{year}) — days in year
