export class CustomError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'PraticeError';
  }
}
