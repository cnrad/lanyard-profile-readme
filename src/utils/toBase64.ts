export const encodeBase64 = async (url: string): Promise<string> => {
    let response = "";

    try {
        response = await fetch(url)
            .then((res) => res.blob())
            .then(async (blob) => {
                const buffer = Buffer.from(await blob.arrayBuffer());
                return buffer.toString("base64");
            });
    } catch (e) {
        console.log(e);
    }

    return response;
};
