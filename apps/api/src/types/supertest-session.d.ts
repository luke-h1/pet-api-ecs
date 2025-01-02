/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'supertest-session' {
  // index.d.ts
  import { Server } from 'http';
  import { Server as SecureServer } from 'https';
  import { SuperAgentTest } from 'supertest';
  import { UrlWithStringQuery } from 'url';

  interface SessionOptions {
    before?: (test: SuperAgentTest) => void;
    cookieAccess?: {
      domain?: string;
      path?: string;
      secure?: boolean;
      script?: boolean;
    };
    destroy?: () => void;
    helpers?: Record<string, any>;
  }

  declare class Session {
    app: Server | SecureServer | Function;

    url: UrlWithStringQuery;

    options: SessionOptions;

    agent: SuperAgentTest;

    cookieAccess: CookieAccessInfo;

    constructor(
      app: Server | SecureServer | Function,
      options?: SessionOptions,
    );

    reset(): void;

    destroy(): void;

    request(meth: string, route: string): SuperAgentTest;

    cookies: any[];

    [method: string]: any;
  }

  declare function createSession(
    app: Server | SecureServer | Function,
    options?: SessionOptions,
  ): Session;

  export = createSession;
}
