import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import renderCard from "../../src/renderCard";
import { isSnowflake } from "../../src/snowflake";

type Data = {
    id?: string | string[];
    error?: any;
};

type Parameters = {
    theme?: string;
    bg?: string;
    hideStatus?: string;
    hideDiscrim?: string;
    borderRadius?: string;
    animated?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let axiosRes;
    const params: Parameters = req.query,
        userid = req.query.id[0];

    if (!isSnowflake(userid))
        return res.send({
            error: `Specify a valid Discord user ID! If everything looks correct and this still occurs, please contact @cnraddd on Twitter.`,
        });

    try {
        axiosRes = await axios.get(`https://api.lanyard.rest/v1/users/${userid}`);
    } catch (err) {
        console.log(err);

        if (err.response.status === 404) return res.send({ error: "Invalid user!" });

        return res.send({
            error: `Something went wrong! If everything looks correct and this still occurs, please contact @cnraddd on Twitter.`,
        });
    }

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("content-security-policy", "default-src 'none'; img-src * data:; style-src 'unsafe-inline'");

    let svg = await renderCard(axiosRes.data, params);
    res.status(200).send(svg as any);
}
