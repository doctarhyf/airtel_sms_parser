
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
    ADMIN_MONEY_RECEIVED : 'Trans. ID: CI200530.1831.D47100 vous avez envoye de 1.0000 USD a  995282840.Votre solde disponible est de 9.0000USD.Cout:0.0000USD',
    ADMIN_MONEY_CHECK : 'Txn. ID : ES200602.1645.C30377. Vous avez actuellement  10.0000  USD disponible sur votre compte courant. Et 0.0170 USD sur votre compte commissions .',
    USER_MONEY_SENT : '9012|Trans ID: CO200530.1836.A40286. Dear Customer. You have sent USD 1.0000 to 975886099 ALBERT OMBA SHENYEMA. Your available balance is USD 5.2960.',
    USER_MONEY_RECEIVED : 'Transaction ID: CI200530.1831.D47100:Vous avez recu 1.0000 USD a partir de ALBER908LK, ALBERT OMBA SHENYEMA. votre nouveau solde est 6.4960 USD.Cout:0.0000USD',
    USER_MONEY_CHECK : 'Votre solde disponible est de 541.3000 CDF.',
    NO_TYPE : 'NO_TYPE'

}

const RX_ADMIN_MONEY_SENT = /Trans\. \w{2}: \w{2}\d{6}.\d{4}.\w{1}\d{5} vous avez envoye de \d*.\d* \w{3} a  \d{9}.Votre solde disponible est de \d*.\d*\w{3}.Cout:\d*.\d*\w{3}/;


btnParse.addEventListener("click", function () {

    var parser = new SMSParser('voda', 'fr');
    var smsVal = sms.value;
    var smsParsed = parser.getSMSType(smsVal);

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
        const isUserMoneyCheck = (JSON.stringify(this.parseSMSAdminMoneyCheck(sms)) === 'null') === false;


        

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

    
    

    parseSMSAdminMoneySent(sms){
        
        
        return null;

        //Transaction ID
        var regEx = /ID: \w*\d*\.\d{4}\.\w*\d*/i;
        var found = sms.match(regEx);

        if(found ===  null){
            console.log('Cant parse sms, check sms format');
            return null;
        }

        const transID = found[0].replace('ID: ', '');

        //Amount and currency
        regEx = /vous avez envoye de \d*\.\d* \w{3}/i;
        found = sms.match(regEx);
        const amountAndCurrencyData = found[0].replace('de ', '').split(' ');
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


        console.log(JSON.stringify(data));
        
        return(data);
    }

    parseSMSAdminMoneyReceived(sms){
        return null;
    }

    parseSMSAdminMoneyCheck(sms){
        return null;
    }

    parseSMSUserMoneySent(sms){
        return null;
    }

    parseSMSUserMoneyReceived(sms){
        return null;
    }

    parseSMSUserMoneyCheck(sms){
        return null;
    }

    getParsedDataHTML(sms){
        const data = this.parseSMSAdminMoneySent(sms);

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


