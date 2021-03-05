import BuildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log("LANDING PAGE!");
  const client = BuildClient(context);
  const { data } = await client.get(
    "http://localhost:4000/api/users/currentuser"
  );
  console.log("this is data from index.js page", data);

  return data;
};

export default LandingPage;
