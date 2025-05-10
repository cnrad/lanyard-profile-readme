import { UnknownIconDark, UnknownIconLight } from "./badges";
import { isDark } from "./helpers";

export const encodeBase64 = async (
  url: string,
  bg: "light" | "dark" | string = "dark"
): Promise<string> => {
  const dark = isDark(bg);
  let response = "";

  try {
    response = await fetch(url, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          response = dark ? UnknownIconLight : UnknownIconDark;
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
