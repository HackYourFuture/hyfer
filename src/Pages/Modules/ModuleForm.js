import React from 'react';
import style from '../../assets/styles/modules.css';
import ModalDialog from '../../components/ModalDialog';


export default class ModuleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ModuleId: '',
      ModuleName: '',
      RepoName: '',
      RepoUrl: '',
      Duration: '',
      Color: '',
      Optional: false,
      focusId: '',
      errorIds: []
    };
  }

  componentDidMount = () => {
    const module = this.props.module
    if (module) {
      this.setState({
        ModuleId: module.id,
        ModuleName: module.module_name,
        RepoName: module.git_repo,
        RepoUrl: module.git_url,
        Duration: module.default_duration,
        Color: module.color,
        Optional: module.optional === 1 ? true : false,
        focusId: '',
        errorIds: []
      })
    }
    else {
      this.resetForm()
    }
  }

  onFocus = (e) => {
    this.setState({ focusId: e.target.id });
  }
  onBlur = (e) => {
    this.setState({ focusId: '' });
  }

  inputChanged = (e) => {
    const id = e.target.id
    const val = e.target.value
    this.setState({ [id]: val });
    this.validateInput(id, val)

  }

  validateInput(id, val) {
    if (id === "RepoUrl") {
      if (val !== "" && !this.isURL(val)) {
        this.RegError(id)
      }
      else {
        this.UnRegError(id)
      }
    }
    if (id === "Duration") {
      if (val !== "" && (isNaN(val) || val <= 0 || val > 6)) {
        this.RegError(id)
      }
      else {
        this.UnRegError(id)
      }
    }
    if (id === "Color") {
      if (val !== "" && !this.isColor(val)) {
        this.RegError(id)
      }
      else {
        this.UnRegError(id)
      }
    }
  }

  isFormValidate() {
    if (this.state.errorIds.length === 0 &&
      this.state.ModuleName !== '' &&
      this.state.RepoName !== '' &&
      this.state.RepoUrl !== '' &&
      this.state.Duration !== '' &&
      this.state.Color !== ''
    ) {
      return true
    }
    else {
      return false
    }
  }

  resetForm() {
    this.setState({
      ModuleId: '',
      ModuleName: '',
      RepoName: '',
      RepoUrl: '',
      Duration: '',
      Color: '',
      Optional: false,
      focusId: '',
      errorIds: []
    });
  }

  RegError(id) {
    if (!this.state.errorIds.includes(id)) {
      this.setState({ errorIds: [...this.state.errorIds, id] });
    }
  }

  UnRegError(id) {
    this.setState({
      errorIds:
        this.state.errorIds.filter(item => {
          return item !== id
        })
    });
  }

  isURL(str) {
    return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm.test(str);
  }

  isColor(val) {
    return /^#[0-9A-F]{6}$/i.test(val)
  }

  colorChanged = (e) => {
    this.setState({ Color: e.target.value });
    this.UnRegError("Color")
  }

  optionalToggle = (e) => {
    this.setState({ Optional: !this.state.Optional });
  }

  addModule = (e) => {
    let module = {};
    module.id = this.state.ModuleId;
    module.module_name = this.state.ModuleName;
    module.git_repo = this.state.RepoName;
    module.git_url = this.state.RepoUrl;
    module.default_duration = this.state.Duration;
    module.color = this.state.Color;
    if (this.state.Optional) {
      module.optional = 1;
    }
    else {
      module.optional = 0;
    }
    this.props.onAdd(module);
    this.props.onCancel();

    if (!this.props.module)
      this.resetForm()
  }

  render() {
    return (
      <ModalDialog visible={this.props.visible}
        closeClicked={this.props.onCancel}
        title={this.props.title}>
        <div>
          <div className={style.ModuleRow}>
            <label htmlFor="ModuleName"
              className={`
                ${this.state.focusId === "ModuleName" ? style.focus : ''} 
                ${this.state.ModuleName !== "" ? style.notEmpty : ''} 
                ${this.state.errorIds.includes("ModuleName") ? style.error : ''}`} >
              Module Name
            </label>
            <input id="ModuleName" type='text' className={`
              ${this.state.focusId === "ModuleName" ? style.focus : ''} 
              ${this.state.errorIds.includes("ModuleName") ? style.error : ''}`}
              onChange={this.inputChanged} onBlur={this.onBlur} onFocus={this.onFocus}
              value={this.state.ModuleName} />
          </div>
          <div className={style.ModuleRow}>
            <label htmlFor="RepoName" className={`
              ${this.state.focusId === "RepoName" ? style.focus : ''} 
              ${this.state.RepoName !== "" ? style.notEmpty : ''} 
              ${this.state.errorIds.includes("RepoName") ? style.error : ''}`} >
              Repo Name
            </label>
            <input id="RepoName"
              type='text'
              className={` 
                ${this.state.focusId === "RepoName" ? style.focus : ''} 
                ${this.state.errorIds.includes("RepoName") ? style.error : ''}`
              }
              onChange={this.inputChanged}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              value={this.state.RepoName || ''} />
          </div>
          <div className={style.ModuleRow}>
            <label htmlFor="RepoUrl"
              className={`${this.state.focusId === "RepoUrl" ? style.focus : ''} 
              ${this.state.RepoUrl !== "" ? style.notEmpty : ''} 
              ${this.state.errorIds.includes("RepoUrl") ? style.error : ''}`} >
              Repo Url
            </label>
            <input id="RepoUrl"
              type='text'
              className={`
                ${this.state.focusId === "RepoUrl" ? style.focus : ''} 
                ${this.state.errorIds.includes("RepoUrl") ? style.error : ''}`
              }
              onChange={this.inputChanged}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              value={this.state.RepoUrl || ''} />
          </div>
          <div className={style.ModuleRow}>
            <label htmlFor="Duration"
              className={`
                ${this.state.focusId === "Duration" ? style.focus : ''} 
                ${this.state.Duration !== "" ? style.notEmpty : ''} 
                ${this.state.errorIds.includes("Duration") ? style.error : ''}
              `}>
              Duration
            </label>
            <input id="Duration"
              type='text'
              className={`
                ${this.state.focusId === "Duration" ? style.focus : ''} 
                ${this.state.errorIds.includes("Duration") ? style.error : ''}`}
              onChange={this.inputChanged}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              value={this.state.Duration || ''} />
          </div>
          <div className={style.ModuleRow}>
            <label htmlFor="Color"
              className={`${this.state.focusId === "Color" ? style.focus : ''} 
                ${this.state.Color !== "" ? style.notEmpty : ''} 
                ${this.state.errorIds.includes("Color") ? style.error : ''}
                `} >
              Color
            </label>
            <input id="Color"
              type='text'
              className={`${this.state.focusId === "Color" ? style.focus : ''} 
                ${this.state.errorIds.includes("Color") ? style.error : ''}`}
              onChange={this.inputChanged}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              value={this.state.Color || ''} />
            <input type="color"
              value={this.state.Color || ''}
              onChange={this.colorChanged} />
          </div>
          <div className={style.ModuleRow}>
            <div className={style.checkBoxContainer} onClick={this.optionalToggle}>
              <div className={`${style.checkBox} ${this.state.Optional ? style.checked : ""}`} ></div>
              <div className={style.checkBoxLabel}>Optional</div>
            </div>
          </div>
          <div className={style.ModuleRow}>
            <button className={`${style.textButton} ${style.cancelButton}`}
              onClick={this.props.onCancel}>
              CANCEL
            </button>
            <button className={`${style.textButton} ${style.addButton}`}
              disabled={!this.isFormValidate()}
              onClick={this.addModule}>
              {this.props.actionName}
            </button>
          </div>
        </div>
      </ModalDialog>
    );
  }
}
