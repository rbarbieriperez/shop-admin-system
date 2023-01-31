import './loading-modal.scss';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect } from 'react';
const check = require('../../resources/check.png');

interface IModal {
    visible: boolean;
    state: 'loading' | 'success' | 'error';
    text: string
}

export default function LoadingModal({
    visible = false,
    state,
    text = ''
}:IModal) {


    useEffect(() => {
        console.log(visible, state, text);
    }, []);

    switch(state) {
        case 'loading': return <>
            <div hidden={!visible} className="main-container-loading-modal spinner">
                <ProgressSpinner className={'spinner-element'} style={{width: '70px', height: '70px'}} strokeWidth="5"  animationDuration="1s"/>
                <div className={'main-container-modal spinner'}>
                </div>
            </div>
        </>
        case 'success': return <>
            <div hidden={!visible} className="main-container-loading-modal success">
                <img src={check} alt="check" className='success-img'/>
                <p className='loading-modal-text'>{text}</p>
                <div className={'main-container-modal success'}>
                </div>
            </div>
        </>
        case 'error': return <>

        </>
    }
}