import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
// import * as middy from 'middy'
// import { cors } from 'middy/middlewares'
import { CreatePhotoRequest } from '../../requests/CreatePhotoRequest'
// import { getUserId } from '../utils';
import { createPhoto } from '../../helpers/bussinessLogic/photos'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newPhoto: CreatePhotoRequest = JSON.parse(event.body)
  // TODO: Implement creating a new TODO item
  const newItem = await createPhoto(event, newPhoto);
  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem, // return the newly created image
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  }
}

// handler.use(
//   cors({
//     credentials: true
//   })
// )
