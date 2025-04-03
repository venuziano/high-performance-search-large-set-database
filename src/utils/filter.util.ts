/**
 * The maximum number of items allowed per page in paginated endpoints.
 * @param filter Defines the filter to normalize to SQL
 * @constant {string}
 */
export const tsquery = (filter: string): string =>
  filter?.trim().split(/\s+/).join(' & ');
