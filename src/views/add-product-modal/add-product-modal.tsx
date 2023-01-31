
import './add-product-modal.scss';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { postProduct } from '../../controllers/products-services';
import LoadingModal from '../loading-modal/loading-modal';
import { ConfirmDialog } from 'primereact/confirmdialog';



interface IAddProductsModal {
    visible: boolean,
    categories: Array<TDropdownElement>,
    unities: Array<TDropdownElement>,
    onClose: () => void,
    email: string,
    invalidToken: () => void;
};

type TName = string;
type TDescription = string;
type TImage = string;

type TFormData = {
    name: TName,
    cod_category: string,
    description: TDescription,
    row_cost: string,
    final_cost: string,
    earning_percentage: string,
    total_earnings: string
    unity: string,
    image: TImage
};

type TDropdownElement = {
    label:  string,
    value: number
}

type TFormErrors = {
    name: boolean,
    cod_category: boolean,
    description: boolean,
    row_cost: boolean,
    final_cost: boolean,
    earning_percentage: boolean,
    total_earnings: boolean
    unity: boolean
}


const formDataInitialValues = {
    cod_product: '',
    name: '', 
    cod_category: '', 
    description: '', 
    row_cost: '', 
    final_cost: '', 
    earning_percentage: '', 
    total_earnings: '', 
    unity: '',
    image: ''
}

const formErrorsInitialState = {
    name: false, 
    cod_category: false, 
    description: false, 
    row_cost: false, 
    final_cost: false, 
    earning_percentage: false, 
    total_earnings: false, 
    unity: false
}

const errorModalConfigInitialState = {
    visible: false, 
    message: '', 
    callback: () => {}, 
    icon: '', 
    header: ''
}


