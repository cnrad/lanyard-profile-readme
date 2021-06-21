import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import * as LanyardTypes from '../../src/LanyardTypes';
import renderCard from '../../src/renderCard';

type Data = {
  id?: string | string[]
  error?: any;
}

type Parameters = {
    animated?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    let params: Parameters = req.query;
    let userid = req.query.id[0];
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("content-security-policy", "default-src 'none'; img-src *; style-src 'unsafe-inline'");

    let lanyardData: any;

    await axios.get(`https://api.lanyard.rest/v1/users/${userid}`)
    .then((response) => {
        return lanyardData = response;
    })
    .catch((err) => {
        console.log(err);
        res.send({ error: `Something went wrong! If everything looks correct and this still occurs, please contact @cnraddd on Twitter.` })
    });

    let svg = await renderCard(lanyardData.data, params);
    res.status(200).send(svg);

    console.log(req.query);
}