// document.addEventListener("DOMContentLoaded", function (event) {
const merchantUuid = "6eef7164-caee-4af9-a710-a4930086218c";
let qrPay = null;

// Bitte stelle sicher, dass deine Zahlung von € 194,10 bei uns bis zum Mo., 05.12.2022 eingeht.
let bankDetailsDirty = $($("h2.isiDul")).next().html().split("<br>") || null,
  bankDetails = [],
  elAmount =
    $('p[data-testid="customer_order-detail-view_open-amount-text"]') || null,
  datePayment =
    (elAmount &&
      elAmount.text().match(/[A-Za-z]+\.\, [0-9]+\.[0-9]+\.[0-9]+/) &&
      elAmount.text().match(/[A-Za-z]+\.\, [0-9]+\.[0-9]+\.[0-9]+/)[0]) ||
    "0",
  amount =
    (elAmount &&
      elAmount.text().match(/[0-9]+([,.][0-9]+)?/) &&
      elAmount.text().match(/[0-9]+([,.][0-9]+)?/)[0]) ||
    "0",
  newAmount = parseFloat(amount.replace(",", ".")),
  // newAmount = parseFloat($('[data-testid="customer_order-detail-view_open-amount-text"]').text().match(/[0-9]+([,.][0-9]+)?/)[0].toString().replace(',', '.')) || 0,
  newAmountFormatted = parseFloat(newAmount)
    .toFixed(2)
    .toString()
    .replace(".", ","),
  $SEPAdigitalCode = $("#sepa-digital-pay-code") || null,
  $SEPAdigitalButton = $("#sepa-digital-pay-button") || null,
  btnClasses = $("div.isiDul a").attr("class");

