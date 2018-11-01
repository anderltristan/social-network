import React, { Component } from 'react';
import isEmpty from '../../validation/isEmpty';

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    const firstName = profile.user.name.trim().split(' ')[0];

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">{firstName}'s Profile</h3>
            <p className="lead">{isEmpty(profile.bio) ? <span>{firstName} has not set a bio</span> : (<span>{profile.bio}</span>)}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileAbout;