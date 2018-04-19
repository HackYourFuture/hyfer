<<<<<<< HEAD

=======
>>>>>>> fd5bb6996e04fc88f74beffa905cca17912c68c5
class Observable {
    constructor() {
        this._observers = [];
        this._modules = [];
        this._isChanged = false;
        this._serverModules = [];
        
        this.subscribe = (f) => {
            this._observers.push(f);
        };
        this.unsubscribe = (f) => {
            this._observers = this._observers.filter(e => e !== f);
        };
        this.getModules = () => {
            return this._modules;
        };
        this.setModules = (new_modules) => {
            this._isChanged = true;
            this._modules = new_modules;
            for (let f of this._observers)
                f(new_modules);
        };
        this.initModules = (server_modules) => {
            this._serverModules = server_modules;
            this._isChanged = false;
            this._modules = server_modules.map(a => ({ ...a }));
            for (let f of this._observers)
                f(server_modules);
        };
        this.isChanged = () => {
            return this._isChanged;
        };
        this.resetModules = () => {
            this.initModules(this._serverModules);
        };
<<<<<<< HEAD

=======
>>>>>>> fd5bb6996e04fc88f74beffa905cca17912c68c5
    }
}

const ModuleObservable = new Observable()
<<<<<<< HEAD

=======
>>>>>>> fd5bb6996e04fc88f74beffa905cca17912c68c5
export default ModuleObservable;
