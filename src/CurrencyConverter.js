// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [fromCurr, setFromCurr] = useState("USD");
  const [toCurr, setToCurr] = useState("EUR");
  const [rates, setRates] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function convertCurrency() {
      try {
        if (!amount) return;

        setError("");
        setLoading(true);
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurr}&to=${toCurr}`,
          { signal: controller.signal }
        );
        const money = await res.json();

        setLoading(false);
        setRates(money.rates[toCurr]);
        setError("");
      } catch (error) {
        if (error.message !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    if (fromCurr === toCurr) return setRates(amount);
    convertCurrency();

    return function () {
      controller.abort();
    };
  }, [amount, fromCurr, toCurr]);

  useEffect(() => {
    document.title = `Convert : ${fromCurr} to ${toCurr}`;

    return () => {
      document.title = "React App";
    };
  }, [fromCurr, toCurr]);

  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(eve) => setAmount(+eve.target.value)}
      />
      <select
        value={fromCurr}
        onChange={(eve) => setFromCurr(eve.target.value)}
      >
        <option value="USD">USD</option>
        <option value="CAD">CAD</option>
        <option value="EUR">EUR</option>
        <option value="INR">INR</option>
      </select>
      <select value={toCurr} onChange={(eve) => setToCurr(eve.target.value)}>
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>
        {loading && "Loading ......."}
        {!loading && !error && amount && `${rates} ${toCurr}`}
      </p>
    </div>
  );
}
