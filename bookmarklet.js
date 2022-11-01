let bankDetailsDirty = $('#main-content h2').nextElementSibling.getInnerHTML().split('<br>') || null,
    bankDetails = [],
    elAmount = $('p[data-testid="customer_order-detail-view_open-amount-text"]') || null,
    amount = elAmount && elAmount.textContent.match(/[0-9]+([,.][0-9]+)?/)[0] || '0',
    newAmount = parseFloat(amount.replace(',', '.')),
    $SEPAdigitalCode = $('#sepa-digital-pay-code') || null;

if (bankDetailsDirty) {
    bankDetailsDirty.forEach(function(line) {
        let detail = line.split(':')[1].trim();
        bankDetails.push(detail)
    });
}

let qrPay = {
    'recipient': bankDetails[0],
    'iban': bankDetails[1],
    'bic': bankDetails[2],
    'reference': bankDetails[6],
    'amount': amount},
    priceHtml = elAmount && elAmount.getInnerHTML().replace(amount, '<span class="sp-amount">' + amount + '</span>') || '0',
    qrUrl = 'https://dev.matthiasschaffer.com/bezahlcode/api.php?iban=' +  qrPay.iban + '&bic=' +  qrPay.bic + '&name=' +  qrPay.recipient + '&usage=' +  qrPay.reference + '&amount=';

    // console.log('*** priceHtml', priceHtml)
    // console.log('*** qrUrl', qrUrl)

let img = document.createElement('img');

img.setAttribute('src', qrUrl + qrPay.amount);
img.setAttribute('id', 'sepa-digital-pay-code');
img.setAttribute('class', 'SEPAinstant-qr-code');
img.setAttribute('style', 'width: 220px; float: left; margin: 0 0 25px 0;');

let qrImg = img,
    elQR = $('main div div').nextElementSibling.nextElementSibling;

if (newAmount > 0) {
    if (elQR && elQR.firstChild && elQR.firstChild.firstChild && elQR.firstChild.firstChild.classList.contains('isiDul')) {
        $('main div div').nextElementSibling.nextElementSibling.prepend(qrImg);
    } else if (!$SEPAdigitalCode) {
        $('main div div').nextElementSibling.nextElementSibling.append(qrImg);
    } else if ($SEPAdigitalCode && $SEPAdigitalCode.classList.contains('SEPAinstant-qr-code')) {
        $SEPAdigitalCode.innerHTML = qrImg.outerHTML;
    }
}

$SEPAdigitalCode = $('#sepa-digital-pay-code');


if (elAmount && elAmount.innerHTML) {
    elAmount.innerHTML = priceHtml;
}

/*

elAmount.click(function() {
        let $sel = $(this),
            $markedItems = $sel.find('.sp-return-this-marked'),
            cancelTxt = $sel.find('div.z-sos-position-details__cancellation-status span.z-sos-position-details__status-flag-text').first().text(),
            lineAmount = parseFloat($sel.elAmount.textContent.match(/[0-9]+([,.][0-9]+)?/)[0].toString().replace(',', '.')),
            updatedAmount = 0;

        if (cancelTxt == 'Storniert') { return false; }

        $sel.find('p.z-sos-position-details__article-name span, span.z-sos-position-details__price').each(function () {
            if ($markedItems.length > 0) {
                $markedItems.css({'font-style': 'normal', 'text-decoration': 'none', 'cursor': 'copy'}).removeClass('sp-return-this-marked');
            } else {
                $sel.find('p.z-sos-position-details__article-name span, span.z-sos-position-details__price').css({'font-style': 'italic', 'text-decoration': 'red wavy line-through', 'cursor': 'no-drop'}).addClass('sp-return-this-marked');
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
})
// */
;
