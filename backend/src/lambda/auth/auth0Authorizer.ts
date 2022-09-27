import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-7h2rt62q.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('event', event)
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  logger.info('token', token)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  logger.info('jwt', jwt)
  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  const kid = jwt.header.kid
  const cert = await getSigningKey(kid)
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

async function getSigningKey(kid: String): Promise<string> {
  logger.info('kid', kid)
  const jwksRes = await Axios.get(jwksUrl, {
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      'Access-Control-Allow-Credentials': true,
    }
  })
  logger.info(jwksRes)
  if (jwksRes.status != 200) throw new Error(jwksRes.statusText)
  logger.info('jwksRes keys', jwksRes.data.keys)
  // const key = jwksRes.data.keys(k => {
  //   k.kid = kid
  // }).x5c
  const filteredKeys = jwksRes.data.keys.filter(key =>
    key.alg === 'RS256'
    && key.kty === 'RSA'
    && key.use === 'sig'
    && key.kid === kid
    && ((key.x5c && key.x5c.length))
  ).map(key => {
    return { 
      kid: key.kid,
      nbf: key.nbf,
      x5c: key.x5c[0]
    };
  });
  logger.info('filteredKeys', filteredKeys)
  const x5cKey = filteredKeys[0].x5c
  logger.info('key', x5cKey)
  if (!x5cKey) throw new Error('get key fail')
  const cert = `-----BEGIN CERTIFICATE-----\n${x5cKey}\n-----END CERTIFICATE-----\n`;
  return cert
}