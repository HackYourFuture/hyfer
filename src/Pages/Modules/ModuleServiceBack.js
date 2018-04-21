import locals from '../../util/locals'

const { REACT_APP_API_URL } = process.env

const token = localStorage.getItem('token')
class moduleServiceBack {

    loadModules = async (callBack) => {
        const load = await locals.request(`${REACT_APP_API_URL}/modules`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        const resJson = await load.json()
        callBack(resJson)
    }

    saveModules = async (modules, callBack) => {
        const load = await locals.request(`${REACT_APP_API_URL}/modules`, {
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
