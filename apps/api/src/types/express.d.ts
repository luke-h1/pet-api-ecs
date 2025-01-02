declare namespace Express {
  export interface Request {
    session: {
      userId: string;
    } & Request['session'];
  }
}
