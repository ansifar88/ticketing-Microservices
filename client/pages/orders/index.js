const OrderIndex = ({ orders }) => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">My Orders</h2>
        <p className="text-muted mb-0">
          Track all your ticket purchases and payment statuses.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-receipt-cutoff fs-1 mb-3"></i>
          <p>No orders found. Go grab your first ticket!</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle shadow-sm rounded overflow-hidden">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Ticket</th>
                <th scope="col">Price</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td className="fw-semibold">{order.ticket.title}</td>
                  <td>₹{order.ticket.price.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        order.status === "complete"
                          ? "bg-success"
                          : order.status === "cancelled"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="text-center">
                    <a
                      href={`/orders/${order.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/orders/`);
  return { orders: data };
};

export default OrderIndex;
