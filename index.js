
var btnParse = document.getElementById('btn-parse');
var smsDetailsCont = document.getElementById('sms-details-cont');
var sms = document.getElementById('sms');

btnParse.addEventListener("click", function () {
    smsDetailsCont.innerHTML = "parsing data with : <br/><b>" + sms.value + '</b>';
})