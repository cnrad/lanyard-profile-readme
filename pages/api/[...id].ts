import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import * as LanyardTypes from '../../src/LanyardTypes';
import renderCard from '../../src/renderCard';

type Data = {
  id?: string | string[]
  error?: any;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    let userid = req.query.id[0];

    axios.get(`https://api.lanyard.rest/v1/users/${userid}`)
    .then((response) => {
        renderCard(response.data);
        res.status(200).json(response.data);
    })
    .catch((e) => {
        res.send({ error: {e} })
    });

    console.log(req.query);
    
}
