import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { getUserId } from '../../lambda/utils';
import { createLogger } from '../../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('businessLogic');
const s3 = new XAWS.S3({ signatureVersion: 'v4' })
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const todosTable = process.env.TODOS_TABLE
// TODO: Implement the fileStogare logic
export async function createAttachmentPresignedUrl(event: APIGatewayProxyEvent,todoId: string): Promise<string> {
    logger.info(`Get S3 pre-signed url: `);
    const userId = getUserId(event)
    const uploadUrl = s3.getSignedUrl('putObject', {
        Bucket: s3Bucket,
        Key: todoId,
        Expires: + urlExpiration
    })

    await docClient.update({
        TableName: todosTable,
        Key: { userId, todoId },
        UpdateExpression: "set attachmentUrl=:URL",
        ExpressionAttributeValues: {
          ":URL": uploadUrl.split("?")[0]
      },
      ReturnValues: "UPDATED_NEW"
    })
    .promise();

    return uploadUrl
}