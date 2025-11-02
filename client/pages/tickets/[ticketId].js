import Router from "next/router";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders/",
    method: "post",
    body: { ticketId: ticket.id },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-4">
              <h2 className="fw-bold mb-3 text-primary text-center">
                {ticket.title}
              </h2>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="text-muted mb-1">Price</h5>
                  <h3 className="fw-bold text-success mb-0">
                    ₹{ticket.price.toFixed(2)}
                  </h3>
                </div>

                <button
                  onClick={doRequest}
                  className="btn btn-lg btn-primary px-4"
                >
                  <i className="bi bi-cart-check me-2"></i> Buy Now
                </button>
              </div>

              {errors && (
                <div className="alert alert-danger mt-3 mb-0">{errors}</div>
              )}

              <hr />

              <div className="text-center text-muted mt-3 small">
                Once purchased, your ticket will appear under{" "}
                <strong>My Orders</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;
