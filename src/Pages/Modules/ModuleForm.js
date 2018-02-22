import React, { Component } from 'react';
import ReactDom from 'react-dom';
import ModuleObservable from './ModuleObservable';
import style from  '../../assets/styles/modules.css';
import Button from '../../Helpers/Button/Button';

export default class ModuleForm extends React.Component {

    
    constructor(props){
        super(props);
        this.state = {ModuleName: '', RepoName: '', RepoUrl: '', Duration: 0, Color: '', Optional: false};
    }
    

    handelChange_1(e) {
        this.setState({ModuleName: e.target.value});
    }

    handelChange_2(e) {
        this.setState({RepoName: e.target.value});
    }

    handelChange_3(e) {
        this.setState({RepoUrl: e.target.value});
    }

    handelChange_4(e) {
        this.setState({Duration: e.target.value});
    }

    handelChange_5(e) {
        this.setState({Color: e.target.value});
    }

    handelChange_6(e) {
        this.setState({Optional: !this.state.Optional});
    }
   

    addMod(){
        let module = {};
        module.module_name = this.state.ModuleName;
        module.git_repo = this.state.RepoName;
        module.git_url = this.state.RepoUrl;
        module.default_duration = this.state.Duration;
        module.color = this.state.Color;
        if(this.state.Optional){
            module.Optional = 1;
        }
        else {
            module.Optional = 0;
        }
        this.props.Add(module);
    }
    render() {
        return (
            <form>
              <div className={style.popup_module}>
                <h1 className={style.popup_header}>{this.props.text}</h1>
                <div className={style.popup_input}>
                  <input type='text' placeholder='Module Name' onChange={this.handelChange_1.bind(this)}/>
                  <input type='text' placeholder='Repo Name' onChange={this.handelChange_2.bind(this)}/>
                  <input type='text' placeholder='Repo URL' onChange={this.handelChange_3.bind(this)}/>
                  <input type='text' placeholder='Duration' onChange={this.handelChange_4.bind(this)}/>
                  <input type='color' placeholder='Color' onChange={this.handelChange_5.bind(this)}/>
                  <label><input type='checkbox' onChange={this.handelChange_6.bind(this)}/>Optional</label>
                </div>
                <div className={style.popup_button}>  
                  <Button onClick={this.props.Cansel}>CANSEL</Button>
                  <Button onClick={this.addMod.bind(this)}>ADD</Button>
                </div>
              </div>
            </form>
          );
    }
}
