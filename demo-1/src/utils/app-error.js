// Error yang sudah tahu status HTTP dan kode error kontrak API.
export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFound = (what) => new AppError(404, 'NOT_FOUND', `${what} tidak ditemukan`);
