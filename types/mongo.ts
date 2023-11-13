export type AggregationPipeline = Record<string, unknown>[]
export type AggregationPayload = { pipeline: AggregationPipeline }
export interface IAggregationCount {
  totalCount: number
}
