require('dotenv').config()
const loginMethod = {
    async authenticate(callback,email,password){
        const data = {
            username: email,
            password: password
        }
        const payload = JSON.stringify(data)
        console.log('logging in...')

        // server is running on port 4000
        // send data to login route
        const response = await fetch("http://localhost:4000/login", {
            method: "POST",
            body: payload,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
        })
            .then((res) => {

                // if 4** then wrong credentials
                if (res.status === 400 || res.status === 401) {
                    throw new Error("Wrong username or password")
                } else {
                    return res;
                }
            })
            .then(res => res.json())
            .catch(err => console.log(err))
            if(response.login===true){
                localStorage.setItem('jwtToken',`${response.accessToken}`)
                callback(true)
            }
            
            callback(false);
    }
}
export default loginMethod