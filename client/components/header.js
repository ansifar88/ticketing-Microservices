import Link from "next/link";
export default ({ currentuser }) => {
  const links = [
    !currentuser && { label: "Sign In", href: "/auth/signin" },
    !currentuser && { label: "Sign Up", href: "/auth/signup" },
    currentuser && { label: "Sell tickets", href: "/tickets/new" },
    currentuser && { label: "My Orders", href: "/orders" },
    currentuser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((link) => link)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item m-3">
            <Link className="nav-link" href={href}  >
          {label}
            </Link>
        </li>
      );
    });
  return (
    <nav className="navbar navbar-light bg-light px-5">
      <Link className="navbar-brand" href="/">
        GitTix
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav nav-pills d-flex align-items-center ">
             {links}
            </ul>
      </div>
    </nav>
  );
};
