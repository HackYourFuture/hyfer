function Observable() {
    this._observers = []
    this._modules = []
    this._isChanged = false
    this._serverModules = []

    this.subscribe = (f) => {
        this._observers.push(f)
    }
    this.unsubscribe = (f) => {
        this._observers = this._observers.filter(e => e !== f)
    }
    this.getModules = () => {
        return this._modules
    }
    this.setModules = (new_moules) => {
        this._isChanged = true
        this._modules = new_moules
        for (let f of this._observers)
            f(new_moules)
    }
    this.initModules = (server_moules) => {
        this._serverModules = server_moules
        this._isChanged = false
        this._modules = server_moules.map(a => ({...a}))
        for (let f of this._observers)
            f(server_moules)
    }
    this.isChanged = () => {
        return this._isChanged
    }
    this.resetModules = () => {
        this.initModules(this._serverModules)
    }
}

var ModuleObservable = new Observable()
export default ModuleObservable