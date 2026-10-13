export class HttpError extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

export const badRequest = (mensagem) => new HttpError(400, mensagem);
export const forbidden = (mensagem = "Acesso negado.") =>
  new HttpError(403, mensagem);
export const notFound = (mensagem = "Recurso não encontrado.") =>
  new HttpError(404, mensagem);
export const conflict = (mensagem) => new HttpError(409, mensagem);
