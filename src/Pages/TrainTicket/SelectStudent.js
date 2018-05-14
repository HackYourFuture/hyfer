import React, { Component } from 'react';
import Styles from '../../assets/styles/selectStudent.css';


class selectStudent extends Component {

  render() {
    const { teamMembers } = this.props;
    return (
      <div>
        {
          teamMembers.map(team => (
            <ul key={team.teamName}>
              <h2>{team.teamName}</h2>
              {
                team.members.map(member => (
                  <ul className={Styles.studentContainer} key={member.id}>
                    <li><span>{member.name}</span></li>
                    <li><span>{member.location}</span></li>
                    <li className={Styles.imgContainer}>
                      <img className={Styles.img}
                        src={member.avatar_url} alt={member.name} />
                    </li>
                    <li><input type="checkbox" /></li>
                  </ul>
                ))
              }
            </ul>
          )
          )
        }
      </div>
    );
  }
}

export default selectStudent
