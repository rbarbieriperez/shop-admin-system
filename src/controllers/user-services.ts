
type TUserInformation = {
    email: string,
    token: string,
    user_code: string | null
}

export const updateUser = async (data: Object) => {
    const result = await fetch('http://localhost:3000/api/users/update-user', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
        },
        body: JSON.stringify(data)
    }).then((data) => data.json()).catch((error) => error);;


    if(result["code"] === "200") {
        return true;
    } else {
        return false;
    }
}


export const getUserInformation = async ({email, user_code, token}: TUserInformation) => {
    const result = await fetch('http://localhost:3000/api/users/list-user-information', {
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
            userCode: user_code,
            token: token
        })
    }).then((data) => data.json()).catch((error) => error);;


    if(result["code"] === "200") {
        return result;
    } else {
        return false;
    }
}