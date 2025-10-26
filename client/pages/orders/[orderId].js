import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Router from "next/router";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import useRequest from "../../hooks/use-request";

const stripePromise = loadStripe(
  "pk_test_51O11IzSJfBiixPMTXmoUugjdZRkftipLrwEqi3g4tNLnAHnARpN3IRSijAKk4NbRDbaW8Y2kIUa8hJT79i2S00zI00707Kncmo"
);

function CheckoutForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  const { doRequest, errors } = useRequest({
    url: "/api/payments/",
    method: "post",
    body: { orderId },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
  });

  useEffect(() => {
    doRequest();
  }, [orderId]);

  const handlePay = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    setLoading(false);

    if (result.error) {
      console.error(result.error.message);
      alert(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
        console.log(result,"result")
        Router.push('/orders')
      // Optionally redirect or show success message
    }
  };

  return (
    <div style={styles.formContainer} >

    <form onSubmit={(e) => e.preventDefault()}>
       <div style={styles.cardField}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      {errors}
      <button
        style={styles.button}
        type="button"
        onClick={handlePay}
        disabled={!stripe || loading || !clientSecret}
        >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
          </div>
  );
}

export default function OrderShow({ order }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, [order]);

  if (timeLeft <= 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <h1>Time left to pay: {timeLeft} seconds</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm orderId={order.id} />
      </Elements>
    </div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

const styles = {
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    padding: "20px",
    marginTop: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  cardField: {
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "10px",
  },
  button: {
    backgroundColor: "#635BFF",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
      padding: "10px 12px",
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
  hidePostalCode: true,
};