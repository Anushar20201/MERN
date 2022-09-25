import React from 'react';
import { useParams } from 'react-router-dom';
import Auth from '../utils/auth';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { Navigate, useParams } from 'react-router-dom';
import { ADD_FRIEND } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import ThoughtForm from '../components/ThoughtForm';

const Profile = () => {
  const { username: userParam } = useParams();
  // Well, we already did the part that actually loads the component for each URL in the previous lesson when we set up the <Route> component to use /:username? syntax, indicating that the username is optional. This means that on component load, the useParams() Hook we use will have a value if it's another user's profile and won't have a value if it's ours. Let's update our useQuery() Hook to check the value of our parameter and conditionally run a query based on the result.
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  //First, we need to destructure the mutation function from ADD_FRIEND so we can use it in a click function. Add the following code to the const definitions at the top of the Profile component function:
  const [addFriend] = useMutation(ADD_FRIEND);


  const user = data?.me || data?.user || {};

  // navigate to personal profile page if username is the logged-in user's
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          {/* Viewing <usernames>'s profile. */}
          {/* Viewing {user.username}'s profile. */}
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>
        {/* With these changes, the userParam variable is only defined when the route includes a username (e.g., /profile/Marisa86). Thus, the button won't display when the route is simply /profile. */}
        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">{/* PRINT THOUGHT LIST  */}</div>
        <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />

        <div className="col-12 col-lg-3 mb-3">{/* PRINT FRIEND LIST */}
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>

      <div className="mb-3">{!userParam && <ThoughtForm />}</div>

    </div>
  );
};

export default Profile;
