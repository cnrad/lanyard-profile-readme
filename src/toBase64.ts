import imageToBase64 from "image-to-base64";

export const encodeBase64 = async (url: string): Promise<string> => await imageToBase64(url);