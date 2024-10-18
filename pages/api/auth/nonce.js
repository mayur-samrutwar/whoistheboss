import { generateNonce } from 'siwe';

export default function handler(req, res) {
  res.status(200).send(generateNonce());
}

