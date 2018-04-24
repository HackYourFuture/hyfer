export async function saveHistory(body){
    const token = localStorage.getItem("token")
    let BASE_URL = 'http://localhost:3005/api/history';
        
    const response = await fetch(BASE_URL , {
        method: 'POST', 
        body: JSON.stringify(body),
        headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + token,
        }
    })
    return response;
}