import { error_bundle } from '../../notify'

const api_url = 'http://localhost:3000/api'

class moduleServiceBack {
    
    async loadModules(callBack) {
        const token = localStorage.getItem('token')
        try {
            const res = await fetch(`${api_url}/modules`, {
                credentials: 'same-origin',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            if (!res.ok) throw res
            const resJson = await res.json()
            callBack(resJson)
        } catch (err) { error_bundle(err) }
    }

    async saveModules(modules, callBack) {
        const token = localStorage.getItem('token')
        try {
            await fetch(`${api_url}/modules`, {
                method: 'PATCH',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify(modules)
            })
            await callBack()
        } catch (err) { error_bundle(err) }
    }
}

const ModuleServiceBack = new moduleServiceBack()
export default ModuleServiceBack
