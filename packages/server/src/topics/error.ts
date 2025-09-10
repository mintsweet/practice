export enum TOPIC_ERROR_CODE {
  TOPIC_SCORE_INSUFFICIENT = 'TOPIC_SCORE_INSUFFICIENT',
  TOPIC_NOT_FOUND = 'TOPIC_NOT_FOUND',
  TOPIC_FORBIDDEN = 'TOPIC_FORBIDDEN',
  TOPIC_DELETE_EXPIRED = 'TOPIC_DELETE_EXPIRED',
}

export class TopicError extends Error {
  constructor(
    public code: TOPIC_ERROR_CODE,
    message: string,
  ) {
    super(message);
    this.name = 'TopicError';
  }
}
