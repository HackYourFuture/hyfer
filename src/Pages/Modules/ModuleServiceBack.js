const api_url = 'http://localhost:3000/api'

class moduleServiceBack {
    
    async loadModules (callBack)  {
        const token = localStorage.getItem('token')

        try {
            const res = await fetch(`${api_url}/modules`, {
                credentials: 'same-origin',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            const resJson = await res.json()
            callBack(resJson)
        } catch (error) {
            console.log(error)
            throw new Error('Server error!')
        }
    
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
        } catch(error){
            console.log(error)
            throw new Error('Server error!')
        }
    }
}

const ModuleServiceBack = new moduleServiceBack()
export default ModuleServiceBack
