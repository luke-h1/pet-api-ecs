import xml from 'xml';

export default class VersionService {
  getVersion(isXml: string | false) {
    if (isXml === 'application/xml') {
      return xml({
        version: [
          { deployedBy: process.env.DEPLOYED_BY ?? 'luke-h1' },
          { deployedAt: process.env.DEPLOYED_AT ?? 'local' },
          { gitSha: process.env.GIT_SHA ?? 'unknown' },
        ],
      });
    }

    return {
      deployedBy: process.env.DEPLOYED_BY ?? 'luke-h1',
      deployedAt: process.env.DEPLOYED_AT ?? 'local',
      gitSha: process.env.GIT_SHA ?? 'unknown',
    };
  }
}
