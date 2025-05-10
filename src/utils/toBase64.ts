import { UnknownIconDark, UnknownIconLight } from "./badges";

export const encodeBase64 = async (
  url: string,
  theme: string = "dark"
): Promise<string> => {
  let response = "";

  try {
    response = await fetch(url, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          response = theme === "dark" ? UnknownIconLight : UnknownIconDark;
          throw new Error(`not ok: ${res}`, { cause: res });
        }

        return res.blob();
      })
      .then(async (blob) => {
        const buffer = Buffer.from(await blob.arrayBuffer());
        return buffer.toString("base64");
      });
  } catch (e) {
    console.log(e);
  }

  return response;
};
