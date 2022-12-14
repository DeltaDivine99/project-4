import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createAttachmentPresignedUrl } from '../../helpers/fileManagement/attachmentUtils'
// import * as middy from 'middy'
// import { cors, httpErrorHandler } from 'middy/middlewares'
// import { getUserId } from '../utils'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const photoId = event.pathParameters.photoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    
    const uploadUrl = await createAttachmentPresignedUrl(event, photoId);
    // return S3 upload URL: 
    return {
        statusCode: 200, 
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ 
            uploadUrl, // get URL as string
        })
    }
  }

// handler
//   .use(httpErrorHandler())
//   .use(
//     cors({
//       credentials: true
//     })
//   )
