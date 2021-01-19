import '../App.css';
import LoginForm from '../Components/loginAndRegister';
import RegisterForm from '../Components/Register';

function Page1() {
    return (
        <div className="App">
            <h1>Page 1</h1>
            <br />
            <LoginForm />
            <br />
            <RegisterForm />
        </div>
    );
}

export default Page1;
