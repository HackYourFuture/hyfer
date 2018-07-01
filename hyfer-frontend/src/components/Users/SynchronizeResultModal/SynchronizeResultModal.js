import React, { Component } from 'react';
import style from '../SynchronizeResultModal/SynchronizeResultModal.css';
// import store from '../../../store/UserStore';

const token = localStorage.getItem('token');

export default class SynchronizeResultModal extends Component {
  state = {
    startingDate: '',
    className: null,
    conflictData: [],
    notification: '',
    selected: false,
  };

  UNSAFE_componentWillUpdate(nextProps) {
    if (
      nextProps.conflictData.length !== 0 &&
      this.state.conflictData.length === 0
    ) {
      this.setState({
        conflictData: this.props.conflictData,
      });
    }
  }

  handelSelectedData = (e, data) => {
    const conflictData = this.state.conflictData.map(team => {
      if (team.teamName === data.teamName && !data.selected) {
        return {
          ...team,
          selected: true,
          members: team.members.map(member => {
            return {
              ...member,
              selected: true,
            };
          }),
        };
      } else if (team.teamName === data.teamName && data.selected) {
        return {
          ...team,
          selected: false,
          members: team.members.map(member => {
            return {
              ...member,
              selected: false,
            };
          }),
        };
      }
      return team;
    });

    this.setState({
      conflictData,
    });
  };

  handelNewDateValue = e => {
    this.setState({
      startingDate: e.target.value,
    });
  };

  handelNewStartingDate = (teamName, startingDate) => {
    if (startingDate) {
      const conflictData = this.state.conflictData.map(team => {
        if (teamName === team.teamName) {
          return {
            ...team,
            created_at: new Date(startingDate).toISOString(),
          };
        }
        return team;
      });
      console.log(conflictData);
      this.setState({
        conflictData,
        notification: 'You have successfully changed the starting date!',
      });
    }
  };

  handelFirstToUpperCase = str => {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  };

  handelSaveUpdate = async () => {
    const updateList = this.state.conflictData
      .filter(team => team.selected)
      .map(team => {
        return {
          ...team,
          members: team.members.filter(member => member.selected),
        };
      });
    try {
      await fetch('http://localhost:3005/api/githubSync', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(updateList),
      });
    } catch (err) {
      console.log(err);
    }
    this.handelClose();
    window.location.reload();
  };

  handelSelectUser(e, data, userId) {
    const conflictData = this.state.conflictData.map(team => {
      if (team.teamName === data.teamName) {
        return {
          ...team,
          selected: true,
          members: team.members.map(member => {
            if (member.id === userId && !member.selected) {
              return {
                ...member,
                selected: true,
              };
            } else if (member.id === userId && member.selected) {
              return {
                ...member,
                selected: false,
              };
            }
            return member;
          }),
        };
      }
      return team;
    });
    this.setState({
      conflictData,
    });
  }

  handelClose = e => {
    this.props.handelClose && this.props.handelClose(e);
  };
  render() {
    if (!this.props.synchronized) {
      return null;
    }
    if (this.state.conflictData.length === 0) {
      return (
        <div className={style.backDrop}>
          <div className={style.upToDate}>
            <p> Your users list is up to date !! </p>
            <button
              className={style.button_cancel}
              onClick={e => {
                this.handelClose(e);
              }}
            >
              Close
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className={style.backDrop}>
        <div className={style.syncModal}>
          <div>
            <div>
              <h3>Update</h3>
            </div>
            <div className={style.resultSelector}>
              <ul className={style.resultBox}>
                {this.state.conflictData.map(team => {
                  return (
                    <li key={team.created_at} className={style.teamList}>
                      <input
                        type="checkbox"
                        checked={team.selected}
                        onChange={e => {
                          this.handelSelectedData(e, team);
                        }}
                      />
                      {this.handelFirstToUpperCase(team.teamName)}
                      <ul>
                        {team.members.map(member => {
                          return (
                            <li key={member.id} className={style.memberList}>
                              <input
                                type="checkbox"
                                checked={member.selected}
                                onChange={e => {
                                  this.handelSelectUser(e, team, member.id);
                                }}
                              />
                              {member.name ||
                                this.handelFirstToUpperCase(member.login)}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className={style.resultSelector}>
              <ul className={style.resultBox}>
                {this.state.conflictData.map(team => {
                  if (team.selected) {
                    return (
                      <li key={team.created_at} className={style.teamList}>
                        {this.handelFirstToUpperCase(team.teamName)}
                        <input
                          type="date"
                          className={style.dateSelector}
                          onChange={e => {
                            this.handelNewDateValue(e);
                          }}
                        />
                        <button
                          className={style.button_save_date}
                          onClick={() => {
                            this.handelNewStartingDate(
                              team.teamName,
                              this.state.startingDate,
                            );
                          }}
                        >
                          Save
                        </button>
                      </li>
                    );
                  }
                  return false;
                })}
              </ul>
            </div>
          </div>
          <button
            className={style.button_save}
            onClick={() => {
              this.handelSaveUpdate();
            }}
          >
            Save
          </button>
          <button
            className={style.button_cancel}
            onClick={e => {
              this.handelClose(e);
            }}
          >
            Cancel
          </button>
          <p>{this.state.notification}</p>
        </div>
      </div>
    );
  }
}
