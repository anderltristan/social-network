import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import store from './store';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import PrivateRoute from './components/common/PrivateRoute';
import CreateProfile from './components/create_profile/CreateProfile';
import EditProfile from './components/edit_profile/EditProfile';
import AddExperience from './components/add_credentials/AddExperience';
import AddEducation from './components/add_credentials/AddEducation';
import ProfileList from './components/profiles/ProfileList';
import Profile from './components/profile/Profile';
import NotFound from './components/not_found/NotFound';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import './App.css';
import { clearCurrentProfile } from './actions/profileActions';

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check if token has expired
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container">
                <Route exact path="/" component={Landing} />
                <Route exact path="/register" component={Register}/>
                <Route exact path="/login" component={Login} />
                <Route exact path="/profiles" component={ProfileList} />
                <Route exact path="/profile/:handle" component={Profile} />
                <Switch>
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/create-profile" component={CreateProfile} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/edit-profile" component={EditProfile} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/add-experience" component={AddExperience} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/add-education" component={AddEducation} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/feed" component={Posts} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/post/:id" component={Post} />
                </Switch>
                <Route exact path="/not-found" component={NotFound}/>
              </div>
            <Footer />  
          </div>
          </Router>
      </Provider>  
    );
  }
}

export default App;
