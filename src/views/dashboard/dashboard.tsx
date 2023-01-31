
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { useEffect, useRef, useState } from 'react';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import './dashboard.scss';
import { useNavigate } from 'react-router';
import { ConfirmDialog } from 'primereact/confirmdialog';
import DataTableDynamic from '../../components/DataTable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import AddProductsModal from '../add-product-modal/add-product-modal';
import { listCategories, listUnities, listProducts, deleteProduct } from '../../controllers/products-services';
import ShowProductModal from '../show-product-modal/show-product-modal';


const DataTableColumns = [
    {header: 'Código', field: 'cod_product', filterField: 'cod_product', width: '10%'},
    {header: 'Imágen', field: 'image', filterField: 'image', width: '10%'},
    {header: 'Nombre', field: 'product_name', filterField: 'product_name', width: '10%'},
    {header: 'Categoría', field: 'category_name', filterField: 'category_name', width: '10%'},
    {header: 'Descripción', field: 'description', filterField: 'description', width: '9%'},
    {header: 'Costo Bruto', field: 'raw_cost', filterField: 'raw_cost', width: '10%'},
    {header: 'Costo Final', field: 'final_cost', filterField: 'final_cost', width: '10%'},
    {header: '%', field: 'earning_percentage', filterField: 'earning_percentage', width: '10%'},
    {header: 'Ganancia Final', field: 'total_earning', filterField: 'total_earning', width: '10%'},
    {header: 'Unidad', field: 'product_unity', filterField: 'product_unity', width: '10%'},
];


type TProductImg = {
    product_image: string,
    imageBase64: string
}

type TListCategories = {
    label: string,
    value: number
}

type TListUnitites = {
    label: string,
    value: number
}

/* type TProduct = {
    name: string,
    cod_product: number,
    cod_category: number,
    description: string,
    row_cost: string,
    final_cost: string,
    earning_percentage: string,
    total_earning: string,
    unity: number,
    image: string | null
} */

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

type TShowProductModal = {
    visible: boolean,
    product: TProduct

}

const productInitialValues = {
    cod_product: 0,
    product_name: '',
    category_name: '',
    description: '',
    raw_cost: '',
    final_cost: '',
    earning_percentage: '',
    total_earning: '',
    product_image: '',
    product_unity: '',
    imageBase64: '',
    image: ''
}


