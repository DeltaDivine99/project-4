import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import * as middy from 'middy'
// import { cors } from 'middy/middlewares'

import { getPhotosForUser } from '../../helpers/bussinessLogic/photos'
// import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('Get All Photos');

// TODO: Get all TODO items for a current user
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Write your code here
  logger.info('event', event);

  const jwtToken = event.headers.Authorization.split(' ')[1];
  logger.info('token', jwtToken);
  const result = await getPhotosForUser(event);

  const photos = result.Items;
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: photos
    })
  }
}

// handler.use(
//   cors({
//     credentials: true
//   })
// )
