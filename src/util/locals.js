

class locals {
    request(url, { method, body, headers, credentials }, callback, ...args) {
        const params = {
            body: JSON.stringify(body),
            credentials: credentials || 'same-origin',
            method: method || 'GET',
            headers: headers || {},
        }

        let options = {}
        if (!params.body) {
            delete params.body
        }
        options = { method, ...params }
        return fetch(url, options)
            .catch(error => {
                if (process.env.NODE_ENV === 'development') {
                    return (callback) ? callback(args) : console.error(error)
                }
                return (callback) ? callback(args) : error
            })
    }
}

export default new locals()
