const api_url = "http://localhost:3000/api"


class moduleServiceBack {
    loadModules(callBack){
        const token = localStorage.getItem("token")
		fetch(`${api_url}/modules` , {
            credentials: "same-origin",
            headers: {
            'Authorization':'Bearer ' + token,
        }})
		.then(res => res.json())
		.then(resJson => {
            callBack(resJson)
		})
		.catch(error => {
            console.log(error)
            throw new Error('Server error!')
		})
    }

    saveModules(modules , callBack) {
        const token = localStorage.getItem("token")
        fetch(`${api_url}/modules`, {
              method: 'PATCH',
              credentials: "same-origin",
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization':'Bearer ' + token,
              },
              body: JSON.stringify(modules),
          })
          .then(res => {
              //console.log(res);
              callBack()
          })
          .catch((error) => {
            console.log(error)
            throw new Error('Server error!')
        })
    }
    // addModule(moduleName, repoName, repoUrl, duration){
    //     const body = {
    //         module_name: moduleName,
    //         git_repo: repoName,
    //         git_url: repoUrl,
    //         default_duration: duration
    //     };
        
        
    //     fetch(`${BASE_URL}/modules`, {
    //         method: 'POST',
    //         headers: {
    //           'Conetent-Type': 'application/json'
    //         },
    //         body: JSON.stringify(body)
    //       }).then(res => console.log(res));
    // };
}

var ModuleServiceBack = new moduleServiceBack()
export default ModuleServiceBack