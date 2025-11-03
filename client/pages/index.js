import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const LandingPage = ({ currentUser, tickets }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Concert", "Sports", "Tech", "Theatre"];

  const filteredTickets =
    selectedCategory === "All"
      ? tickets
      : tickets.filter((ticket) => ticket.category === selectedCategory);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold display-6">Available Tickets</h1>
        <p className="text-muted">
          {currentUser
            ? `Welcome back, ${currentUser.email}!`
            : "Sign in to purchase or create tickets."}
        </p>

        {/* Category Filter */}
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${
                selectedCategory === cat
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Cards */}
      <div className="row g-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="col-md-4 col-sm-6">
              <div className="card hover-shadow-sm h-100 border-0 shadow-sm">
                {/* Default Image */}
                <Image
                  src="https://unsplash.com/photos/group-of-people-watching-concert-U7HLzMO4SIY"
                  alt={ticket.title}
                  width={400}
                  height={221}
                  className="card-img-top rounded-top"
                  style={{ objectFit: "cover" }}
                />

                <div className="card-body">
                  <h5 className="card-title fw-semibold">{ticket.title}</h5>
                  <p className="card-text text-muted mb-2">
                    {ticket.category || "Uncategorized"}
                  </p>
                  <p className="card-text fw-bold text-success">
                    ₹{ticket.price}
                  </p>
                </div>

                <div className="card-footer bg-white border-0 text-center pb-4">
                  <Link
                    href="/tickets/[ticketId]"
                    as={`/tickets/${ticket.id}`}
                    className="btn btn-outline-primary w-75"
                  >
                    View Ticket
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-ticket-perforated fs-1"></i>
            <p className="mt-3">No tickets available right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets/");
  return { tickets: data };
};

export default LandingPage;
