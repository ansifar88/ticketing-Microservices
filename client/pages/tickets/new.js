import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets/",
    method: "post",
    body: { title, price },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2));
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-4">
              <h2 className="fw-bold mb-4 text-center text-primary">
                Create New Ticket
              </h2>

              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                    placeholder="e.g. Coldplay Concert"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onBlur={onBlur}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control"
                    placeholder="e.g. 299.99"
                    required
                    min="0"
                  />
                </div>

                {errors && (
                  <div className="alert alert-danger mt-3 mb-0">{errors}</div>
                )}

                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Create Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>

          <p className="text-center text-muted mt-4 mb-0 small">
            Once created, your ticket will be visible on the marketplace.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewTicket;
