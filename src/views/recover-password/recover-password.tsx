import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ConfirmDialog } from 'primereact/confirmdialog';
import './recover-password.scss';
import LoadingModal from "../loading-modal/loading-modal";
import { updateUser } from "../../controllers/user-services";
import { requestCode, validateCode } from "../../controllers/recovery-password-services";



const emailRegex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");

function RecoverPassword() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const emailRef = useRef<HTMLInputElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<Password>(null);
    const repeatPasswordRef = useRef<Password>(null);
    const [formErrors, setFormErrors] = useState({email: false, code: false, repeatPassword: false});

    const [timer, setTimer] = useState(0);
    const [buttonData, setButtonData] = useState({buttonDisabled: true, buttonText: 'Recuperar', buttonLoading: false, sendCodeButtonShow: false, validateCodeButtonDisabled: true, validateButtonLoading: false, changePasswordButtonDisabled: true, changePasswordButtonLoading: false})

    const [step, setStep] = useState(1);
    const [passwordData, setPasswordData] = useState({password: '', repeatPassword: ''});

    const [visibleModal, setVisibileModal] = useState(false);

    const [errorModalConfig, setErrorModalConfig] = useState({visible: false, message: ''});

    const Navigate = useNavigate();
    /**
     * Validates if email matches the following conditions:
     *  - It matches the default regex expression for emails
     *  - Is not empty
     */
    const _validateEmail = () => {
        if (emailRegex.test(email)) {
            setFormErrors({...formErrors, email: false});
            setButtonData((t) => ({...t, buttonDisabled: false}));
            return true;
        } else {
            console.log('error');
            setFormErrors((t) => ({...t, email: true}));
            setButtonData((t) => ({...t, buttonDisabled: true}));
            setEmail('');
            return false;
        }
    }


    const _sendCode = async () => {
        if (_validateEmail()) {
            setButtonData((t) => ({...t, buttonLoading: true}));
            const result = await requestCode(email);
            setButtonData((t) => ({...t, buttonLoading: false}));

            if (result) {
                setButtonData((t) => ({...t, sendCodeButtonShow: true}));
                createTimer();
            } else {
                setErrorModalConfig((t) => ({...t, visible: true, message: '¡El usuario no existe!'}));
                if (emailRef.current) {
                    emailRef.current.value = '';
                    setButtonData((t) => ({...t, buttonDisabled: true}));
                }
            }
            
            
        }
    }


    useEffect(() => {
        if (timer) {
            setButtonData((button) => ({...button, buttonText: `Reenviar código en ${timer}`, buttonDisabled: true}));
        }   
    }, [timer])

    const createTimer = () => {
        let timeHelp = 30;
        setTimer(30);
        const intervalId = setInterval(() => {
            setTimer((t) => t -1);
            timeHelp--;

            if (timeHelp === 0) {
                clearInterval(intervalId);
                setButtonData((button) => ({...button, buttonText: `Reenviar`, buttonDisabled: false, sendCodeButtonShow: false}));
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }


    const _navigateStep2 = async () => {
        setStep(2);
        await codeRef.current;
        if (codeRef.current) {
            codeRef.current.value = '';
        }
    }

    const _checkEnteredCode = () => {
        //here we will validate if the entered code is valid
        if (code.length >= 8) {
            setFormErrors((t) => ({...t, code: false}));
            setButtonData((t) => ({...t, validateCodeButtonDisabled: false}));
        } else {
            console.log('errros')
            setFormErrors((t) => ({...t, code: true}));
            setButtonData((t) => ({...t, validateCodeButtonDisabled: true}));
        }
    }

    const _validateCode = async () => {
        setButtonData((t) => ({...t, validateButtonLoading: true}));
        const result = await validateCode(code, email);
        setButtonData((t) => ({...t, validateButtonLoading: true}));
        if (result) {
            setStep(3);
        } else {
            setErrorModalConfig((t) => ({...t, visible: true, message: '¡El código ingresado es incorrecto!'}));
            if (codeRef.current) {
                codeRef.current.value = '';
                setButtonData((t) => ({...t, validateCodeButtonDisabled: true}));
            }
        }   
    }

    const _checkEnteredPassword = () => {
        if (passwordData.password  === passwordData.repeatPassword) {
            setFormErrors((t) => ({...t, repeatPassword: false}));
            setButtonData((t) => ({...t, changePasswordButtonDisabled: false}));
        } else {
            setFormErrors((t) => ({...t, repeatPassword: true}));
            setPasswordData((t) => ({...t, repeatPassword: ''}));
        }
    }

    const _postNewPassword = async () => {

        const userObj = {
            password: passwordData.password,
            email: email
        }


        setButtonData((t) => ({...t, changePasswordButtonLoading: true}));
        const result = await updateUser(userObj);
        setButtonData((t) => ({...t, changePasswordButtonLoading: false}));
        if (result) {
            Navigate('/');
        } else {
            setErrorModalConfig((t) => ({...t, visible: true, message: 'Hemos fallado al actualizar la contraseña'}));
            if (passwordRef.current && repeatPasswordRef.current) {
                setButtonData((t) => ({...t, validateCodeButtonDisabled: true}));
            }
        }
        

        
    }

    const _leaveProcess = () => {
        setVisibileModal(false);
        Navigate('/');
    }


    /**
     * Step 1: Ask for email
     * Step 2: Ask for code
     * Step 3: Enter new password
     */

    switch(step) {
        case 1: return (
            <>  
                <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-text" aria-label="Submit" onClick={() => Navigate('/')}/>
                <div className="input-container">
                    <p className="title">ingresa tu correo</p>
                    <span className="p-input-icon-left">
                        <i className="pi pi-user" />
                        <InputText ref={emailRef} onChange={(e:React.FormEvent<HTMLInputElement>) => {setEmail(e.currentTarget.value)}} onKeyUp={_validateEmail} id="email" placeholder="Correo" />    
                    </span>
                    {formErrors.email && <label htmlFor="email" className="p-error">Revisa el correo ingresado</label>}
                    <Button loading={buttonData.buttonLoading} onClick={_sendCode} disabled={buttonData.buttonDisabled} label={buttonData.buttonText} className="p-button-primary" />
                    {buttonData.sendCodeButtonShow && <Button onClick={_navigateStep2} label={"Ya recibí el código"} className="p-button p-component p-button-success code-button" icon="pi pi-arrow-right" iconPos="right" />}
                </div>
                <ConfirmDialog acceptLabel="Aceptar" rejectClassName="error-modal" visible={errorModalConfig.visible} message={errorModalConfig.message}
                    header="Error" icon="pi pi-exclamation-triangle" accept={() => setErrorModalConfig((t) => ({...t, visible: false}))} />
             </>
        )
            break;
        case 2: return (
            <>
                <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-text" aria-label="Submit" onClick={() => setVisibileModal(true)}/>
                <div className="input-container">
                    <p className="title">Ingresa el código que recibiste</p>
                    <span className="p-input-icon-left">
                        <i className="pi pi-user" />
                        <InputText ref={codeRef} onChange={(e:React.FormEvent<HTMLInputElement>) => {setCode(e.currentTarget.value)}} onKeyUp={_checkEnteredCode} id="code" placeholder="Código" />    
                    </span>
                    {formErrors.code && <label htmlFor="code" className="p-error">Revisa el correo ingresado</label>}
                    <Button loading={buttonData.validateButtonLoading} onClick={_validateCode} disabled={buttonData.validateCodeButtonDisabled} label={"Validar código"} className="p-button p-component p-button-success code-button" />
                    <ConfirmDialog visible={visibleModal} onHide={() => setVisibileModal(false)} message="¿Estás seguro? Si retrocedes perderás todo el avance."
                    header="Confirmar" icon="pi pi-exclamation-triangle" accept={_leaveProcess} reject={() => setVisibileModal(false)} />
                </div>
                <ConfirmDialog acceptLabel="Aceptar" rejectClassName="error-modal" visible={errorModalConfig.visible} message={errorModalConfig.message}
                    header="Error" icon="pi pi-exclamation-triangle" accept={() => setErrorModalConfig((t) => ({...t, visible: false}))} />
            </>
        )
            break;
        case 3: return (
            <>
                <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-text" aria-label="Submit" onClick={() => setVisibileModal(true)}/>
                <div className="input-container">
                    <p className="title">Ingresa tu nueva contraseña</p>
                    <span className="p-input-icon-left">
                        <i className="pi pi-user" />
                        <Password ref={passwordRef} onChange={(e:React.FormEvent<HTMLInputElement>) => setPasswordData({...passwordData, password: e.currentTarget.value})} onKeyUp={_checkEnteredPassword} id="password" placeholder="Contraseña" toggleMask feedback={false}/>    
                    </span>
                    <span className="p-input-icon-left">
                        <i className="pi pi-user" />
                        <Password ref={repeatPasswordRef} onChange={(e:React.FormEvent<HTMLInputElement>) => setPasswordData({...passwordData, repeatPassword: e.currentTarget.value})} onKeyUp={_checkEnteredPassword} id="repeat-password" placeholder="Repite tu contraseña" toggleMask feedback={false}/>    
                    </span>
                    {formErrors.repeatPassword && <label htmlFor="code" className="p-error">Las contraseñas no coinciden</label>}
                    <Button loading={buttonData.changePasswordButtonLoading} onClick={_postNewPassword} disabled={buttonData.changePasswordButtonDisabled} label={"Cambiar contraseña"} className="p-button p-component p-button-success code-button" />
                    <ConfirmDialog visible={visibleModal} onHide={() => setVisibileModal(false)} message="¿Estás seguro? Si retrocedes perderás todo el avance."
                    header="Confirmar" icon="pi pi-exclamation-triangle" accept={_leaveProcess} reject={() => setVisibileModal(false)} />
                </div>
                <ConfirmDialog acceptLabel="Aceptar" rejectClassName="error-modal" visible={errorModalConfig.visible} message={errorModalConfig.message}
                    header="Error" icon="pi pi-exclamation-triangle" accept={() => setErrorModalConfig((t) => ({...t, visible: false}))} />
            </>
        )
            break;
        default: return (
            <>
            </>
        );
    } 

}

export default RecoverPassword;