
function l(u, i) {
    var d = document;
    if (!d.getElementById(i)) {
        var s = d.createElement('script');
        s.src = u;
        s.id = i;
        d.body.appendChild(s);
    }
}

l('//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js', 'jquery');

let bankDetailsDirty = $($('h2')[2]).parent().html().split('<br>') || null,
    bankDetails = [],
    elAmount = $('p[data-testid="customer_order-detail-view_open-amount-text"]') || null,
    datePayment = elAmount && elAmount.text().match(/[0-9]+\.[0-9]+\.[0-9]+/)[0] || '0',
    amount = elAmount && elAmount.text().match(/[0-9]+([,.][0-9]+)?/)[0] || '0',
    newAmount = parseFloat(amount.replace(',', '.')),
    // newAmount = parseFloat($('[data-testid="customer_order-detail-view_open-amount-text"]').text().match(/[0-9]+([,.][0-9]+)?/)[0].toString().replace(',', '.')) || 0,
    newAmountFormatted = parseFloat(newAmount).toFixed(2).toString().replace('.', ',');
    $SEPAdigitalCode = $('#sepa-digital-pay-code') || null,
    $SEPAdigitalButton = $('#sepa-digital-pay-button') || null,
    btnClasses = $('div.isiDul a').attr('class');

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
    priceHtml = elAmount && elAmount.text().replace(amount, '<span class="sp-amount">' + amount + '</span>') || '0',
    qrUrl = 'https://dev.matthiasschaffer.com/bezahlcode/api.php?iban=' +  qrPay.iban + '&bic=' +  qrPay.bic + '&name=' +  qrPay.recipient + '&usage=' +  qrPay.reference + '&amount=';

    console.log('*** priceHtml', priceHtml)
    console.log('*** qrUrl', qrUrl)

let div = document.createElement('div'),
    img = document.createElement('img');

// div
img.setAttribute('id', 'sepa-digital-pay-code');
img.setAttribute('class', 'SEPAinstant-qr-code');

// img
img.setAttribute('src', qrUrl + qrPay.amount);
img.setAttribute('style', 'width: 220px; float: left; margin: 0 45px 25px 0;');

let qrImg = img;

$('[role="status"]').css({position: 'sticky', 'top': 0, 'min-height': '80px', 'z-index': '9999'}).find('p').css({'padding-top': '13px', 'font-weight': 'bold', 'text-align': 'center'});
$('[role="status"]').find('svg').hide();
$('h2.isiDul').next().prepend(qrImg);
$SEPAdigitalCode = $('#sepa-digital-pay-code');

// pay button
// $('[style="border-radius:4px"]').append('<a class="SEPAinstant-link-pay ' + btnClasses + '" target="_blank" href="https://BANKpay.plus/checkout/123#45">Jetzt mit dem Bankkonto bezahlen</a> &nbsp; <strong>€ ' + newAmountFormatted + '</strong>').fadeOut().fadeIn();
// $('[style="border-radius:4px"]').append('<div id="sepa-digital-pay-button" class="SEPAinstant-pay-button"></div>');
// $SEPAdigitalButton = $('#sepa-digital-pay-button') || null;
$('[data-testid="customer_order-detail-view_open-amount-text"]').html('<a class="SEPAinstant-link-pay ' + btnClasses + '" target="_blank" href="https://BANKpay.plus/checkout/123#45">Jetzt mit dem Bankkonto bezahlen</a> &nbsp; <strong>€ ' + newAmountFormatted + '</strong>').fadeOut().fadeIn();
$('[data-testid="customer_order-detail-view_open-amount-text"]').parents('[style="border-radius:4px"]').find('svg').remove();
$('[data-testid="customer_order-detail-view_open-amount-text"]').attr('style', 'text-align:center; display: block;');

var statusBar = $('[role="status"]'),
    container = $($('[style="border-radius:4px"]').parent().parent().find('ol')[0]);

    container.prepend(statusBar);

$('main div ol li ul a').attr('href', '#').off().css({'cursor': 'context-menu' }).click(function(e) {
    e.preventDefault();

    let $sel = $(this);
    let $markedItems = null,
        cancelTxt = $sel.find('div.z-sos-position-details__cancellation-status span.z-sos-position-details__status-flag-text').first().text(),
        lineAmount = parseFloat($sel.text().match(/[0-9]+([,.][0-9]+)?/)[0].toString().replace(',', '.')),
        updatedAmount = 0;

    if (cancelTxt == 'Storniert') { console.log('Storniert'); }

    $sel.parent().attr('href', '#');

    $markedItems = $(this).find('.sp-return-this-marked');

    if ($markedItems.length > 0) {
        $markedItems.attr('style', '').css({'font-style': 'normal', 'text-decoration': 'none', 'cursor': 'zoom-out'}).removeClass('sp-return-this-marked');
    } else {
        $sel.find('dl p:first-child').css({'font-style': 'italic', 'text-decoration': 'red wavy line-through', 'cursor': 'zoom-in'}).addClass('sp-return-this-marked')
        $sel.find('dl').parent('div:nth-child(1)').find('div span').css({'font-style': 'italic', 'text-decoration': 'red wavy line-through', 'cursor': 'zoom-in'}).addClass('sp-return-this-marked');
    }

    // $($('h2')[2]).parent().fadeOut();

    if ($markedItems.length > 0) {
        updatedAmount = newAmount + lineAmount;
    } else {
        updatedAmount = newAmount - lineAmount;
    }

    newAmount = updatedAmount;
    newAmountFormatted = parseFloat(updatedAmount).toFixed(2).toString().replace('.', ',');
    console.log('newAmount: ', newAmountFormatted);

    // $('#bankpay-button').fadeOut().remove();
    // let BANKpayButton = $('<div id="bankpay-button">').html('<a class="SEPAinstant-link-pay ' + btnClasses + '" target="_blank" href="https://BANKpay.plus/checkout/123#45">Jetzt mit dem Bankkonto bezahlen</a> &nbsp; <strong>€ ' + newAmountFormatted + '</strong>');
    // $SEPAdigitalCode.append(BANKpayButton).fadeIn();
    $('[data-testid="customer_order-detail-view_open-amount-text"]').html('<a class="SEPAinstant-link-pay ' + btnClasses + '" target="_blank" href="https://BANKpay.plus/checkout/123#45">Jetzt mit dem Bankkonto bezahlen</a> &nbsp; <strong>€ ' + newAmountFormatted + '</strong>').fadeOut().fadeIn();
    $('[data-testid="customer_order-detail-view_open-amount-text"]').parents('[style="border-radius:4px"]').find('svg').remove();
    $('[data-testid="customer_order-detail-view_open-amount-text"]').attr('style', 'text-align:center; display: block;');
    $SEPAdigitalCode.attr('src', qrUrl + newAmountFormatted).trigger('create');
});
