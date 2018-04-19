import locals from '../../util/locals'

const api_url = 'http://localhost:3000/api'

const token = localStorage.getItem('token')
class moduleServiceBack {


    loadModules = async (callBack) => {
        const load = await locals.request(`${api_url}/modules`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        const resJson = await load.json()
        callBack(resJson)
    }

    saveModules = async (modules, callBack) => {
        const load = await locals.request(`${api_url}/modules`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: modules
        })
        await load.json()
        callBack()
    }
}

const ModuleServiceBack = new moduleServiceBack()
export default ModuleServiceBack
