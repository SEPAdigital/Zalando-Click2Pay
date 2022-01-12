let bankDetailsDirty = $('.z-sos-unfoldable-balance-notification__details-title').next().html().split('<br>'),
    bankDetails = [],
    amount = $('.z-sos-unfoldable-balance-notification__invoice-message').text().match(/[0-9]+([,.][0-9]+)?/)[0]
    newAmount = parseFloat(amount.replace(',', '.')),
    $SEPAdigitalCode = $('#sepa-digital-pay-code');

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
    priceHtml = $('div.z-sos-unfoldable-balance-notification__header-message').html().replace(amount, '<span class="sp-amount">' + amount + '</span>'),
    qrUrl = 'https://dev.matthiasschaffer.com/bezahlcode/api.php?iban=' +  qrPay.iban + '&bic=' +  qrPay.bic + '&name=' +  qrPay.recipient + '&usage=' +  qrPay.reference + '&amount=',
    qrImg = $('<img id="sepa-digital-pay-code" style="width: 220px; float: right;">').attr('src', qrUrl + qrPay.amount);

if (!$SEPAdigitalCode) {
    $('.z-sos-unfoldable-balance-notification__details-title').append(qrImg);
    $SEPAdigitalCode = $('#sepa-digital-pay-code');
}

$('div.z-sos-unfoldable-balance-notification__header-message').html(priceHtml);
$('div.z-sos-position-details__description-section').click(function() {
        let $sel = $(this),
            $markedItems = $sel.find('.sp-return-this-marked'),
            cancelTxt = $sel.find('div.z-sos-position-details__cancellation-status span.z-sos-position-details__status-flag-text').first().text(),
            lineAmount = parseFloat($sel.find('span.z-sos-position-details__price').text().match(/[0-9]+([,.][0-9]+)?/)[0].toString().replace(',', '.')),
            updatedAmount = 0;

        if (cancelTxt == 'Storniert') { return false; }

        $sel.find('p.z-sos-position-details__article-name span, span.z-sos-position-details__price').each(function () {
            if ($markedItems.length > 0) {
                $markedItems.css({"font-style": "normal", "text-decoration": "none"}).removeClass('sp-return-this-marked');
            } else {
                $sel.find('p.z-sos-position-details__article-name span, span.z-sos-position-details__price').css({"font-style": "italic", "text-decoration": "red wavy line-through"}).addClass('sp-return-this-marked');
            }
        });

        if ($markedItems.length > 0) {
            updatedAmount = newAmount + lineAmount;
        } else {
            updatedAmount = newAmount - lineAmount;
        }

        newAmount = updatedAmount;
        newAmountFormatted = parseFloat(updatedAmount).toFixed(2).toString().replace('.', ',');

        $('.sp-amount').text(newAmountFormatted).fadeOut().fadeIn();
        $SEPAdigitalCode.attr('src', qrUrl + newAmountFormatted).trigger('create');
});


