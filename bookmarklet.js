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

if (!$SEPAdigitalCode.attr('src')) {
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
});
