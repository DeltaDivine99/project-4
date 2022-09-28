import { TodoAccess } from '../data/todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../../models/TodoItem'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import { getUserId } from '../../lambda/utils';
import * as moment from 'moment'; 
import { APIGatewayProxyEvent } from 'aws-lambda'

const logger = createLogger('businessLogic');

const todosAcess = new TodoAccess();
// TODO: Implement businessLogic
export async function getTodosForUser(event: APIGatewayProxyEvent): Promise<any> {
    const userId = getUserId(event)
    logger.info('userId', userId)
    return await todosAcess.getTodos(userId);
}

export async function createTodo(event: APIGatewayProxyEvent, newTodo: CreateTodoRequest): Promise<any> {
    const todoId = uuid.v4();
    const userId = getUserId(event)
    logger.info('userId', userId)
    const currentTime = moment().format("MMM DD, YYYY hh:mm:ss a"); 
    logger.info('currentTime', currentTime)
    return await todosAcess.createTodo({
        userId: userId, 
        todoId: todoId, 
        createdAt: currentTime,
        done: false,
        ...newTodo,
    }) as TodoItem;  
}

export async function updateTodo(
    event: APIGatewayProxyEvent, 
    todoId: string, 
    updateTodo: UpdateTodoRequest,
) {
    const userId = getUserId(event)
    logger.info('userId', userId)
    await todosAcess.updateTodo(userId, todoId, updateTodo); 
}

export async function deleteTodo(
    event: APIGatewayProxyEvent, 
    todoId: string, 
) {
    const userId = getUserId(event)
    logger.info('userId', userId)
    await todosAcess.deleteTodo(userId, todoId); 
}