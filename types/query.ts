/* eslint-disable max-lines */
/**
 * Operators for where clauses
 */
export declare type Operators =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'inq'
  | 'nin'
  | 'between'
  | 'exists'
  | 'and'
  | 'or'
  | 'like'
  | 'nlike'
  | 'ilike'
  | 'nilike'
  | 'regexp'
/**
 * Matching predicate comparison
 */
export declare type PredicateComparison<PT> = {
  eq?: PT
  neq?: PT
  gt?: PT
  gte?: PT
  lt?: PT
  lte?: PT
  inq?: PT[]
  nin?: PT[]
  between?: [PT, PT]
  exists?: boolean
  like?: PT
  nlike?: PT
  ilike?: PT
  nilike?: PT
  regexp?: string | RegExp
}
/**
 * Value types for `{propertyName: value}`
 */
export declare type ShortHandEqualType = string | number | boolean | Date
/**
 * Key types of a given model, excluding operators
 */
export declare type KeyOf<MT extends object> = Exclude<Extract<keyof MT, string>, Operators>
/**
 * Condition clause
 *
 * @example
 * ```ts
 * {
 *   name: {inq: ['John', 'Mary']},
 *   status: 'ACTIVE',
 *   age: {gte: 40}
 * }
 * ```
 */
export declare type Condition<MT extends object> = {
  [P in KeyOf<MT>]?: PredicateComparison<MT[P]> | (MT[P] & ShortHandEqualType)
}
/**
 * Where clause
 *
 * @example
 * ```ts
 * {
 *   name: {inq: ['John', 'Mary']},
 *   status: 'ACTIVE'
 *   and: [...],
 *   or: [...],
 * }
 * ```
 */
export declare type Where<MT extends object = Record<string, any>> = Condition<MT> | IAndClause<MT> | IOrClause<MT>
/**
 * And clause
 *
 * @example
 * ```ts
 * {
 *   and: [...],
 * }
 * ```
 */
export interface IAndClause<MT extends object> {
  and: Where<MT>[]
}
/**
 * Or clause
 *
 * @example
 * ```ts
 * {
 *   or: [...],
 * }
 * ```
 */
export interface IOrClause<MT extends object> {
  or: Where<MT>[]
}
/**
 * Order by direction
 */
export declare type Direction = 'ASC' | 'DESC'
/**
 * Order by
 *
 * Example:
 * `{afieldname: 'ASC'}`
 */
export declare type Order<MT = Record<string, any>> = {
  [P in keyof MT]: Direction
}
/**
 * Selection of fields
 *
 * Example:
 * `{afieldname: true}`
 */
export declare type Fields<MT = Record<string, any>> =
  | {
      [P in keyof MT]?: boolean
    }
  | Extract<keyof MT, string>[]
/**
 * Inclusion of related items
 *
 * Note: scope means filter on related items
 *
 * Example:
 * `{relation: 'aRelationName', scope: {<AFilterObject>}}`
 */
export interface IInclusion {
  relation: string
  scope?: IFilter<Record<string, any>>
}
/**
 * Query filter object
 */
export interface IFilter<MT extends object = Record<string, any>> {
  /**
   * The matching criteria
   */
  where?: Where<MT>
  /**
   * To include/exclude fields
   */
  fields?: Fields<MT>
  /**
   * Sorting order for matched entities. Each item should be formatted as
   * `fieldName ASC` or `fieldName DESC`.
   * For example: `['f1 ASC', 'f2 DESC', 'f3 ASC']`.
   *
   * We might want to use `Order` in the future. Keep it as `string[]` for now
   * for compatibility with LoopBack 3.x.
   */
  order?: string[]
  /**
   * Maximum number of entities
   */
  limit?: number
  /**
   * Skip N number of entities
   */
  skip?: number
  /**
   * Offset N number of entities. An alias for `skip`
   */
  offset?: number
  /**
   * To include related objects
   */
  include?: InclusionFilter[]
}
/**
 * Inclusion filter type e.g. 'property', {relation: 'property'}
 */
export declare type InclusionFilter = string | IInclusion
/**
 * Filter without `where` property
 */
export declare type FilterExcludingWhere<MT extends object = Record<string, any>> = Omit<IFilter<MT>, 'where'>
/**
 * TypeGuard for Filter
 * @param candidate
 */
export declare function isFilter<MT extends object>(candidate: any): candidate is IFilter<MT>
/**
 * A builder for Where object. It provides fluent APIs to add clauses such as
 * `and`, `or`, and other operators.
 *
 * @example
 * ```ts
 * const whereBuilder = new WhereBuilder();
 * const where = whereBuilder
 *   .eq('a', 1)
 *   .and({x: 'x'}, {y: {gt: 1}})
 *   .and({b: 'b'}, {c: {lt: 1}})
 *   .or({d: 'd'}, {e: {neq: 1}})
 *   .build();
 * ```
 */
