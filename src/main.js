import "./css/index.css";
import IMask from "imask";

const cardCrediteBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
);
const cardCrediteBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
);
const cardCrediteLogo = document.querySelector(
  ".cc-logo span:nth-child(2) img"
);

const setCardType = (type) => {
  const colors = {
    visa: ["#436d99", "#2d57f2"],
    masterCard: ["#df6f29", "#c69347"],
    default: ["black", "grey"],
  };

  cardCrediteBgColor01.setAttribute("fill", colors.visa[0]);
  cardCrediteBgColor02.setAttribute("fill", colors.visa[1]);
  cardCrediteLogo.setAttribute("src", `cc-${type}.svg`);
};

globalThis.setCardType = setCardType;

const securityCode = document.querySelector("#security-code");
const securityCodeParttern = {
  mask: "0000",
};

const securityCodeMask = IMask(securityCode, securityCodeParttern);

const experationDate = document.querySelector("#expiration-date");
const expirationDateParttern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
};

const expirationDataMask = IMask(experationDate, expirationDateParttern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    );

    console.log(foundMask);

    return foundMask;
  },
};

const cardNumberMask = IMask(cardNumber, cardNumberPatter);

const addButton = document.querySelector("#btn");

addButton.addEventListener("click", () => {
  alert("cartão adicionado");
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
});

const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value;
});

securityCodeMask.on("accept", () => {
  updateSecurityCode(securityCodeMask.value);
});

const updateSecurityCode = (code) => {
  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText = code.length === 0 ? "123" : code;
};

cardNumberMask.on("accept", () => {
  const cardType = cardNumberMask.masked.currentMask.cardtype;
  setCardType(cardType);
  updateCardNumber(cardNumberMask.value);
});

const updateCardNumber = (number) => {
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = number.length === 0 ? "1234 4567 8910 1112" : number;
};

expirationDataMask.on("accept", () => {
  updateExpirationDate(expirationDataMask.value);
});

const updateExpirationDate = (date) => {
  const ccExpiration = document.querySelector(".cc-expiration .value");
  ccExpiration.innerText = date.length === 0 ? "12/32" : date;
};
