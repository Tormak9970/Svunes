export type TauriRequest = {
  data: string,
  headers: Record<string, string>,
  ok: boolean,
  rawHeaders: Record<string, string[]>,
  status: number,
  url: string
}

export class RequestError extends Error {
  response: TauriRequest;

  constructor(message: string, response: TauriRequest) {
    super(message);
    this.name = "Request Error"
    this.response = response;
  }
}