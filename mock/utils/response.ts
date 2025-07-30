import { isObject } from 'lodash-es'

export interface ResponseFormat<T> {
  code: number
  data: T
  message: string
}

export class RF {
  static success<T>(data: T, message = 'success'): ResponseFormat<T> {
    return {
      code: 200,
      data,
      message,
    }
  }

  static error(message: string, code?: number): ResponseFormat<null>
  static error(format: ResponseFormat<any>): ResponseFormat<any>
  static error(
    messageOrFormat: string | ResponseFormat<any>,
    code = 500,
  ): ResponseFormat<any> {
    return isObject(messageOrFormat)
      ? messageOrFormat
      : {
          code,
          data: null,
          message: messageOrFormat,
        }
  }
}
