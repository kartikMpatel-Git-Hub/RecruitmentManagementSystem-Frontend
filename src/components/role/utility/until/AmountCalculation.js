const currencyCalculate = (amount)=>{
    if(amount >= 10000000)
        return Math.round(amount / 10000000) + " Cr";
    if(amount >= 100000)
        return Math.round(amount / 100000) + " Lakh";
    if(amount > 1000)
        return Math.round(amount / 1000) + " Thousand";
    return amount
}

export {currencyCalculate}