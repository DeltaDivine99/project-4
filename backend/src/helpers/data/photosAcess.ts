import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { PhotoItem } from '../../models/PhotoItem'
import { PhotoUpdate } from '../../models/PhotoUpdate';
// import { createLogger } from '../../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('dataLayer logic')

// TODO: Implement the dataLayer logic

export class PhotoAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly photosTable = process.env.PHOTOS_TABLE,
        // private readonly createdAtIndex = process.env.PHOTOS_CREATED_AT_INDEX
    ) { }

    async getPhotos(userId: string): Promise<any> {
        const result = await this.docClient.query({
            TableName: this.photosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: { ':userId': userId }
        }).promise();
        return result;
    }

    async createPhoto(photo: PhotoItem): Promise<PhotoItem> {
        await this.docClient.put({
            TableName: this.photosTable,
            Item: photo,
        }).promise();
        return photo as PhotoItem;
    }

    async updatePhoto(userId: string, photoId: string, photo: PhotoUpdate) {
        await this.docClient.update({
            TableName: this.photosTable,
            Key: { userId, photoId },
            UpdateExpression:
                'SET #name = :name,' + '#dueDate = :dueDate,' + '#done = :done',
            ExpressionAttributeValues: {
                ':name': photo.name,
                ':dueDate': photo.dueDate,
                ':done': photo.done,
            },
            ExpressionAttributeNames: {
                '#name': 'name',
                '#dueDate': 'dueDate',
                '#done': 'done',
            }
        }).promise();
    }

    async deletePhoto(userId: string, photoId: string) {
        await this.docClient.delete({
            TableName: this.photosTable,
            Key: { userId, photoId }
        }).promise();
    }

}