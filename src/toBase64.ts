const imageToBase64 = require('image-to-base64');

const encodeBase64 = async (url: string): Promise<string> => {

    let encoded: string = '';

    await imageToBase64(url)
    .then(
        (response: string) => {
            return encoded = response;
        }
    )
    .catch(
        (error: any) => {
            console.log(error);
        }
    ) 

    return encoded;
}

export default encodeBase64;