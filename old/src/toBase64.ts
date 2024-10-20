import imageToBase64 from "image-to-base64";

export const encodeBase64 = async (url: string): Promise<string> => {
    let response = "";

    try {
        response = await imageToBase64(url);
    } catch (e) {
        console.log(e);
    }

    return response;
};
