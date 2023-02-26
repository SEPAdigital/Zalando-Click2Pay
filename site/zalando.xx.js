(function (doc) {
  const merchantUuid = "6eef7164-caee-4af9-a710-a4930086218c"
  const authToken = "218|5Tv660WfTYHUqmvsEREOT9L1F0Wpx5afk3HpHvTK"
  function bookmarklet() {
    // inject code only on `/order-detail` page
    if (
      location.href.match("zalando.[a-z]{2,4}/myaccount/order-detail") != null
    ) {

      let qrPay = null,
        elZPayInfo = $('h2[style="font-weight:bold"]');

      let bankDetailsDirty = null,
        bankDetails = [],
        elAmount =
          $('p[data-testid="customer_order-detail-view_open-amount-text"]') ||
          null,
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
        btnClasses = $("button[style='margin-top:25px;width:100%']").attr(
          "class"
        );

      function zalandoPay() {
        console.log("BANKpay+ Pay Zalando init");

        bankDetailsDirty = $(elZPayInfo).next().html().split("<br>") || null;
        if (bankDetailsDirty) {
          bankDetailsDirty.forEach(function (line) {
            if (line.split(":")) {
              let detail = line.split(":")[1].trim();
              bankDetails.push(detail);
            }
          });
        }
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
                .replace(
                  amount,
                  '<span class="sp-amount">' + amount + "</span>"
                )) ||
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

        elZPayInfo
          .html($("<span>").html(paymentInfoTxt))
          .attr("style", "font-weight: bold;text-align:left; display: block;");
        elZPayInfo.next().prepend(qrImg);
        elZPayInfo
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

        var payBar = null,
          container = $(
            $('[style="border-radius:4px"]').parent().parent().find("ol")[0]
          ),
          payUntilInfoBar = $('[role="status"');

        // payment button
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
            "text-align": "center",
          });

        container.prepend($(payBar.clone()));

        payBar = $('[role="payment"]');
        payUntilInfoBar.fadeOut();

        payBar
          .html(
            '<button class="SEPAinstant-link-pay bankpay-checkout ' +
              " " +
              btnClasses +
              '" style="width: 100%;"' +
              'href="#">Jetzt mit deinem Bankkonto bezahlen: € ' +
              newAmountFormatted +
              "</button>"
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
            $sel
              .parent()
              .attr("href", "#BANKpay+")
              .data("detail-url", itemDetailURL);

            $sel.find("img").css({ filter: "grayscale(1)" });

            $markedItems = $(this).find(".sp-return-this-marked");

            if ($markedItems.length > 0) {
              $markedItems
                .attr("style", "")
                .css({
                  "font-style": "normal",
                  "text-decoration": "none",
                  cursor: "zoom-out",
                })
                .removeClass("sp-return-this-marked");

              $sel.find("img").css({ filter: "none" });
            } else {
              $sel.find("img").css("filter: grayscale(1);");

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

            $(".sp-amount").text(newAmountFormatted); // .fadeOut().fadeIn()

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
                "Jetzt mit deinem Bankkonto bezahlen: € " + newAmountFormatted
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
      let txStatus,
        tx,
        checkoutId,
        baseUrl = "https://BANKpay.plus",
        BANKpay = {
          api: baseUrl + "/api",
          checkout: baseUrl + "/checkout",
          bank_sca: baseUrl + "/bank-sca",
        };

      function pay(__props = false) {
        txStatus = "new";

        $(".bankpay-iban").each(function () {
          $(this).html($(this).html().replace(/[^a-zA-Z0-9]/g, '').toUpperCase());
        });

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
          "Bearer " + authToken
        );
        xhr.setRequestHeader("Accept", "application/json");

        xhr.onload = function () {
          tx = JSON.parse(xhr.responseText);
          url = null;
          txStatus = "processing";

          if (tx.error || tx.message) {
            console.log("API Error : /");
          }

          $(".bankpay-checkout-status-url").text(
            BANKpay.checkout + "/" + tx.uuid
          );

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

        xhr.send(data);
      }

      // BANKpay+ setup
      if ($("#sepa-digital-pay-code").length == 0) {
        zalandoPay();
      } else {
        console.log("BANKpay+ Zalando already loaded.");
      }
    }
    // end: url check
  }

  if (typeof jQuery == "undefined") {
    var script_jQuery = document.createElement("script");
    script_jQuery.src = "https://code.jquery.com/jquery-latest.min.js";
    script_jQuery.onload = bookmarklet;
    doc.body.appendChild(script_jQuery);
  } else {
    bookmarklet();
  }
})(document);
