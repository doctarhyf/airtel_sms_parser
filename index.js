
var btnParse = document.getElementById('btn-parse');
var smsCont = document.getElementById('sms-details-cont');
var smsParsedDataCont = document.getElementById('sms-parsed-data');
var sms = document.getElementById('sms');
var smsSamplesList = document.getElementById('smsSamplesList');

smsSamplesList.addEventListener('change', function () {

    const msgType = SMS_MODELS[this.value];

    sms.value = msgType;
    console.log(msgType);

})

const SMS_MODELS = {
    ADMIN_MONEY_SENT : "Trans. ID: CI200530.1831.D47100 vous avez envoye de 1.0000 USD a  995282840.Votre solde disponible est de 9.0000USD.Cout:0.0000USD",
    ADMIN_MONEY_RECEIVED : 'Trans. ID: CO200606.2320.C79855. Vous avez recu 1000.0000 CDF. Venant de 995282840 BOB DITEND. Votre solde disponible est de:  5500.0000 CDF.',
    ADMIN_MONEY_CHECK : 'Txn. ID : ES200602.1645.C30377. Vous avez actuellement  10.0000  USD disponible sur votre compte courant. Et 0.0170 USD sur votre compte commissions .',
    USER_MONEY_SENT : '9012|Trans ID: CO200530.1836.A40286. Dear Customer. You have sent USD 1.0000 to 975886099 ALBERT OMBA SHENYEMA. Your available balance is USD 5.2960.',
    USER_MONEY_RECEIVED : 'Transaction ID: CI200530.1831.D47100:Vous avez recu 1.0000 USD a partir de ALBER908LK, ALBERT OMBA SHENYEMA. votre nouveau solde est 6.4960 USD.Cout:0.0000USD',
    USER_MONEY_CHECK : 'Votre solde disponible est de 541.3000 CDF.',
    NO_TYPE : 'NO_TYPE'

}

const RX_ADMIN_MONEY_SENT = /Trans. ID: (\w|\d){8}.\d{4}.(\w|\d){6} vous avez envoye de \d*.\d{4} USD a  \d{9}./;
const RX_ADMIN_MONEY_RECEIVED = /Trans. ID: CO200606.2320.C79855. Vous avez recu 1000.0000 CDF. Venant de 995282840 BOB DITEND. Votre solde disponible est de:  5500.0000 CDF./;
const RX_ADMIN_MONEY_CHECK = /Txn. ID : ES200602.1645.C30377. Vous avez actuellement  10.0000  USD disponible sur votre compte courant. Et 0.0170 USD sur votre compte commissions ./;

const RX_USER_MONEY_SENT = /9012|Trans ID: CO200530.1836.A40286. Dear Customer. You have sent USD 1.0000 to 975886099 ALBERT OMBA SHENYEMA. Your available balance is USD 5.2960./;
const RX_USER_MONEY_RECEIVED = /Transaction ID: CI200530.1831.D47100:Vous avez recu 1.0000 USD a partir de ALBER908LK, ALBERT OMBA SHENYEMA. votre nouveau solde est 6.4960 USD.Cout:0.0000USD/;
const RX_USER_MONEY_CHECK = /Votre solde disponible est de 541.3000 CDF./;

