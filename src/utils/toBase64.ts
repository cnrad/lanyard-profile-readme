import sharp from "sharp";
import { UnknownIconDark, UnknownIconLight } from "./badges";

export const encodeBase64 = async (
  url: string,
  size: number = 128,
  theme: string = "dark"
): Promise<string> => {
  let response = "";

  try {
    response = await fetch(url, {
      cache: "force-cache",
    })
      .then((res) => {
        // Show unknown icons if media could not be fetched
        if (!res.ok) {
          response = theme === "dark" ? UnknownIconLight : UnknownIconDark;
          throw new Error(`not ok: ${res}`, { cause: res });
        }

        return res.blob();
      })
      .then(async (blob) => {
        let buffer = Buffer.from(await blob.arrayBuffer()) as Buffer;

        // sharp for some reason doesn't work with animated decorations, but so be it because when animated it's >1mb
        if (size) {
          buffer = await sharp(buffer, { animated: true })
            .webp({
              quality: 75,
            })
            .resize(size)
            .toBuffer();
        }

        return buffer.toString("base64");
      });
  } catch (e) {
    console.log(e);
  }

  return response;
};