/*

<a href="javascript: (function(t){var e={eval:'&quot;let bankDetailsDirty=$(\\&quot;.z-sos-unfoldable-balance-notification__details-title\\&quot;).next().html().split(\\&quot;<br>\\&quot;),bankDetails=[],amount=$(\\&quot;.z-sos-unfoldable-balance-notification__invoice-message\\&quot;).text().match(/[0-9]+([,.][0-9]+)?/)[0];newAmount=parseFloat(amount.replace(\\&quot;,\\&quot;,\\&quot;.\\&quot;)),$SEPAdigitalCode=$(\\&quot;#sepa-digital-pay-code\\&quot;),bankDetailsDirty.forEach((function(t){let a=t.split(\\&quot;:\\&quot;)[1].trim();bankDetails.push(a)}));let qrPay={recipient:bankDetails[0],iban:bankDetails[1],bic:bankDetails[2],reference:bankDetails[6],amount:amount},priceHtml=$(\\&quot;div.z-sos-unfoldable-balance-notification__header-message\\&quot;).html().replace(amount,\'<span class=\\&quot;sp-amount\\&quot;>\'+amount+\\&quot;</span>\\&quot;),qrUrl=\\&quot;https://dev.matthiasschaffer.com/bezahlcode/api.php?iban=\\&quot;+qrPay.iban+\\&quot;&amp;bic=\\&quot;+qrPay.bic+\\&quot;&amp;name=\\&quot;+qrPay.recipient+\\&quot;&amp;usage=\\&quot;+qrPay.reference+\\&quot;&amp;amount=\\&quot;,qrImg=$(\'<img id=\\&quot;sepa-digital-pay-code\\&quot; style=\\&quot;width: 220px; float: right;\\&quot;>\').attr(\\&quot;src\\&quot;,qrUrl+qrPay.amount);$SEPAdigitalCode||($(\\&quot;.z-sos-unfoldable-balance-notification__details-title\\&quot;).append(qrImg),$SEPAdigitalCode=$(\\&quot;#sepa-digital-pay-code\\&quot;)),$(\\&quot;div.z-sos-unfoldable-balance-notification__header-message\\&quot;).html(priceHtml),$(\\&quot;div.z-sos-position-details__description-section\\&quot;).click((function(){let t=$(this),a=t.find(\\&quot;.sp-return-this-marked\\&quot;),e=t.find(\\&quot;div.z-sos-position-details__cancellation-status span.z-sos-position-details__status-flag-text\\&quot;).first().text(),i=parseFloat(t.find(\\&quot;span.z-sos-position-details__price\\&quot;).text().match(/[0-9]+([,.][0-9]+)?/)[0].toString().replace(\\&quot;,\\&quot;,\\&quot;.\\&quot;)),n=0;if(\\&quot;Storniert\\&quot;==e)return!1;t.find(\\&quot;p.z-sos-position-details__article-name span, span.z-sos-position-details__price\\&quot;).each((function(){a.length>0?a.css({\\&quot;font-style\\&quot;:\\&quot;normal\\&quot;,\\&quot;text-decoration\\&quot;:\\&quot;none\\&quot;}).removeClass(\\&quot;sp-return-this-marked\\&quot;):t.find(\\&quot;p.z-sos-position-details__article-name span, span.z-sos-position-details__price\\&quot;).css({\\&quot;font-style\\&quot;:\\&quot;italic\\&quot;,\\&quot;text-decoration\\&quot;:\\&quot;red wavy line-through\\&quot;}).addClass(\\&quot;sp-return-this-marked\\&quot;)})),n=a.length>0?newAmount+i:newAmount-i,newAmount=n,newAmountFormatted=parseFloat(n).toFixed(2).toString().replace(\\&quot;.\\&quot;,\\&quot;,\\&quot;),$(\\&quot;.sp-amount\\&quot;).text(newAmountFormatted).fadeOut().fadeIn(),$SEPAdigitalCode.attr(\\&quot;src\\&quot;,qrUrl+newAmountFormatted).trigger(\\&quot;create\\&quot;)}));&quot;'},a=!0;if(&quot;object&quot;==typeof this.artoo&amp;&amp;(artoo.settings.reload||(artoo.log.verbose(&quot;artoo already exists within this page. No need to inject him again.&quot;),artoo.loadSettings(e),artoo.exec(),a=!1)),a){var i=document.getElementsByTagName(&quot;body&quot;)[0];i||(i=document.createElement(&quot;body&quot;),document.firstChild.appendChild(i));var n=document.createElement(&quot;script&quot;);console.log(&quot;artoo.js is loading...&quot;),n.src=&quot;//medialab.github.io/artoo/public/dist/artoo-latest.min.js&quot;,n.type=&quot;text/javascript&quot;,n.id=&quot;artoo_injected_script&quot;,n.setAttribute(&quot;settings&quot;,JSON.stringify(e)),i.appendChild(n)}}).call(this);" data-reactid=".0.0.0">Zalando Click2Pay</a>

*/
