
var btnParse = document.getElementById('btn-parse');
var smsCont = document.getElementById('sms-details-cont');
var smsParsedDataCont = document.getElementById('sms-parsed-data');
var sms = document.getElementById('sms');

btnParse.addEventListener("click", function () {

    var parser = new SMSParser('voda', 'fr');
    var smsVal = sms.value;
    var smsParsed = parser.getParsedDataHTML(smsVal);

    smsCont.innerHTML = "sms : <br/><br/><b>" + smsVal + '</b>';
    smsParsedDataCont.innerHTML = "Parsed Data : <br/><br/><b>" + smsParsed + '</b>'
})


class SMSParser {


    

    constructor (network, lang){
        this.network = network;
        this.lang = lang;
        this.TRANS_ID = 'transID';
        this.AMOUNT = 'amount';
        this.CURRENCY = 'currency';
        this.DISPONIBLE = 'disponible';
    }

    parseSMS(sms){
        
        //Transaction ID
        var regEx = /ID: \w*\d*\.\d{4}\.\w*\d*/i;
        var found = sms.match(regEx);

        const transID = found[0].replace('ID: ', '');

        //Amount and currency
        regEx = /de \d*\.\d* \w{3}/;
        found = sms.match(regEx);
        const amountAndCurrencyData = found[0].replace('de ', '').split(' ');
        const amount = amountAndCurrencyData[0];
        const currency = amountAndCurrencyData[1];

        //Disponible
        regEx = /disponible est de \d*\.\d*/;
        found = sms.match(regEx);
        const disponible = found[0].replace('disponible est de ','');
        
        const data = {
            transID: transID, 
            amount: amount, 
            currency: currency,
            disponible: disponible
        } ;
        console.log(JSON.stringify(data));

        return(data);
    }

    getParsedDataHTML(sms){
        const data = this.parseSMS(sms);
        const html = '<div>Trans ID: <b>' + data[this.TRANS_ID] + '</b></div>' + 
        '<div>Amount: <b>' + data[this.AMOUNT] + '</b></div>' +
        '<div>Currency: <b>' + data[this.CURRENCY] + "</b></div>" +
        '<div>Disponible: <b>' + data[this.DISPONIBLE] + "</b></div>";

        return html;
    }


}

const smsSamples = {

}
