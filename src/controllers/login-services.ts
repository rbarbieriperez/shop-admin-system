


type TLogin = {
    email: string,
    password: string
}


export const loginService = async ({email, password}: TLogin) => {
    const result = await fetch('http://localhost:3000/api/login/', {
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
            password: password
        })
    }).then((data) => data.json()).catch((error) => error);;


    if(result["code"] === "200") {
        sessionStorage.setItem('loginToken', result["token"]);
        sessionStorage.setItem('userEmail', email);
        return true;
    } else {
        return false;
    }
};
