/**
 * represents a query to the datastore
 * @property q the query string that is used to search documents in the datastore
 * @property type restricts results to the given type
 * @property contraints restricts the search result further to match some fields.
 *   it can be interpreted as additional AND queries. A given contraint of
 *   { 'resource.relations.isRecordedIn' : 'id1' } would mean that the search result
 *   contains the results which match the other properties of the query and which
 *   also match the given search term in the given field exactly.
 * @property prefix instead of matching whole tokens (default) treat the query
 *   string as a prefix that has to occur in the tokens of matching documents
 */
export interface Query {
    q: string;
    type?: string;
    prefix?: boolean;
    constraints?: any;
}
