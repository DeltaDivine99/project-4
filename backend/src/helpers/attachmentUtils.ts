import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('businessLogic');
const s3 = new XAWS.S3({ signatureVersion: 'v4' })
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
// TODO: Implement the fileStogare logic
export async function createAttachmentPresignedUrl(todoId: string): Promise<string> {
    logger.info(`Get S3 pre-signed url: `);

    return s3.getSignedUrl('putObject', {
        Bucket: s3Bucket,
        Key: todoId,
        Expires: + urlExpiration
    })
}