
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import { updateProduct } from '../../controllers/products-services';
import './show-product-modal.scss';


type TProduct = {
    cod_product: number,
    product_name: string,
    category_name: string,
    description: string,
    raw_cost: string,
    final_cost: string,
    earning_percentage: string,
    total_earning: string,
    product_image: string,
    product_unity: string,
    imageBase64: string,
    image?: string
}

type TFormData = {
    cod_product: number,
    name: string,
    cod_category: number,
    description: string,
    raw_cost: string,
    final_cost: string,
    earning_percentage: string,
    total_earnings: string
    unity: number,
    image: string
};




type TListCategories = {
    label: string,
    value: number
}

type TListUnitites = {
    label: string,
    value: number
}

interface IShowProductModal {
    product: TProduct,
    unities: Array<TListUnitites>,
    categories: Array<TListCategories>,
    visible: boolean,
    onClose: () => void,
    invalidToken: () => void,
    email: string,
}

type TFormErrors = {
    name: boolean,
    cod_category: boolean,
    description: boolean,
    raw_cost: boolean,
    final_cost: boolean,
    earning_percentage: boolean,
    total_earning: boolean
    unity: boolean
}


const formDataInitialValues = {
    cod_product: 0,
    name: '', 
    cod_category: 0, 
    description: '', 
    raw_cost: '', 
    final_cost: '', 
    earning_percentage: '', 
    total_earnings: '', 
    unity: 0,
    image: ''
}

const formErrorsInitialState = {
    name: false, 
    cod_category: false, 
    description: false, 
    raw_cost: false, 
    final_cost: false, 
    earning_percentage: false, 
    total_earning: false, 
    unity: false
}

const errorModalConfigInitialState = {
    visible: false, 
    message: '', 
    callback: () => {}, 
    icon: '', 
    header: ''
}


