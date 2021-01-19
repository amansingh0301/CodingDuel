import React, { Component } from 'react';
function LoginComponent(props){
    return (
        <div>
            <h1>Email</h1>
            <form onSubmit={props.submit}>
                <label> Email ID </label>
                <input type="text" name="email" value={props.email} required onChange={props.emailChange} />
                <label> Password </label>
                <input type="password" name="password" value={props.password} required onChange={props.passwordChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
export default LoginComponent