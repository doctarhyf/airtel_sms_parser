
var btnParse = document.getElementById('btn-parse');
var smsDetailsCont = document.getElementById('sms-details-cont');
var sms = document.getElementById('sms');

btnParse.addEventListener("click", function () {


    var smsCont = sms.value;
    var smsParsed = parseSMS(smsCont)

    smsDetailsCont.innerHTML = "parsing data with : <br/><br/><b>" + smsParsed + '</b>';
})

function parseSMS(sms){
    return "parsed sms -> " + sms;
}