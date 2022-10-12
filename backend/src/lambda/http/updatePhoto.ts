import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import * as middy from 'middy'
// import { cors, httpErrorHandler } from 'middy/middlewares'

import { updatePhoto } from '../../helpers/bussinessLogic/photos'
import { UpdatePhotoRequest } from '../../requests/UpdatePhotoRequest'
// import { getUserId } from '../utils'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const photoId = event.pathParameters.photoId
    const updatedPhoto: UpdatePhotoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedPhoto" object
    await updatePhoto(event, photoId, updatedPhoto); 

    return {
        statusCode: 200, 
        body: 'Update success',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    }
}

// handler
//   .use(httpErrorHandler())
//   .use(
//     cors({
//       credentials: true
//     })
//   )
