import sharp from "sharp";

export const encodeBase64 = async (url: string, size: number, sharpEnabled = true): Promise<string> => {
  let response = "";

  try {
    response = await fetch(url, {
      cache: "no-store",
    })
      .then(res => res.blob())
      .then(async blob => {
        const buffer = Buffer.from(await blob.arrayBuffer());
        if (!sharpEnabled) return buffer.toString("base64");

        const webpBuffer = await sharp(buffer, { animated: true })
          .webp({
            quality: 50,
          })
          .resize(size)
          .toBuffer();

        return webpBuffer.toString("base64");
      });
  } catch (e) {
    console.log(e);
  }

  return response;
};
