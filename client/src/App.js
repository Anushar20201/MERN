import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

//establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink().
// const httpLink = createHttpLink({
//   uri: 'http://localhost:3001/graphql',
// });
// instead of remembering the above to change the absolute path every time we push it to production.

const httpLink = createHttpLink({
  uri: '/graphql',
})

// In this case, we don't need the first parameter offered by setContext(), which stores the current request object in case this function is running after we've initiated a request.
//we're not using the first parameter, but we still need to access the second one, we can use an underscore _ to serve as a placeholder for the first parameter.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link:  authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/login"
                element={<Login />}
              />
              <Route
                path="/signup"
                element={<Signup />}
              />
              {/* we specified that the /profile route must be exactly /profile for the Profile component to render. Alas, /profile/Zoe66 or any /profile/${username} URL counts as a completely different route */}
              {/* <Route
                path="/profile"
                element={<Profile />}
              />
              <Route
                path="/thought"
                element={<SingleThought />}
              /> */}
              <Route path="/profile">
                <Route path=":username" element={<Profile />} />
                <Route path="" element={<Profile />} />
              </Route>
              <Route
                path="/thought/:id"
                element={<SingleThought />}
              />
              <Route
                path="*"
                element={<NoMatch />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
