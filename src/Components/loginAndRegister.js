import { React, useState } from 'react'
import loginMethod from './loginMethods/LoginMethod'
import { Redirect } from 'react-router-dom';
import LoginComponent from './loginForm'
function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [referrer, setReferrer] = useState(false);

    const onEmailChange = (e) => {
        console.log(e.target.value)
        setEmail(e.target.value)
    }
    const onPasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const onSubmit = async (e) => {
        e.preventDefault();

        loginMethod.authenticate((status)=>{
            if(status){
                setReferrer(true)
            }
        },email,password);
    }
    return (
        referrer === true ? <Redirect to='/ready'/> : <LoginComponent eamil={email} password={password} emailChange={onEmailChange} passwordChange={onPasswordChange} submit={onSubmit}/>
    )
}


export default LoginForm;