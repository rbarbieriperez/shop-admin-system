import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";         
import { useRef, useState } from 'react';
import './login.scss';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../../controllers/login-services';
import { getUserInformation } from '../../controllers/user-services';
import { ConfirmDialog } from 'primereact/confirmdialog';


const emailRegex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");


function Login() {
    const [loginData, setLoginData] = useState({ email: '', password: ''});
    const [formErrors, setFormErrors] = useState({email: false, password: false});
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<Password>(null);
    const Navigate = useNavigate();
    const [buttonLoading, setButtonLoading] = useState(false);

    const [errorModalConfig, setErrorModalConfig] = useState({visible: false, message: ''})


    /**
     * Validates if email matches the following conditions:
     *  - It matches the default regex expression for emails
     *  - Is not empty
     */

    const _validateEmail = () => {
        emailRegex.test(loginData.email) ? setFormErrors({...formErrors, email: false}) : setFormErrors({...formErrors, email: true});
        !emailRegex.test(loginData.email) && setLoginData({...loginData, email: ''});
    }

    const _validatePassword = () => {
        loginData.password.length > 0 ? setFormErrors({...formErrors, password: false}) : setFormErrors({...formErrors, password: true});
        !loginData.password.length && setLoginData({...loginData, password: ''});
    }



    const _handleRetrieveUserData = async () => {

        const token = sessionStorage.getItem('loginToken');

        if (token) {
            const userData = await getUserInformation({email: loginData.email, user_code: null, token: token});
            
            if (userData) {
                sessionStorage.setItem('user_information', JSON.stringify(userData["data"]));
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }


    const loginButtonClick = async () => {
        setButtonLoading(true);
        const result = await loginService({email: loginData.email, password: loginData.password});
        setButtonLoading(false);
        if (result) {
            const _handleRetrieveUserDataResult = await _handleRetrieveUserData();
            if (_handleRetrieveUserDataResult) {
                Navigate('/dashboard');
            } else {
                setErrorModalConfig((t) => ({...t, message: 'Operación no realizada', visible: true}));
            }
            
        } else {
            setErrorModalConfig((t) => ({...t, message: '¡Usuario y/o contraseña incorrectos!', visible: true}));
        }
        
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();

    return (
        <>
            <div className='main-container'>
                <form className='form' onSubmit={(e:React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
                    <span className="p-input-icon-left">
                        <i className="pi pi-user" />
                        <InputText ref={emailRef} onChange={(e:React.FormEvent<HTMLInputElement>) => setLoginData({...loginData, email: e.currentTarget.value})} onBlur={_validateEmail} id="email" placeholder="Correo" />    
                    </span>
                    {formErrors.email && <label htmlFor="email" className="p-error">Revisa el correo ingresado</label>}
                    <span>
                        <Password placeholder='Contraseña' ref={passwordRef} onChange={(e:React.FormEvent<HTMLInputElement>) => setLoginData({...loginData, password: e.currentTarget.value})} onBlur={_validatePassword} id="password" toggleMask feedback={false} promptLabel="Ingrese su contraseña"/>
                    </span>
                    {formErrors.password && <label htmlFor="password" className="login p-error">Revisa tú contraseña</label>}
                    <Button loading={buttonLoading} onClick={loginButtonClick} disabled={(formErrors.email || formErrors.password) || (loginData.email === '' || loginData.password === '')} label="ingresar" className="p-button-success" />
                    <a className='login-recovery-password-a' onClick={() => Navigate('/recovery-password')}>Recuperar contraseña</a>
                </form>
            </div>
            <ConfirmDialog acceptLabel="Aceptar" rejectClassName="error-modal" visible={errorModalConfig.visible} message={errorModalConfig.message}
                    header="Error" icon="pi pi-exclamation-triangle" accept={() => setErrorModalConfig((t) => ({...t, visible: false}))} />
        </>
    );
}


export default Login;