export default function AddProductsModal({ visible = false, categories = [], unities = [], onClose, email, invalidToken}: IAddProductsModal) {
    
    const [formData, setFormData] = useState<TFormData>(formDataInitialValues);
    
    const [formErrors, setFormErrors] = useState<TFormErrors>(formErrorsInitialState);


    const [errorModalConfig, setErrorModalConfig] = useState(errorModalConfigInitialState);
    const fileUploadRef = useRef<any>(null);
    

    useEffect(() => {
        setFormData(formDataInitialValues);
        setFormErrors(formErrorsInitialState)
        setErrorModalConfig(errorModalConfigInitialState);
    }, []);
   

    const _onSubmit = async () => {
        setFormErrors((t) => ({
            ...t,
            name: !formData?.name,
            cod_category: !formData?.cod_category,
            description: !formData?.description,
            row_cost: !formData?.row_cost,
            final_cost: !formData?.final_cost,
            earning_percentage: !formData?.earning_percentage,
            total_earnings: !formData?.total_earnings,
            unity: !formData?.unity
        }));
    
        
        if (formData.cod_category && formData.description && formData.earning_percentage && formData.final_cost && formData.name && formData.row_cost && formData.total_earnings && formData.unity && formData.unity) {

            const newFormData = {
                name: formData.name,
                cod_category: Number(formData.cod_category),
                description: formData.description,
                row_cost: Number(formData.row_cost),
                final_cost: Number(formData.final_cost),
                earning_percentage: Number(formData.earning_percentage),
                total_earnings: Number(formData.total_earnings),
                unity: Number(formData.unity),
                image: formData.image
            }

            const result = await postProduct(email, sessionStorage.getItem('loginToken'), newFormData);

            switch(result) {
                case '1': {
                    invalidToken();
                }
                    break;
                case '2': {
                    setErrorModalConfig((t) => ({...t, header: 'La operación ha fallado', message: 'No hemos podido guardar el producto', visible: true, icon: 'exclamation-triangle', callback: onClose}));
                }
                    break;
                default: {
                    setErrorModalConfig((t) => ({...t, header: 'Exito', message: 'Producto guardado correctamente', visible: true, icon: 'check', callback: onClose}));
                }
                    break;
            }
        }
    }


    const _calculateFinalCost = (value: string, percentage: string): string =>  (((Number(percentage) * Number(value)) / 100) + Number(value)).toFixed(2);

    const _calculateEarnings = (finalCost: string, rowCost: string): string => (Number(finalCost) - Number(rowCost)).toFixed(2);



    const parseImgIntoBase64 = async (file: File, callback: any) => {
        const reader = new FileReader();
        
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(file);
        
        
    }
 
    const storeImage = async (e:any) => {
        await parseImgIntoBase64(e.files[0], (data:any) => {
            setFormData((t) => ({...t, image: data}));
        });
    }
    
    useEffect(() => {
        if (visible) {
            setFormData((t) => ({
                ...t, 
                cod_category: '',
                description: '',
                earning_percentage: '',
                final_cost: '',
                image: '',
                name: '',
                row_cost: '',
                total_earnings: '',
                unity: ''
            }));

            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }
        }
    }, [visible])

    useEffect(() => {
        setFormData((t) => ({...t, final_cost: _calculateFinalCost(formData.row_cost, formData.earning_percentage)}));   
    }, [formData.earning_percentage, formData.row_cost]);

    useEffect(() => {
        setFormData((t) => ({...t, total_earnings: _calculateEarnings(formData.final_cost, formData.row_cost)}));   
    }, [formData.final_cost]);

    

    return <>
        <div hidden={!visible} className="manage-products-main-container">
            <div className="manage-products-background"></div>
            <div className='manage-products-main-content-container'>
                <div className='title-row'>
                    <p className='add-product-title'>Agregar Producto</p>
                    <i onClick={onClose} className="pi pi-times"></i>
                </div>
                <div className='row'>
                    <div className='left-col'>
                        <InputText 
                            placeholder='Nombre' 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((t) => ({...t, name: e.target?.value}))}
                            onFocus={() => setFormErrors((t) => ({...t, name: false}))}
                            className={formErrors.name ? 'p-invalid' : ''}
                            value={formData.name}
                        >
                        </InputText>
                        <Dropdown 
                            options={categories} 
                            onChange={(e) => setFormData((t) => ({...t, cod_category: e.target?.value}))} 
                            onFocus={() => setFormErrors((t) => ({...t, cod_category: false}))}
                            placeholder="Categoría"
                            value={formData.cod_category}
                            className={formErrors.cod_category ? 'p-invalid': ''}
                        />

                        <InputText 
                            placeholder='Descripción' 
                            onFocus={() => setFormErrors((t) => ({...t, description: false}))}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((t) => ({...t, description: e.target?.value}))}
                            className={formErrors.description ? 'p-invalid': ''}
                            value={formData.description}
                        >
                        </InputText>
                        
                        <div className='pair-row'>
                            <InputText 
                                placeholder='Costo Bruto' 
                                onFocus={() => setFormErrors((t) => ({...t, row_cost: false}))}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((t) => ({...t, row_cost: e.target?.value}))}
                                className={formErrors.row_cost ? 'p-invalid': ''}
                                value={formData.row_cost}
                            >
                            </InputText>

                            <Dropdown 
                                options={unities} 
                                onChange={(e) => setFormData((t) => ({...t, unity: e.target?.value}))} 
                                onFocus={() => setFormErrors((t) => ({...t, unity: false}))}
                                placeholder="Unidad"
                                value={formData.unity}
                                className={formErrors.unity ? 'p-invalid': ''}
                            />
                        </div>

                        <InputText 
                            placeholder='% Ganancia' 
                            onFocus={() => setFormErrors((t) => ({...t, earning_percentage: false}))}
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setFormData((t) => ({...t, earning_percentage: e.target?.value}))}
                            className={formErrors.earning_percentage ? 'p-invalid': ''}
                            disabled={!formData.row_cost}
                            value={formData.earning_percentage}
                        >
                        </InputText>

                        <div className='pair-row resumen'>
                            <p>Costo de venta: <br/><strong>${formData.final_cost}</strong></p>
                            <p>Margen de ganancia:<br/> <strong>${formData.total_earnings}</strong></p>
                            
                        </div>

                        
                    </div>
                    <div className='right-col'>
                        <FileUpload ref={fileUploadRef} onSelect={(e:any) => storeImage(e)} onUpload={(e:any) => storeImage(e)} name="image" accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Arrastra y suelta la imagen aqui para subir.</p>} />
                    </div>
                </div>

                
                
              

                <Button className="p-button-success submit" onClick={_onSubmit} label='Agregar'/>
            </div>

             
        </div>
        

        <ConfirmDialog acceptLabel="Aceptar" rejectClassName="error-modal" visible={errorModalConfig.visible} message={errorModalConfig.message}
                        header={errorModalConfig.header} icon={"pi pi-"+ errorModalConfig.icon} accept={() => errorModalConfig.callback()} />
    </>
}