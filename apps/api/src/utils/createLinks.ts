import mapValues from 'lodash/mapValues';
import { ParsedQs } from 'qs';
// eslint-disable-next-line import/no-cycle
import createPaginationLinks from './createPaginationLinks';

export type LinkViewModel = {
  /**
   * The URI of the link.
   */
  href: string;
  /**
   * The title of the link. Can help understand what the link relates to.
   */
  title?: string;
  /**
   * The HTTP method to use with this link.
   */
  method?: string;
};

/**
 * A map of links to related resources/endpoints. A link to the current resource (i.e. `self`) is always provided.
 */
export type LinksViewModel = Record<string, LinkViewModel>;

export interface Options {
  self: {
    url: string;
    method: string;
  };
  paging?: {
    query: ParsedQs;
    page: number;
    totalPages: number;
    totalResults: number;
  };
  links?: LinksViewModel;
}

export default function createLinks(options: Options): LinksViewModel {
  const { self, paging } = options;
  const baseUrl = new URL(self.url).origin;

  const links = mapValues(options.links, link => {
    return {
      ...link,
      href: `${baseUrl}${link.href}`,
    };
  });

  const paginatedLinks = paging ? createPaginationLinks({ paging, self }) : {};

  return {
    self:
      self.method === 'GET'
        ? { href: self.url }
        : { href: self.url, method: self.method },
    ...paginatedLinks,
    ...links,
  };
}