export default function Dashboard() {

    const [menuVisible, setMenuVisible] = useState(false);
    const [userData, setUserData] = useState<any>({});
    const [errorModalConfig, setErrorModalConfig] = useState({visible: false, message: '', callback: () => {}});
    const [products, setProducts] = useState<Array<TProduct>>([]);
    const [categories, setCategories] = useState<Array<TListCategories>>([]);
    const [unities, setUnities] = useState<Array<TListUnitites>>([]);

    //Modals visibility

    const [addProductsModalVisible, setAddProductsModalVisible] = useState(false);
    const [showProductModalConfig, setShowProductModalConfig] = useState<TShowProductModal>({visible: false, product: productInitialValues});

    /**
     * Dashboard loaded executions:
     *  1. set the user restored from session storage into the component
     *  2. get all the products from the db and store into the component
     */
    useEffect(() => {
        setUserData(JSON.parse(sessionStorage.getItem('user_information') || ''));
        
    }, []);


    useEffect(() => {
        if (userData["email"]) {
            getProducts();
            getCategories();
            getUnities();
        }
    }, [userData]);

    /** ---- END LOADING EXECUTIONS  ---- */

    const getProducts = async () => {
        await userData;
        setProducts([]);
        const products = await listProducts(userData["email"], sessionStorage.getItem('loginToken'));
        
        switch(typeof products) {
            case 'string': {
                if (products === '1') {
                    setErrorModalConfig((t) => ({...t, visible: true, message: "Su sesión ha expirado, serás redirigido al login...", callback: _sessionExpired}));
                }
            }
                break;

            case 'object': {
                products.map((product: TProductImg) => {
                    if (product["product_image"]) {
                        Object.assign(product, { image: <img id={product["product_image"]} src={`data:image/jpeg;base64,${product["imageBase64"]}`} className="datatable-product-image"></img>})
                    }
                })
                setProducts(products);
            }
                break;
        }
        
    }

    const _sessionExpired = () => {
        setErrorModalConfig((t) => ({...t, visible: false}));
        sessionStorage.clear();
        Navigate('/');
    }

    const getCategories = async () => {
        await userData;

        const categories = await listCategories(userData["email"], sessionStorage.getItem('loginToken'));

        switch(typeof categories) {
            case 'string': {
                if (categories === '1') {
                    setErrorModalConfig((t) => ({...t, visible: true, message: "Su sesión ha expirado, serás redirigido al login...", callback: _sessionExpired}));
                } else {

                }
            }
                break;
            case 'object': {
                setCategories(categories);
            }
                break;
        }
        
    }

    const getUnities = async () => {
        await userData;

        const unities = await listUnities(userData["email"], sessionStorage.getItem('loginToken'));

        switch(typeof unities) {
            case 'string': {
                if (unities === '1') {
                    setErrorModalConfig((t) => ({...t, visible: true, message: "Su sesión ha expirado, serás redirigido al login...", callback: _sessionExpired}));
                } else {

                }
                
            }
                break;
            case 'object': {
                setUnities(unities);
            }
                break;
        }
    }


    const Navigate = useNavigate();


    const menuConfig = [
        {
            label: 'Productos',
            items: [
                {
                    label: 'Administrar productos', 
                    icon: 'pi pi-shopping-cart', 
                    command: () => {
                        setAddProductsModalVisible(true);
                        setMenuVisible(false);
                    }
                },
                {
                    label: 'Descargar resumen', 
                    icon: 'pi pi-shopping-cart', 
                    command: () => Navigate('/dashboard/products')
                },
                {
                    label: 'Administrar productos', 
                    icon: 'pi pi-shopping-cart', 
                    command: () => Navigate('/dashboard/products')
                }
            ]
        },
    ];


    const _handleAddProductModalClose = () => {
        setAddProductsModalVisible(false);
        getProducts();
    }

   const _handleShowProductModalClose = () => {
        setShowProductModalConfig((t) => ({...t, visible: false}));
        getProducts();
   }

   const _handleDeleteRow = async (e:string) => {
        const result = await deleteProduct(userData["email"], sessionStorage.getItem("loginToken") || '', e);

        switch(result) {
            case '1': {
                setErrorModalConfig((t) => ({...t, visible: true, message: "Su sesión ha expirado, serás redirigido al login...", callback: _sessionExpired}));
            }
                break;
            case '2': {

            }
                break;
            default: {
                getProducts();
            }
                break;  
        }
   }


    const getProductFromId = (id: number):TProduct | undefined => {
        products.map((product: TProduct) => console.log(product));
        if (products.find((product:TProduct) => product.cod_product === id)) {
            return products.find((product:TProduct) => product.cod_product === id) || undefined;
        }

        
        
    }

    const _handleOpenMoreInfo = (e:string) => {
        const product:TProduct | undefined = getProductFromId(Number(e));
        
        console.log(product);
         if (product) {
            const _productTemp = {
                category_name: product.category_name,

                
            }
            
            setShowProductModalConfig((t) => ({...t, visible: true, product: product}));
         }
    }

    return <>
        <main className='main-dashboard-container'>
            <header className='dashboard header'>
                <Button className='dashboard menu p-button-lg' icon="pi pi-align-justify" onClick={(e) => setMenuVisible(true)}/>
                <p className='dashboard name'>Bienvenido, {userData["name"]}</p>
            </header>

            <Sidebar className='sidebar' visible={menuVisible} onHide={() => setMenuVisible(false)}>
                <div className='sidebar user-presentation-container'>
                    <Avatar className='avatar' shape='circle' label="P" />
                    <div className='user-name-container'>
                        <h2 className='user-name-title'>{userData["name"] + ' ' + userData["surname"] + ' ' + userData["second_surname"]}</h2>
                        <p className='user-name-date'>{new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <hr className='user-buttons-hr' />
                <div className='sidebar buttons-container'>
                    <Menu model={menuConfig}/>
                </div>


                <div>
                    <hr />
                </div>
                
            </Sidebar>

            <section className='dashboard content'>
                <section className='datatable-container'>
                    <DataTableDynamic moreInfo={(e:string) => _handleOpenMoreInfo(e)} deleteRow={(e:string) => _handleDeleteRow(e)} reload={getProducts} Columns={DataTableColumns}  body={products as never[]}/>
                </section>
            </section> 
        
            <ConfirmDialog acceptLabel="Aceptar" rejectClassName="error-modal" visible={errorModalConfig.visible} message={errorModalConfig.message}
                        header="Error" icon="pi pi-exclamation-triangle" accept={() => errorModalConfig.callback()} />

            <AddProductsModal invalidToken={() =>  setErrorModalConfig((t) => ({...t, visible: true, message: "Su sesión ha expirado, serás redirigido al login...", callback: _sessionExpired}))} email={userData["email"]} onClose={_handleAddProductModalClose} 
                unities={unities} 
                categories={categories} 
                visible={addProductsModalVisible}
            />

            <ShowProductModal email={userData["email"]} invalidToken={() =>  setErrorModalConfig((t) => ({...t, visible: true, message: "Su sesión ha expirado, serás redirigido al login...", callback: _sessionExpired}))} onClose={_handleShowProductModalClose} visible={showProductModalConfig.visible} unities={unities} categories={categories} product={showProductModalConfig.product}/>
        </main>
        
    </>
}