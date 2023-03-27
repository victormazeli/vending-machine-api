import crypto from 'crypto'

export const generateAccessToken = (secret) => {
  const token = crypto.createHmac('sha256', secret)
    .update(crypto.randomBytes(16).toString('hex'))
    .digest('base64')

  return token;
    
  }
  