import { PhotoAccess } from '../data/photosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { PhotoItem } from '../../models/PhotoItem'
import { CreatePhotoRequest } from '../../requests/CreatePhotoRequest'
import { UpdatePhotoRequest } from '../../requests/UpdatePhotoRequest'
import { createLogger } from '../../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import { getUserId } from '../../lambda/utils';
import * as moment from 'moment'; 
import { APIGatewayProxyEvent } from 'aws-lambda'

const logger = createLogger('businessLogic');

const photosAcess = new PhotoAccess();
// TODO: Implement businessLogic
export async function getPhotosForUser(event: APIGatewayProxyEvent): Promise<any> {
    const userId = getUserId(event)
    logger.info('userId', userId)
    return await photosAcess.getPhotos(userId);
}

export async function createPhoto(event: APIGatewayProxyEvent, newPhoto: CreatePhotoRequest): Promise<any> {
    const photoId = uuid.v4();
    const userId = getUserId(event)
    logger.info('userId', userId)
    const currentTime = moment().format("MMM DD, YYYY hh:mm:ss a"); 
    logger.info('currentTime', currentTime)
    return await photosAcess.createPhoto({
        userId: userId, 
        photoId: photoId, 
        createdAt: currentTime,
        done: false,
        ...newPhoto,
    }) as PhotoItem;  
}

export async function updatePhoto(
    event: APIGatewayProxyEvent, 
    photoId: string, 
    updatePhoto: UpdatePhotoRequest,
) {
    const userId = getUserId(event)
    logger.info('userId', userId)
    await photosAcess.updatePhoto(userId, photoId, updatePhoto); 
}

export async function deletePhoto(
    event: APIGatewayProxyEvent, 
    photoId: string, 
) {
    const userId = getUserId(event)
    logger.info('userId', userId)
    await photosAcess.deletePhoto(userId, photoId); 
}