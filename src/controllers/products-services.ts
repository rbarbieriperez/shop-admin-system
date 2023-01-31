
type TProductGet = {
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




export const listProducts = async (email: string, token: string | null):Promise<Array<TProductGet> | string> => {
    const result = await fetch('http://localhost:3000/api/products/list-products', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
        },
        body: JSON.stringify({
            email: email,
            token: token
        })
    }).then((data) => data.json()).catch((error) => error);;


    if (result["validToken"] && result["data"]) {
        return result["data"];
    } else if (result["validToken"] && !result["data"]) {
        return '2';
    } else {
        return '1';
    }
}

type TCategories = {
    name: string,
    cod_category: number
}

type TListCategories = {
    label: string,
    value: number
}

export const listCategories = async (email: string, token: string | null): Promise<Array<TListCategories> | string> => {

    

    const _computeCategories = (categories: Array<TCategories>):Array<TListCategories> => {
        let newArr = categories.map((el:TCategories) => {
            return {
                label: el["name"],
                value: el["cod_category"]
            }
        });
        return newArr;
    }


    const result = await fetch('http://localhost:3000/api/products/list-categories', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
        },
        body: JSON.stringify({
            email: email,
            token: token
        })
    }).then((data) => data.json()).catch((error) => error);;


    if (result["validToken"] && result["data"]) {
        return _computeCategories(result["data"]);
    } else if (result["validToken"] && !result["data"]) {
        return '2';
    } else {
        return '1';
    }
}



type TListUnitites = {
    label: string,
    value: number
}

export const listUnities = async (email: string, token: string | null): Promise<Array<TListUnitites> | string> => {

    type TUnities = {
        name: string,
        product_unities_cod: number
    }

    const _computeCategories = (categories: Array<TUnities>): Array<TListUnitites> => {
        let newArr = categories.map((el:TUnities) => {
            return {
                label: el["name"],
                value: el["product_unities_cod"]
            }
        });
        return newArr;
    }


    const result = await fetch('http://localhost:3000/api/products/list-unities', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
        },
        body: JSON.stringify({
            email: email,
            token: token
        })
    }).then((data) => data.json()).catch((error) => error);;


    if (result["validToken"] && result["data"]) {
        return _computeCategories(result["data"]);
    } else if (result["validToken"] && !result["data"]) {
        return '2';
    } else {
        return '1';
    }
}

type TProduct = {
    cod_product?: number,
    name: string | null,
    cod_category: number | null,
    description: string | null,
    row_cost: number | null,
    final_cost: number | null,
    earning_percentage: number | null,
    total_earnings: number | null,
    unity: number | null,
    image: string | null
};


export const postProduct = async (email: string, token: string | null, product: TProduct) => {
    const result = await fetch('http://localhost:3000/api/products/post-product', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
        },
        body: JSON.stringify({
            email: email,
            token: token,
            product: product
        })
    }).then((data) => data.json()).catch((error) => error);;


    if (result["validToken"] && result["code"] === "200") {
        return true;
    } else if (result["validToken"] && result["code"] === "500") {
        return '2';
    } else {
        return '1';
    }
}


export const deleteProduct = async (email: string, token: string, id: string) => {
    const result = await fetch('http://localhost:3000/api/products/delete-product', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
        },
        body: JSON.stringify({
            email: email,
            token: token,
            id: id
        })
    }).then((data) => data.json()).catch((error) => error);;


    if (result["validToken"] && result["code"] === "200") {
        return true;
    } else if (result["validToken"] && result["code"] === "500") {
        return '2';
    } else {
        return '1';
    }
}

type TUpdateProduct = {
    cod_product?: number,
    name?: string,
    cod_category?: number,
    description?: string,
    raw_cost?: number,
    final_cost?: number,
    earning_percentage?: number,
    total_earning?: number,
    product_unities_cod?: number,
    image?: string,
    image_name_old?: string
}

export  const updateProduct = async (email: string, token: string, product: TUpdateProduct) => {
    const result = await fetch('http://localhost:3000/api/products/update-product', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
        },
        body: JSON.stringify({
            email: email,
            token: token,
            product: product
        })
    }).then((data) => data.json()).catch((error) => error);;


    if (result["validToken"] && result["code"] === "200") {
        return true;
    } else if (result["validToken"] && result["code"] === "500") {
        return '2';
    } else {
        return '1';
    }
}