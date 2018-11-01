import React, { Component } from 'react';
import Moment from 'react-moment';

class ProfileCredentials extends Component {
  render() {
    const { experience, education, skills } = this.props;

    const listSkills = skills.map((skill, index) => (
      <div key={index} className="p-3">
        <i className="fa fa-check"></i> {skill}
      </div>
    ));

    const expItems = experience.map(exp => (
      <li key={exp._id} className="list-group-item">
        <h4>{exp.company}</h4>
        <p>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment> -
          {exp.to === null ? ( 'Now') : <Moment format="YYYY/MM/DD">{exp.to}</Moment>}
        </p>
        <p>
          <strong>{exp.title}</strong>
        </p>
        <p>
          {exp.location === '' ? null : (<span><strong>Location: </strong> {exp.location}</span>)}
        </p>
        <p>
          {exp.description === '' ? null : (<span><strong>Description: </strong> {exp.description}</span>)}
        </p>  
      </li>  
    ))

    const eduItems = education.map(edu => (
      <li key={edu._id} className="list-group-item">
        <h4>{edu.school}</h4>
        <p>
          <Moment format="YYYY/MM/DD">{edu.from}</Moment> -
          {edu.to === null ? ( 'Now') : <Moment format="YYYY/MM/DD">{edu.to}</Moment>}
        </p>
        <p>
          <strong>Degree:</strong> {edu.degree}
        </p>
        <p>
          <strong>Field Of Study:</strong> {edu.fieldofstudy}
        </p>
        <p>
          {edu.description === '' ? null : (<span><strong>Description: </strong> {edu.description}</span>)}
        </p>  
      </li>  
    ))

    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          {expItems.length > 0 ? (
            <ul className="list-group">
              {expItems}
            </ul>
          ) : (
            <p className="text-center">No Experience Listed</p>  
          )}
        </div>
        <div className="col-md-6">
          <h3 className="text-center text-info">Education</h3>
          {eduItems.length > 0 ? (
            <ul className="list-group">
              {eduItems}
            </ul>
          ) : (
            <p className="text-center">No Education Listed</p>  
          )}
        </div>
        <div className="row text-center">
          <div className="col-md-12 mt-4">  
            <h3>Skills</h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                {listSkills}  
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileCredentials;