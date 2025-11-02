import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import buildClient from "../api/build-client";
import Header from "../components/header";
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentuser={currentUser} />
      <div className="container">

      <Component currentUser={currentUser} {...pageProps} />
      </div>
    </>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");
  const pageProps =
    (await appContext.Component.getInitialProps?.(
      appContext.ctx,
      client,
      data.currentUser
    )) || {};
  console.log(pageProps);

  return { ...data, pageProps };
};

export default AppComponent;
