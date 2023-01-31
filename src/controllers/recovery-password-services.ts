



export const requestCode = async (email: string) => {
    const result = await fetch('http://localhost:3000/api/code/request-code', {
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
            email: email
        })
    }).then((data) => data.json()).catch((error) => error);

    if (result["code"] === "200") {
        return true;
    } else {
        return false;
    }
}


export const validateCode = async (code: string, email: string) => {
    const result = await fetch('http://localhost:3000/api/code/validate-code', {
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
            code: code,
            email: email
        })
    }).then((data) => data.json()).catch((error) => error);;


    if(result["code"] === "200") {
        return true;
    } else {
        return false;
    }
}