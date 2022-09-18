import React from 'react';
//With these statements, we're importing the useQuery Hook from Apollo Client. This will allow us to make requests to the GraphQL server we connected to and made available to the application using the <ApolloProvider> component in App.js earlier.
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';


const Home = () => {

  // use useQuery hook to make query request
  // Apollo's @apollo/client library provides a loading property to indicate that the request isn't done just yet. When it's finished and we have data returned from the server, that information is stored in the destructured data property.
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>{/* PRINT THOUGHT LIST */}
          <main>
            <div className="flex-row justify-space-between">
              <div className="col-12 mb-3">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </main>
  );
};

export default Home;
