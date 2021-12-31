let bankDetailsDirty = $('.z-sos-unfoldable-balance-notification__details-text:last-child').html().split('<br>'),
    bankDetails = [],
    amount = $('.z-sos-unfoldable-balance-notification__invoice-message').text().match(/[0-9]+([,.][0-9]+)?/)[0];

bankDetailsDirty.forEach(function(line) {
    let detail = line.split(':')[1].trim();
    bankDetails.push(detail)
})

let QRpay = {
    'recipient': bankDetails[0],
    'iban': bankDetails[1],
    'bic': bankDetails[2],
    'reference': bankDetails[6],
    'amount': amount},
    qrImg = document.createElement("img");
    qrUrl = 'https://dev.matthiasschaffer.com/bezahlcode/api.php?iban=' +  QRpay.iban + '&bic=' +  QRpay.bic + '&name=' +  QRpay.recipient + '&usage=' +  QRpay.reference + '&amount=' +  QRpay.amount;

qrImg.src = qrUrl;
qrImg.style = 'width: 220px; float: right;';

$('.z-sos-unfoldable-balance-notification__details-title').append(qrImg);

/*
// bookmarklet

<a href="javascript: (function(t){var a={eval:'&quot;let bankDetailsDirty=$(\\&quot;.z-sos-unfoldable-balance-notification__details-text:last-child\\&quot;).html().split(\\&quot;<br>\\&quot;),bankDetails=[],amount=$(\\&quot;.z-sos-unfoldable-balance-notification__invoice-message\\&quot;).text().match(/[0-9]+([,.][0-9]+)?/)[0];bankDetailsDirty.forEach((function(a){let t=a.split(\\&quot;:\\&quot;)[1].trim();bankDetails.push(t)}));let QRpay={recipient:bankDetails[0],iban:bankDetails[1],bic:bankDetails[2],reference:bankDetails[6],amount:amount},qrImg=document.createElement(\\&quot;img\\&quot;);qrUrl=\\&quot;https://dev.matthiasschaffer.com/bezahlcode/api.php?iban=\\&quot;+QRpay.iban+\\&quot;&amp;bic=\\&quot;+QRpay.bic+\\&quot;&amp;name=\\&quot;+QRpay.recipient+\\&quot;&amp;usage=\\&quot;+QRpay.reference+\\&quot;&amp;amount=\\&quot;+QRpay.amount,qrImg.src=qrUrl,qrImg.style=\\&quot;width: 220px; float: right;\\&quot;,$(\\&quot;.z-sos-unfoldable-balance-notification__details-title\\&quot;).append(qrImg);&quot;'},e=!0;if(&quot;object&quot;==typeof this.artoo&amp;&amp;(artoo.settings.reload||(artoo.log.verbose(&quot;artoo already exists within this page. No need to inject him again.&quot;),artoo.loadSettings(a),artoo.exec(),e=!1)),e){var i=document.getElementsByTagName(&quot;body&quot;)[0];i||(i=document.createElement(&quot;body&quot;),document.firstChild.appendChild(i));var o=document.createElement(&quot;script&quot;);console.log(&quot;artoo.js is loading...&quot;),o.src=&quot;//medialab.github.io/artoo/public/dist/artoo-latest.min.js&quot;,o.type=&quot;text/javascript&quot;,o.id=&quot;artoo_injected_script&quot;,o.setAttribute(&quot;settings&quot;,JSON.stringify(a)),i.appendChild(o)}}).call(this);">Zalando Click2Pay</a>
*/
