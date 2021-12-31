let bankDetailsDirty = $('.z-sos-unfoldable-balance-notification__details-title').next().html().split('<br>'),
    bankDetails = [],
    amount = $('.z-sos-unfoldable-balance-notification__invoice-message').text().match(/[0-9]+([,.][0-9]+)?/)[0];

bankDetailsDirty.forEach(function(line) {
    let detail = line.split(':')[1].trim();
    bankDetails.push(detail)
})

let qrPay = {
    'recipient': bankDetails[0],
    'iban': bankDetails[1],
    'bic': bankDetails[2],
    'reference': bankDetails[6],
    'amount': amount},
    qrImg = document.createElement("img"),
    qrUrl = 'https://dev.matthiasschaffer.com/bezahlcode/api.php?iban=' +  qrPay.iban + '&bic=' +  qrPay.bic + '&name=' +  qrPay.recipient + '&usage=' +  qrPay.reference + '&amount=' +  qrPay.amount;

qrImg.src = qrUrl;
qrImg.style = 'width: 220px; float: right;';

$('.z-sos-unfoldable-balance-notification__details-title').append(qrImg);

/*
// bookmarklet

<a href="javascript: (function(t){var e={eval:'"let bankDetailsDirty=$(\\".z-sos-unfoldable-balance-notification__details-title\\").next().html().split(\\"<br>\\"),bankDetails=[],amount=$(\\".z-sos-unfoldable-balance-notification__invoice-message\\").text().match(/[0-9]+([,.][0-9]+)?/)[0];bankDetailsDirty.forEach((function(a){let t=a.split(\\":\\")[1].trim();bankDetails.push(t)}));let qrPay={recipient:bankDetails[0],iban:bankDetails[1],bic:bankDetails[2],reference:bankDetails[6],amount:amount},qrImg=document.createElement(\\"img\\"),qrUrl=\\"https://dev.matthiasschaffer.com/bezahlcode/api.php?iban=\\"+qrPay.iban+\\"&bic=\\"+qrPay.bic+\\"&name=\\"+qrPay.recipient+\\"&usage=\\"+qrPay.reference+\\"&amount=\\"+qrPay.amount;qrImg.src=qrUrl,qrImg.style=\\"width: 220px; float: right;\\",$(\\".z-sos-unfoldable-balance-notification__details-title\\").append(qrImg);"'},a=!0;if("object"==typeof this.artoo&&(artoo.settings.reload||(artoo.log.verbose("artoo already exists within this page. No need to inject him again."),artoo.loadSettings(e),artoo.exec(),a=!1)),a){var i=document.getElementsByTagName("body")[0];i||(i=document.createElement("body"),document.firstChild.appendChild(i));var o=document.createElement("script");console.log("artoo.js is loading..."),o.src="//medialab.github.io/artoo/public/dist/artoo-latest.min.js",o.type="text/javascript",o.id="artoo_injected_script",o.setAttribute("settings",JSON.stringify(e)),i.appendChild(o)}}).call(this);">Zalando Click2Pay</a>
*/
