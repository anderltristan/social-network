import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfiles } from '../../actions/profileActions';
import ProfileItem from './ProfileItem';
import Spinner from '../common/Spinner';

class ProfileList extends Component {    
    componentDidMount() {
        this.props.getProfiles();
    }
    
    render() {
        const { profiles, loading } = this.props.profile;
        let profileItems;

        if (profiles == null || loading) {
            profileItems = (
                <Spinner />
            );
        } else {
            if (profiles.length > 0) {
                profileItems = (
                    profiles.map(profile => (
                        <ProfileItem key={profile._id} profile={profile}/>
                    ))
                );
            } else {
                profileItems = <h4>No Profiles Found</h4>
            }
        }

        return (
            <div className = "profiles">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="display-4 text-center">Student Profiles</h1>
                            <p className="lead text-center">Browse and connect with other students.</p>
                            { profileItems }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ProfileList.propTypes = {
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        profile: state.profile
    }
}

export default connect(mapStateToProps, { getProfiles })(ProfileList)