function zalandoPay() {
  // authenticate BANKpay+ L2P App
  localStorage.setItem(
    "bankpay-authToken",
    "218|5Tv660WfTYHUqmvsEREOT9L1F0Wpx5afk3HpHvTK"
  );

  if (bankDetailsDirty) {
    bankDetailsDirty.forEach(function (line) {
      if (line.split(":")) {
        let detail = line.split(":")[1].trim();
        bankDetails.push(detail);
      }
    });
  }
  // console.log(bankDetails);
  (qrPay = {
    recipient: bankDetails[0],
    iban: bankDetails[1].replace(/\s/g, ""),
    bic: bankDetails[2],
    reference: bankDetails[6].trim(), // + ' via BANKpay',
    amount: newAmount,
  }),
    (priceHtml =
      (elAmount &&
        elAmount
          .text()
          .replace(amount, '<span class="sp-amount">' + amount + "</span>")) ||
      "0"),
    (qrUrl =
      "https://dev.matthiasschaffer.com/bezahlcode/api.php?iban=" +
      qrPay.iban +
      "&bic=" +
      qrPay.bic +
      "&name=" +
      qrPay.recipient +
      "&usage=" +
      qrPay.reference +
      " via BANKpay" +
      "&amount=");

  // console.log("*** priceHtml", priceHtml);
  // console.log("*** qrUrl", qrUrl);

  let img = document.createElement("img");

  // div
  img.setAttribute("id", "sepa-digital-pay-code");
  img.setAttribute("class", "SEPAinstant-qr-code");

  // img
  img.setAttribute("src", qrUrl + qrPay.amount);
  img.setAttribute(
    "style",
    "width: 170px; float: right; margin: 5px 45px 10px 0;"
  );

  let qrImg = img,
    paymentInfoTxt =
      'Rechnungsbetrag: € <span class="sp-amount">' +
      newAmountFormatted +
      "</span> bis " +
      datePayment +
      " überweisen.";

  /*$('[role="status"]')
    .css({
      position: "sticky",
      top: 0,
      "min-height": "80px",
      "z-index": "9999",
    })
    .find("p")
    .css({
      "padding-top": "13px",
      "font-weight": "bold",
      "text-align": "center",
    });
  $('[role="status"]').find("svg").hide();*/

  //     .attr("style", "text-align:center; display: block;");
  $("h2.isiDul")
    .html($("<span>").html(paymentInfoTxt))
    .attr("style", "font-weight: bold;text-align:left; display: block;");
  $("h2.isiDul").next().prepend(qrImg);
  $("h2.isiDul")
    .next()
    .prepend(
      $(
        '<span class="bankpay-payment-checkout" data-merchant-uuid="' +
          merchantUuid +
          '" data-checkout-uuid=""></span>'
      )
    );

  $('[style="display:flex;align-items:flex-start"]')
    .parent()
    .next()
    .html(
      $('[style="display:flex;align-items:flex-start"]')
        .next()
        .find("dl")
        .clone()
    );
  $('[style="display:flex;align-items:flex-start"]').next().remove();
  $SEPAdigitalCode = $("#sepa-digital-pay-code");

  $('[data-testid="customer_order-detail-view_open-amount-text"]').html(
    priceHtml
  );

  var statusBar = $('[role="status"]'),
    payBar = null,
    container = $(
      $('[style="border-radius:4px"]').parent().parent().find("ol")[0]
    ),
    payUntilInfoBar = $('[role="status"');

  // bankpay plus payment button
  // payBar = statusBar.clone().attr("role", "payment").css({
  payBar = $("<div>")
    .data("bankpay-pay-by-link-button", "")
    .attr("role", "payment")
    .css({
      position: "sticky",
      top: 0,
      "z-index": "9999",
      "text-align": "left",
      display: "block",
      margin: "0 0 1em 0",
      'text-align': 'center',
    });

  container.prepend($(payBar.clone()));

  payBar = $('[role="payment"]');

  // payUntilInfoBar.remove();
  payUntilInfoBar.fadeOut();

  payBar
    .html(
      '<a class="SEPAinstant-link-pay bankpay-checkout ' +
        " " +
        btnClasses +
        '" style="width: 100%;" target="_blank" ' +
        'href="#">Jetzt mit deinem Bankkonto bezahlen: € ' +
        newAmountFormatted +
        '</a>'
    )
    .fadeOut()
    .fadeIn();

  $(".SEPAinstant-link-pay")
    .off()
    .on("click", function (e) {
      e.preventDefault();
      pay();
    });

  $("main div ol li ul a")
    .attr("href", "#")
    .off()
    .css({ cursor: "context-menu" })
    .click(function (e) {
      e.preventDefault();

      let $sel = $(this);
      let $markedItems = null,
        // TODO
        cancelTxt = $sel
          .find(
            "div.z-sos-position-details__cancellation-status span.z-sos-position-details__status-flag-text"
          )
          .first()
          .text(),
        lineAmount = parseFloat(
          $sel
            .text()
            .match(/[0-9]+([,.][0-9]+)?/)[0]
            .toString()
            .replace(",", ".")
        ),
        updatedAmount = 0;

      if (cancelTxt == "Storniert") {
        console.log("Storniert");
      }

      let itemDetailURL = $sel.parent().attr("href") + "#BANKpay+";
      $sel.parent().attr("href", "#BANKpay+").data("detail-url", itemDetailURL);

      $sel.find('img').css({'filter': 'grayscale(1)'})


      $markedItems = $(this).find(".sp-return-this-marked");

      if ($markedItems.length > 0) {
        // $sel.parent().find('img').css({'filter': 'none'})

        $markedItems
          .attr("style", "")
          .css({
            "font-style": "normal",
            "text-decoration": "none",
            cursor: "zoom-out",
          })
          .removeClass("sp-return-this-marked");

        $sel.find('img').css({'filter': 'none'})
      } else {
        $sel.find('img').css('filter: grayscale(1);')

        $sel
          .find("dl p:first-child")
          .css({
            "font-style": "italic",
            "text-decoration": "red wavy line-through",
            cursor: "zoom-in",
          })
          .addClass("sp-return-this-marked");

        $sel
          .find("dl")
          .parent("div:nth-child(1)")
          .find("div span")
          .css({
            "font-style": "italic",
            "text-decoration": "red wavy line-through",
            cursor: "zoom-in",
          })
          .addClass("sp-return-this-marked");
      }

      // $($('h2')[2]).parent().fadeOut();

      if ($markedItems.length > 0) {
        updatedAmount = newAmount + lineAmount;
      } else {
        updatedAmount = newAmount - lineAmount;
      }

      newAmount = updatedAmount;
      newAmountFormatted = parseFloat(updatedAmount)
        .toFixed(2)
        .toString()
        .replace(".", ",");
      console.log("newAmount: ", newAmountFormatted);

      $(".sp-amount").text(newAmountFormatted) // .fadeOut().fadeIn()

      $('[role="payment"]').css({
        position: "sticky",
        top: 0,
        "z-index": "9999",
        "text-align": "left",
        display: "block",
        margin: "0 0 1em 0",
      });

      $(".SEPAinstant-link-pay")
        .html(
          'Jetzt mit deinem Bankkonto bezahlen: € ' +
            newAmountFormatted
        )
        .fadeOut()
        .fadeIn();

      $SEPAdigitalCode
        .attr("src", qrUrl + newAmountFormatted)
        .trigger("create");

      $(".SEPAinstant-link-pay").off();
      $(".SEPAinstant-link-pay").on("click", function (e) {
        e.preventDefault();
        pay();
      });
    });
}

// BANKpay+
//const paymentUuid = Math.random().toString().substr(2, 8);

