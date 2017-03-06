/**
 * represents a query to the datastore
 * @member q the query string that is used to search documents in the datastore
 * @member type restricts results to the given type
 * @member prefix instead of matching whole tokens (default) treat the query
 *   string as a prefix that has to occur in the tokens of matching documents
 */
export interface Query {
    q: string;
    type?: string;
    prefix?: boolean;
}