export declare class WhereBuilder<MT extends object = Record<string, any>> {
  where: Where<MT>
  constructor(w?: Where<MT>)
  private add
  /**
   * @deprecated
   * Starting from TypeScript 3.2, we don't have to cast any more. This method
   * should be considered as `deprecated`.
   *
   * Cast an `and`, `or`, or condition clause to Where
   * @param clause - And/Or/Condition clause
   */
  cast(clause: IAndClause<MT> | IOrClause<MT> | Condition<MT>): Where<MT>
  /**
   * Add an `and` clause.
   * @param w - One or more where objects
   */
  and(...w: (Where<MT> | Where<MT>[])[]): this
  /**
   * Add an `or` clause.
   * @param w - One or more where objects
   */
  or(...w: (Where<MT> | Where<MT>[])[]): this
  /**
   * Add an `=` condition
   * @param key - Property name
   * @param val - Property value
   */
  eq<K extends KeyOf<MT>>(key: K, val: MT[K]): this
  /**
   * Add a `!=` condition
   * @param key - Property name
   * @param val - Property value
   */
  neq<K extends KeyOf<MT>>(key: K, val: MT[K]): this
  /**
   * Add a `>` condition
   * @param key - Property name
   * @param val - Property value
   */
  gt<K extends KeyOf<MT>>(key: K, val: MT[K]): this
  /**
   * Add a `>=` condition
   * @param key - Property name
   * @param val - Property value
   */
  gte<K extends KeyOf<MT>>(key: K, val: MT[K]): this
  /**
   * Add a `<` condition
   * @param key - Property name
   * @param val - Property value
   */
  lt<K extends KeyOf<MT>>(key: K, val: MT[K]): this
  /**
   * Add a `<=` condition
   * @param key - Property name
   * @param val - Property value
   */
  lte<K extends KeyOf<MT>>(key: K, val: MT[K]): this
  /**
   * Add a `inq` condition
   * @param key - Property name
   * @param val - An array of property values
   */
  inq<K extends KeyOf<MT>>(key: K, val: MT[K][]): this
  /**
   * Add a `nin` condition
   * @param key - Property name
   * @param val - An array of property values
   */
  nin<K extends KeyOf<MT>>(key: K, val: MT[K][]): this
  /**
   * Add a `between` condition
   * @param key - Property name
   * @param val1 - Property value lower bound
   * @param val2 - Property value upper bound
   */
  between<K extends KeyOf<MT>>(key: K, val1: MT[K], val2: MT[K]): this
  /**
   * Add a `exists` condition
   * @param key - Property name
   * @param val - Exists or not
   */
  exists<K extends KeyOf<MT>>(key: K, val?: boolean): this
  /**
   * Add a where object. For conflicting keys with the existing where object,
   * create an `and` clause.
   * @param where - Where filter
   */
  impose(where: Where<MT>): this
  /**
   * Add a `like` condition
   * @param key - Property name
   * @param val - Regexp condition
   */
  like<K extends KeyOf<MT>>(key: K, val: MT[K]): this
  /**
   * Add a `nlike` condition
   * @param key - Property name
   * @param val - Regexp condition
   */
  nlike<K extends KeyOf<MT>>(key: K, val: MT[K]): this
  /**
   * Add a `ilike` condition
   * @param key - Property name
   * @param val - Regexp condition
   */
  ilike<K extends KeyOf<MT>>(key: K, val: MT[K]): this
  /**
   * Add a `nilike` condition
   * @param key - Property name
   * @param val - Regexp condition
   */
  nilike<K extends KeyOf<MT>>(key: K, val: MT[K]): this
  /**
   * Add a `regexp` condition
   * @param key - Property name
   * @param val - Regexp condition
   */
  regexp<K extends KeyOf<MT>>(key: K, val: string | RegExp): this
  /**
   * Get the where object
   */
  build(): Where<MT>
}
/**
 * A builder for Filter. It provides fleunt APIs to add clauses such as
 * `fields`, `order`, `where`, `limit`, `offset`, and `include`.
 *
 * @example
 * ```ts
 * const filterBuilder = new FilterBuilder();
 * const filter = filterBuilder
 *   .fields('id', 'a', 'b')
 *   .limit(10)
 *   .offset(0)
 *   .order(['a ASC', 'b DESC'])
 *   .where({id: 1})
 *   .build();
 * ```
 */
export declare class FilterBuilder<MT extends object = Record<string, any>> {
  filter: IFilter<MT>
  constructor(f?: IFilter<MT>)
  /**
   * Set `limit`
   * @param limit - Maximum number of records to be returned
   */
  limit(limit: number): this
  /**
   * Set `offset`
   * @param offset - Offset of the number of records to be returned
   */
  offset(offset: number): this
  /**
   * Alias to `offset`
   * @param skip
   */
  skip(skip: number): this
  /**
   * Describe what fields to be included/excluded
   * @param f - A field name to be included, an array of field names to be
   * included, or an Fields object for the inclusion/exclusion
   */
  fields(...f: (Fields<MT> | Extract<keyof MT, string>)[]): this
  private validateOrder
  /**
   * Describe the sorting order
   * @param o - A field name with optional direction, an array of field names,
   * or an Order object for the field/direction pairs
   */
  order(...o: (string | string[] | Order<MT>)[]): this
  /**
   * Declare `include`
   * @param i - A relation name, an array of relation names, or an `Inclusion`
   * object for the relation/scope definitions
   */
  include(...i: (string | string[] | IInclusion)[]): this
  /**
   * Declare a where clause
   * @param w - Where object
   */
  where(w: Where<MT>): this
  /**
   * Add a Filter or Where constraint object. If it is a filter object, create
   * an `and` clause for conflicting keys with its where object. For any other
   * properties, throw an error. If it's not a Filter, coerce it to a filter,
   * and carry out the same logic.
   *
   * @param constraint - a constraint object to merge with own filter object
   */
  impose(constraint: IFilter<MT> | Where<MT>): this
  /**
   * Return the filter object
   */
  build(): IFilter<MT>
}
export declare function filterTemplate(strings: TemplateStringsArray, ...keys: any[]): (ctx: Record<string, any>) => any