let txStatus,
  hasRef,
  tx,
  url,
  checkoutId,
  payWindow = null,
  payWindowTimer = null,
  baseUrl = "https://BANKpay.plus",
  BANKpay = {
    api: baseUrl + "/api",
    checkout: baseUrl + "/checkout",
    bank_sca: baseUrl + "/bank-sca",
  };

function pay(__props = false) {
  txStatus = "new";

  // window.addEventListener("load", function () {
  $(".bankpay-iban").each(function () {
    $(this).html(IBAN.printFormat($(this).html()));
  });

  //$(".bankpay-checkout").on("click", function () {
  txStatus = "processing";
  checkoutId = $(".bankpay-payment-checkout").data("checkout-uuid");

  $(".bankpay-checkout-status-url").text(
    "↯ BANKpay+ Link wird in neuem Fenster geladen …"
  );

  if (checkoutId != "") {
    var a = document.createElement("a");
    a.target = "_blank";
    a.href = BANKpay.checkout + "/" + checkoutId;
    a.click();
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", BANKpay.api + "/checkout", true);

  xhr.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("bankpay-authToken")
  );
  xhr.setRequestHeader("Accept", "application/json");

  xhr.onload = function () {
    tx = JSON.parse(xhr.responseText);
    url = null;

    if (tx.error || tx.message) {
      console.log("API Error : /");
    }

    // console.log("BANKpay+ Checkout API: ", tx);

    /* // do not set checkout-uuid for now
          $(".bankpay-payment-checkout")
            .data("checkout-uuid", tx.uuid);*/

    txStatus = "processing";

    $(".bankpay-checkout-status-url").text(BANKpay.checkout + "/" + tx.uuid);

    /*
    // redirect to BANKpay+ checkout in new tab / window
    var a = document.createElement("a");
    a.target = "_blank";
    a.href = BANKpay.checkout + "/" + tx.uuid;
    a.click();
    */

    // open BANKpay+
    const width_of_popup_window = 501,
      height_of_popup_window = 911,
      left = (screen.width - width_of_popup_window) / 2 - 250,
      top = (screen.height - height_of_popup_window) / 2 - 50;

    const payWindow = window.open(
      BANKpay.checkout + "/" + tx.uuid,
      "bankpay",
      "left=" +
        left +
        ",top=" +
        top +
        ",height=" +
        height_of_popup_window +
        ",width=" +
        width_of_popup_window
    );

    if (
      !payWindow ||
      payWindow.closed ||
      typeof payWindow.closed == "undefined"
    ) {
      popupBlocked = true;

      $(".bankpay-plus").html(
        "Hinweise: bitte Popup Fenster für BANKpay+ erlauben."
      );

      window.location.href = BANKpay.checkout + "/" + tx.uuid;

      /*var a = document.createElement("a");
      a.target = "_blank";
      a.href = BANKpay.checkout + "/" + tx.uuid;
      a.click();*/
    }

    $(payWindow).on("close", function () {
      console.log("payWindow closed");
      if (!bankInitError) {
        $(".bankpay-plus").html(
          "Bezahlvorgang wurde abgebrochen.<br />Bank auswählen um Zahlung zu starten."
        );
      }
    });

    if (window.focus) {
      payWindow.focus();
    }
    if (!payWindow.closed) {
      payWindow.focus();
    }
  };

  var reference = qrPay.reference;

  var data = new FormData(),
    clientId = $(".bankpay-payment-checkout").data("merchant-uuid"),
    txId = "zalando.de-" + btoa(reference);
  data.append("reference", reference);
  data.append("iban_to", qrPay.iban);
  data.append("amount", newAmount);
  data.append("correlationId", txId);
  data.append("clientId", clientId);
  data.append("checkoutId", checkoutId);
  // data.append("returnUrl", BANKpay.checkout + "/" + tx.uuid);
  // data.append("checkoutId", checkoutUrl);

  xhr.send(data);
  // });
  // });

  /*var __returned__ = {
    txStatus: txStatus,
  };
  Object.defineProperty(__returned__, "__isScriptSetup", {
    enumerable: false,
    value: true,
  });
  return __returned__;*/
}

// BANKpay+ setup
zalandoPay();
// });

/*
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    // handle IE
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    // handle other browsers
    script.onload = function () {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

// https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
loadScript(
  "//cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js",
  function () {
    // BANKpay+ init
    // zalandoPay();
  }
);


// load scripts
function l(u, i) {
  var d = document;
  if (!d.getElementById(i)) {
    var s = d.createElement("script");
    s.src = u;
    s.id = i;
    d.body.appendChild(s);
  }
}

// l('//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js', 'jquery');
l("//cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js", "jquery");
l("//SEPA.digital/js/iban.js", "jquery");

*/
