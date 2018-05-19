import React, { Component } from 'react'
import style from '../../assets/styles/SynchronizeGithubData.css'
import loader from '../../assets/images/Eclipse.gif'
import SynchronizeResultModal from '../../components/Users/SynchronizeResultModal/SynchronizeResultModal'
import { getAllGroupsWithIds } from '../../util'
import { error_bundle } from '../../notify';

const token = localStorage.getItem("token")

export default class SynchronizeGithubData extends Component {

    state = {
        githubApi: [],
        hyferApi: [],
        conflictData: [],
        loading: false,
        synchronized: false
    }

    handelSynchronizeData = async () => {
        this.setState({
            loading: true,
        })

        const res = await fetch('http://localhost:3005/api/students', {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
        const githubApi = await res.json().catch(error_bundle)
        const hyferApi = await getAllGroupsWithIds().catch(error_bundle)

        let groups = hyferApi.map(group => group.group_name)
        let conflictData = githubApi.filter(team => {
            if (team.teamName.match(/class/i)) {
                let classNumber = team.teamName.match(/\d+/g)
                let className = `Class ${Number(classNumber)}`
                if (!groups.includes(className)) {
                    return true
                }
            } else if (!groups.includes(team.teamName)) {
                return true
            }
            return false
        })

        conflictData = conflictData.map(team => {
            return {
                ...team,
                selected: false,
                members: team.members.map(member => {
                    return {
                        ...member,
                        selected:false
                    }
                })
            }
        })

        this.setState({
            githubApi,
            hyferApi,
            conflictData,
            synchronized: true,
            loading: false
        })
    }

    handelCloseSyncModal = () => {
        this.setState({
            ...this.state,
            synchronized: false,
        })
    }

    render() {

        return (
            <div>
                <button onClick={() => this.handelSynchronizeData()} className={style.syncButton}>
                    {this.state.loading === false ? "Synchronize"
                        : <img src={loader} alt="loader" className={style.loadingImg} />}
                </button>
                <SynchronizeResultModal
                    githubApi={this.state.githubApi}
                    conflictData={this.state.conflictData}
                    synchronized={this.state.synchronized}
                    handelClose={this.handelCloseSyncModal}
                />
            </div>
        )
    }
}