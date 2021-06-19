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

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    let params: Parameters = req.query;
    let userid = req.query.id[0];
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");

    axios.get(`https://api.lanyard.rest/v1/users/${userid}`)
    .then((response) => {
        res.status(200).send(renderCard(response.data, params));
    })
    .catch((err) => {
        console.log(err);
        res.send({ error: 'Please provide a valid Discord user ID!' })
    });

    console.log(req.query);
    
}
