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
    onSuccess: (data) => setClientSecret(data.clientSecret),
  });

  useEffect(() => {
    doRequest();
  }, [orderId]);

  const handlePay = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });
    setLoading(false);

    if (result.error) {
      console.error(result.error.message);
      alert(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      Router.push("/orders");
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 mt-4">
      <div className="card-body p-4">
        <h4 className="fw-semibold mb-3 text-center text-primary">
          Enter Payment Details
        </h4>

        <div className="mb-3 border rounded p-3">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>

        {errors && <div className="alert alert-danger mt-3 mb-0">{errors}</div>}

        <div className="d-grid mt-4">
          <button
            type="button"
            onClick={handlePay}
            className="btn btn-primary btn-lg"
            disabled={!stripe || loading || !clientSecret}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-credit-card-2-front me-2"></i> Pay Now
              </>
            )}
          </button>
        </div>
      </div>
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
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger shadow-sm d-inline-block">
          <i className="bi bi-x-circle-fill me-2"></i> Order Expired
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">Complete Your Payment</h2>
            <p className="text-muted">
              Time left to pay:{" "}
              <span className="fw-bold text-danger">{timeLeft}</span> seconds
            </p>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm orderId={order.id} />
          </Elements>
        </div>
      </div>
    </div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
  hidePostalCode: true,
};
