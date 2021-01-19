import { React, useState } from 'react'

function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onEmailChange = (e) => {
        console.log(e.target.value)
        setEmail(e.target.value)
    }
    const onPasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        const data = {
            username: email,
            password: password
        }
        const payload = await JSON.stringify(data)

        // server is running on port 4000
        // send data to register route
        const response = await fetch("http://localhost:4000/register", {
            method: "POST",
            body: payload,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
        })
            .then((res) => res.json())
            .then(json => json)
            .catch(err => console.log(err))
        console.log("RES IS ", response)
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={onSubmit}>
                <label> Email ID </label>
                <input type="text" name="email" value={email} required onChange={onEmailChange} />
                <label> Password </label>
                <input type="password" name="password" value={password} required onChange={onPasswordChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}


export default RegisterForm;