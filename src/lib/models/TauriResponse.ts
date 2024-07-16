export class RequestError<T> extends Error {
  response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.name = "Request Error"
    this.response = response;
  }
}