export default function ShowProductModal({product, unities, categories, visible = false, onClose, invalidToken, email}: IShowProductModal) {
    

    const [formData, setFormData] = useState<TFormData>(formDataInitialValues);
    const [errorModalConfig, setErrorModalConfig] = useState(errorModalConfigInitialState);


    const [formErrors, setFormErrors] = useState<TFormErrors>(formErrorsInitialState);

    const fileUploadRef = useRef<any>(null);


    const getCategory = (category: string): number => categories.findIndex((element: TListCategories) => element.label === category) + 1;

    const getUnity = (unity: string): number => unities.findIndex((element: TListUnitites) => element.label === unity) + 1;

    useEffect(() => {
        console.log(product);
        setFormData((t) => ({
            ...t, 
            name: product.product_name,
            cod_category: getCategory(product.category_name),
            description: product.description,
            raw_cost: product.raw_cost.split('$')[1],
            final_cost: product.final_cost.split('$')[1],
            earning_percentage: product.earning_percentage.split('%')[1],
            total_earning: product.total_earning.split('$')[1],
            unity: getUnity(product.product_unity),
            image: product.imageBase64
        }));
        
    }, [product]);

    useEffect(() => {
        setFormData((t) => ({...t, final_cost: _calculateFinalCost(Number(formData.raw_cost), Number(formData.earning_percentage))}));   
    }, [formData.earning_percentage, formData.raw_cost]);

    useEffect(() => {
        setFormData((t) => ({...t, total_earnings: _calculateEarnings(Number(formData.final_cost), Number(formData.raw_cost))}));   
    }, [formData.final_cost]);

    useEffect(() => {
        setFormData(formDataInitialValues);
        setFormErrors(formErrorsInitialState);
        setErrorModalConfig(errorModalConfigInitialState);
    }, []);


    const _calculateFinalCost = (value: number, percentage: number): string =>  ((((percentage) * (value)) / 100) + (value)).toFixed(2);

    const _calculateEarnings = (finalCost: number, rowCost: number): string => ((finalCost) - (rowCost)).toFixed(2);


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
    

    const _onSubmit = async () => {
        setFormErrors((t) => ({
            ...t,
            name: !formData?.name,
            cod_category: !formData?.cod_category,
            description: !formData?.description,
            raw_cost: !formData?.raw_cost,
            final_cost: !formData?.final_cost,
            earning_percentage: !formData?.earning_percentage,
            total_earnings: !formData?.total_earnings,
            unity: !formData?.unity
        }));


        const formDataChanges = {
            ...((formData.name !== product.product_name) && {name: formData.name}),
            ...((formData.cod_category !== getCategory(product.category_name)) && {cod_category: formData.cod_category}),
            ...((formData.description !== product.description) && {description: formData.description}),
            ...((Number(formData.raw_cost) !== Number(product.raw_cost.split('$')[1])) && {raw_cost: Number(formData.raw_cost)}),
            ...((Number(formData.final_cost) !== Number(product.final_cost.split('$')[1])) && {final_cost: Number(formData.final_cost)}),
            ...((Number(formData.earning_percentage) !== Number(product.earning_percentage.split('%')[1])) && {earning_percentage: Number(formData.earning_percentage)}),
            ...((Number(formData.total_earnings) !== Number(product.total_earning.split('$')[1])) && {total_earning: Number(formData.total_earnings)}),
            ...((Number(formData.unity) !== getUnity(product.product_unity)) && {product_unities_cod: formData.unity}),
            ...((formData.image !== product.imageBase64) && {image: formData.image}),
            image_name_old: product.product_image,
            cod_product: product.cod_product
        }
        
        
        if (formData.cod_category && formData.description && formData.earning_percentage && formData.final_cost && formData.name && formData.raw_cost && formData.total_earnings && formData.unity) {

    
            const result = await updateProduct(email, sessionStorage.getItem('loginToken') || '', formDataChanges);

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

    const _handleRowCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (/^[0-9]*$/.test(e.target?.value)) {
            setFormData((t) => ({...t, raw_cost: e.target?.value}));
        }
    }

    const _handleEarningPorcentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (/^[0-9]*$/.test(e.target?.value)) {
            setFormData((t) => ({...t, earning_percentage: e.target?.value}))
        }
    }

    return <>
        <main hidden={!visible} className='main-show-product-container'>
            <div className='show-product-gray-bg'></div>
            <section className='show-product-modal'>
                <div className='show-title-row'>
                    <p className='show-product-title'>Modificar producto</p>
                    <i onClick={onClose} className="pi pi-times"></i>
                </div>
                <section className='show-product-modal-cols-container'>
                    <section className='show-product-modal-left-col'>
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


                        <span className='show-product-modal-one-row'>
                            <InputText 
                                placeholder='Costo Bruto' 
                                onFocus={() => setFormErrors((t) => ({...t, raw_cost: false}))}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => _handleRowCostChange(e)}
                                className={formErrors.raw_cost ? 'p-invalid': ''}
                                value={formData.raw_cost}
                                pattern="[0-9]"
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
                        </span>


                        <InputText 
                            placeholder='% Ganancia' 
                            onFocus={() => setFormErrors((t) => ({...t, earning_percentage: false}))}
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => _handleEarningPorcentageChange(e)}
                            className={formErrors.earning_percentage ? 'p-invalid': ''}
                            disabled={!formData.raw_cost}
                            value={formData.earning_percentage}
                        >
                        </InputText>

                        <div className='pair-row resumen'>
                            <p>Costo de venta: <br/><strong>${formData.final_cost}</strong></p>
                            <p>Margen de ganancia:<br/> <strong>${formData.total_earnings}</strong></p>
                            
                        </div>
                    </section>
                    <section className='show-product-modal-right-col'>
                        {product.image}
                        <FileUpload ref={fileUploadRef} onSelect={(e:any) => storeImage(e)} onUpload={(e:any) => storeImage(e)} name="image" accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0 file-uploader">Arrastra y suelta la imagen aqui para subir.</p>} />
                    </section>
                </section>
                

                <Button className="p-button-success show-submit" onClick={_onSubmit} label='Actualizar'/>
            </section>
        </main>

        <ConfirmDialog acceptLabel="Aceptar" rejectClassName="error-modal" visible={errorModalConfig.visible} message={errorModalConfig.message}
                        header={errorModalConfig.header} icon={"pi pi-"+ errorModalConfig.icon} accept={() => errorModalConfig.callback()} />
    </>
}