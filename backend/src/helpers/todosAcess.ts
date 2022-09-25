// import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

// const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('dataLayer logic')

// TODO: Implement the dataLayer logic

export class TodoAccess {
    constructor(
        private readonly docClient = new DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        // private readonly createdAtIndex = process.env.TODOS_CREATED_AT_INDEX
    ) { }

    async getTodos(userId: string): Promise<any> {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: { ':userId': userId }
        }).promise();
        return result;
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo,
        }).promise();
        return todo as TodoItem;
    }

    async updateTodo(userId: string, todoId: string, todo: TodoUpdate) {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: { userId, todoId },
            UpdateExpression:
                'SET #name = :name,' + '#dueDate = :dueDate,' + '#done = :done',
            ExpressionAttributeValues: {
                ':name': todo.name,
                ':dueDate': todo.dueDate,
                ':done': todo.done,
            },
            ExpressionAttributeNames: {
                '#name': 'name',
                '#dueDate': 'dueDate',
                '#done': 'done',
            }
        }).promise();
    }

    async deleteTodo(userId: string, todoId: string) {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: { userId, todoId }
        }).promise();
    }

}