if($('#BANKpay')) {
    $('#BANKpay').remove()
}

let paymentInformation = $('div [refs="CheckoutBankTransfer"] tbody'),
    elQR = $('#out_qr_bezahlcode'),
    bankDetails = [],
    bankDetailsDirty = paymentInformation.innerText.split('\n').forEach(splitLines) || null,
    amountMatch = paymentInformation.children && paymentInformation.children[4].children[1].textContent.match(/[0-9]+([,.][0-9]+)?/)[0] || '0', // isNaN
    amount = parseFloat(amountMatch.replace(',', '.')), // ...
    $SEPAdigitalCode = $('#BANKpay'),
    img = document.createElement('img');

function splitLines(line) {
    let detail = line.split('\t');
    bankDetails.push(detail);
}

let qrPay = {
    'recipient': bankDetails[0][1],
    'iban': bankDetails[1][1],
    'bic': bankDetails[2][1],
    'reference': bankDetails[3][1],
    'amount': amountMatch},
    qrUrl = 'https://dev.matthiasschaffer.com/bezahlcode/api.php?iban=' +  qrPay.iban + '&bic=' +  qrPay.bic + '&name=' +  qrPay.recipient + '&usage=' +  qrPay.reference + '&amount=';

img.setAttribute('src', qrUrl + qrPay.amount);
img.setAttribute('id', 'BANKpay');
img.setAttribute('class', 'SEPAinstant-qr-code');
img.setAttribute('style', 'width: 200px; float: left; margin: 0;');

var link = document.createElement('a');
link.setAttribute('href', 'https://BANKpay.plus/checkout/?i=' + qrPay.iban + '&a=' + amount);
link.innerHTML = 'Mit&nbsp;BANKpay+&nbsp;bezahlen';

if (amount > 0) {
    if (!$SEPAdigitalCode && elQR) {
        elQR.style.cssText = 'display: none';
        elQR.parentNode.append(img);
        elQR.parentNode.append(link);
    } // else if ($SEPAdigitalCode && $SEPAdigitalCode.classList.contains('SEPAinstant-qr-code')) {
        // $SEPAdigitalCode.innerHTML = img.outerHTML;
        // $SEPAdigitalCode.parentNode.append(link);

    // }
}

$SEPAdigitalCode = $('#BANKpay');