btnParse.addEventListener("click", function () {

    var parser = new SMSParser('voda', 'fr');
    var smsVal = sms.value;
    var smsType = parser.getSMSType(smsVal);
    var parsedData = parser.getParsedDataHTML(smsVal);

    smsCont.innerHTML = "sms : <br/><br/><b>" + smsVal + '</b>';
    smsParsedDataCont.innerHTML = "Parsed Data : <br/><br/><b>SMS TYPE : " + smsType + '</b></br>' +
    parsedData;

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

    //sms types
    static SMS_TYPE = {
        ADMIN_MONEY_SENT : 'ADMIN_MONEY_SENT',
        ADMIN_MONEY_RECEIVED : 'ADMIN_MONEY_RECEIVED',
        ADMIN_MONEY_CHECK : 'ADMIN_MONEY_CHECK',
        USER_MONEY_SENT : 'USER_MONEY_SENT',
        USER_MONEY_RECEIVED : 'USER_MONEY_RECEIVED',
        USER_MONEY_CHECK : 'USER_MONEY_CHECK',
        NO_TYPE : 'NO_TYPE'

    };

    getSMSType(sms){

        
        
        const isAdminMoneySent = (JSON.stringify(this.parseSMSAdminMoneySent(sms)) === 'null') === false;
        const isAdminMoneyReceived = (JSON.stringify(this.parseSMSAdminMoneyReceived(sms)) === 'null') === false;
        const isAdminMoneyCheck = (JSON.stringify(this.parseSMSAdminMoneyCheck(sms)) === 'null') === false;

        const isUserMoneySent = (JSON.stringify(this.parseSMSUserMoneySent(sms)) === 'null') === false;
        const isUserMoneyReceived = (JSON.stringify(this.parseSMSUserMoneyReceived(sms)) === 'null') === false;
        const isUserMoneyCheck = (JSON.stringify(this.parseSMSUserMoneyCheck(sms)) === 'null') === false;


        

       if(isAdminMoneySent === true){
           return SMSParser.SMS_TYPE.ADMIN_MONEY_SENT;
       }

       if(isAdminMoneyReceived === true){
           return SMSParser.SMS_TYPE.ADMIN_MONEY_RECEIVED;
       }

       if(isAdminMoneyCheck === true){
        return SMSParser.SMS_TYPE.ADMIN_MONEY_CHECK;
        }

        if(isUserMoneySent === true){
            return SMSParser.SMS_TYPE.USER_MONEY_SENT;
        }

        if(isUserMoneyReceived === true){
            return SMSParser.SMS_TYPE.USER_MONEY_RECEIVED;
        }

        if(isUserMoneyCheck === true){
            return SMSParser.SMS_TYPE.USER_MONEY_CHECK;
        }

       return SMSParser.SMS_TYPE.NO_TYPE;
    }

    
    chechCurrentMatch(found){
        //check current regex macth -------------
        console.log("current regex match -> " + found);

        if(found ===  null){
            console.error('Cant parse sms, check sms format');
            return null;
        }
        // --------------------
    }
    

    parseSMSAdminMoneySent(sms){
        
        
        const test =  RX_ADMIN_MONEY_SENT.test(sms);

        if(test === false) {
            console.error('This sms is not of type of RX_ADMIN_MONEY_SENT ' );
            return null;
        }

        //console.log('RX_ADMIN_MONEY_SENT  -> ' + test);

        //Transaction ID
        var regEx = /ID: \w*\d*\.\d{4}\.\w*\d*/i;
        var found = sms.match(regEx);

        const transID = found[0].replace('ID: ', '');

        //Amount and currency
        regEx = /vous avez envoye de \d*\.\d* \w{3}/i;
        found = sms.match(regEx);

        const amountAndCurrencyData = found[0].replace('vous avez envoye de ', '').split(' ');
        const amount = amountAndCurrencyData[0];
        const currency = amountAndCurrencyData[1];

        

        //Disponible
        regEx = /disponible est de \d*\.\d*/i;
        found = sms.match(regEx);
        const disponible = found[0].replace('disponible est de ','');
        
        //parsed data object
        const data = {
            transID: transID, 
            amount: amount, 
            currency: currency,
            disponible: disponible,
            type: SMSParser.SMS_TYPE.ADMIN_MONEY_SENT
        };

        //console.log(JSON.stringify(data));
        
        return(data);
    }

    parseSMSAdminMoneyReceived(sms){


        const test =  RX_ADMIN_MONEY_RECEIVED.test(sms);

        if(test === false) {
            console.error('This sms is not of type of RX_ADMIN_MONEY_RECEIVED ' );
            return null;
        }

        //parsing
        //Transaction ID
        var regEx = /ID: \w*\d*\.\d{4}\.\w*\d*/i;
        var found = sms.match(regEx);
        const transID = found[0].replace('ID: ', '');

        //Amount and currency
        regEx = /Vous avez recu \d*.\d{4} \w{3}/i;
        found = sms.match(regEx);
        const amountAndCurrencyData = found[0].replace('Vous avez recu ', '').split(' ');
        const amount = amountAndCurrencyData[0];
        const currency = amountAndCurrencyData[1];

        //sender name and number
        regEx = /Venant de \d{9} BOB DITEND./i;
        found = sms.match(regEx);
        const senderNum = found[0].replace('Venant de ','').split(' ')[0];
        const senderName = found[0].replace('Venant de ' + senderNum, '').replace('.','');

        //solde disponible
        regEx = /Votre solde disponible est de:  \d*.\d{4} \w{3}/i;
        found = sms.match(regEx);
        const solde = found[0].replace('Votre solde disponible est de:  ', '').split(' ')[0];
        
        


        console.log('sender name num match -> ' + found);

        const data = {
            transID:transID,
            amount:amount,
            currency:currency,
            senderName:senderName,
            senderNum:senderNum,
            solde:solde
        };

        return (data);
    }

    parseSMSAdminMoneyCheck(sms){

        const test =  RX_ADMIN_MONEY_CHECK.test(sms);

        if(test === false) {
            console.error('This sms is not of type of RX_ADMIN_MONEY_CHECK ' );
            return null;
        }

        //parsing
        //Transaction ID
        var regEx = /\w*\d*\.\d{4}\.\w*\d*/i;
        var found = sms.match(regEx);
        const transID = found[0];

        //amount and currency
        regEx = /Vous avez actuellement  \d*.\d{4}  \w{3}/i;
        found = sms.match(regEx);

        

        const amount = found[0].replace('Vous avez actuellement  ', '').split('  ')[0];
        const currency = found[0].replace('Vous avez actuellement  ', '').split('  ')[1];

        

        const data = {
            transID:transID,
            amount:amount,
            currency:currency
        }

        return (data);
    }

    parseSMSUserMoneySent(sms){


        const test =  RX_USER_MONEY_SENT.test(sms);

        if(test === false) {
            console.error('This sms is not of type of RX_USER_MONEY_SENT ' );
            return null;
        }

        //console.log('RX_ADMIN_MONEY_SENT  -> ' + test);

        //Transaction ID
        var regEx = /\w*\d*\.\d{4}\.\w*\d*/i;
        var found = sms.match(regEx);

        const transID = found[0];


        
        
        //Amount and currency
        regEx = /You have sent \w{3} \d*.\d{4}/i;
        found = sms.match(regEx);

        const amountAndCurrencyData = found[0].replace('You have sent ', '').split(' ');
        const amount = amountAndCurrencyData[1];
        const currency = amountAndCurrencyData[0];

        
        
        //receiver name and phone
        regEx = /to 975886099 ALBERT OMBA SHENYEMA./i;
        found = sms.match(regEx);

        console.log('cur found ' + found[0]);

        const receiverPhone = found[0].replace('to ','').split(' ')[0];
        const receiverName = found[0].replace(receiverPhone, '').replace('to ','').replace('.','').trim();

        
        

        //balance
        regEx = /Your available balance is \w{3} \d*.\d{4}./i;
        found = sms.match(regEx);
        const balance = found[0].replace('Your available balance is ', '').replace(currency, '');
        
        //parsed data object

        const data = {
            transID: transID   ,
            amount: amount, 
            currency: currency,
            receiverPhone: receiverPhone,
            receiverName: receiverName,
            balance: balance
        };

        //console.log(JSON.stringify(data));*/
        
        return(data);
    }

    parseSMSUserMoneyReceived(sms){

        return (null);
    }

    parseSMSUserMoneyCheck(sms){

        const test =  RX_USER_MONEY_CHECK.test(sms);

        if(test === false) {
            console.error('This sms is not of type of RX_USER_MONEY_CHECK ' );
            return null;
        }

        //console.log('RX_ADMIN_MONEY_SENT  -> ' + test);

        //Transaction ID
        var regEx = /Votre solde disponible est de \d*.\d{4} \w{3}./i;
        var found = sms.match(regEx);

        const solde = found[0].replace('Votre solde disponible est de ','').split(' ')[0];
        const currency = found[0].replace('Votre solde disponible est de ','').split(' ')[1];

        const data = {
            solde:solde,
            currency:currency
        }

        return data;
    }

    getParsedDataHTML(sms){


        var data = null;

        const smsType = this.getSMSType(sms);
        console.log('current sms type found -> ' + smsType);

    
        if(smsType === SMSParser.SMS_TYPE.ADMIN_MONEY_SENT){
            data = this.parseSMSAdminMoneySent(sms);
        }

        if(smsType === SMSParser.SMS_TYPE.ADMIN_MONEY_RECEIVED){
            data = this.parseSMSAdminMoneyReceived(sms);
        }

        if(smsType === SMSParser.SMS_TYPE.ADMIN_MONEY_CHECK){
            data = this.parseSMSAdminMoneyCheck(sms);
        }

        if(smsType === SMSParser.SMS_TYPE.USER_MONEY_RECEIVED){
            data = this.parseSMSUserMoneyReceived(sms);
        }

        if(smsType === SMSParser.SMS_TYPE.USER_MONEY_SENT){
            data = this.parseSMSUserMoneySent(sms);
        }

        if(smsType === SMSParser.SMS_TYPE.USER_MONEY_CHECK){
            data = this.parseSMSUserMoneyCheck(sms);
        }

        if(data === null){
            return 'sms cant be parsed';
        }
        

        let html = '';

        for(const key in data){
            html += '<div>' + key + ': ' + data[key] + '</div>';
        }
        
        /*
        '<div>Trans ID: <b>' + data[this.TRANS_ID] + '</b></div>' + 
        '<div>Amount: <b>' + data[this.AMOUNT] + '</b></div>' +
        '<div>Currency: <b>' + data[this.CURRENCY] + "</b></div>" +
        '<div>Disponible: <b>' + data[this.DISPONIBLE] + "</b></div>";*/

        return html;
    }

    smsSamples () {
        return(
            {
                userMoneySend : 'userMoneySend'
            }
        )
    }

}


