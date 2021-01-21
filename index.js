
var btnParse = document.getElementById('btn-parse');
var smsCont = document.getElementById('sms-details-cont');
var smsParsedDataCont = document.getElementById('sms-parsed-data');
var sms = document.getElementById('sms');

btnParse.addEventListener("click", function () {

    var parser = new SMSParser('voda', 'fr');
    var smsVal = sms.value;
    var smsParsed = parseSMS(smsVal)

    smsCont.innerHTML = "sms : <br/><br/><b>" + smsVal + '</b>';
    smsParsedDataCont.innerHTML = "Parsed Data : <br/><br/><b>" + parser.parse(smsParsed) + '</b>'
})

function parseSMS(sms){
    return sms;
}

class SMSParser {
    constructor (network, lang){
        this.network = network;
        this.lang = lang;
    }

    parse(sms){
        return 'pasing this -> ' + sms;
    }
}

const smsSamples = {

}
