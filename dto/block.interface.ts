export interface Header {
  readonly level: number,
  readonly proto: number,
  readonly predecessor: string,
  readonly timestamp: string | Date,
  readonly validation_pass: number,
  readonly operations_hash: string,
  readonly fitness: string[], // Array of primitives
  readonly context: string,
  readonly priority: number,
  readonly proof_of_work_nonce: string,
  readonly signature: string
}

export interface OperationsList {
  readonly max_size: number,
  readonly max_op: number,
}

export enum Kind {
  CONTRACT = 'contract',
  FREEZER = 'freezer',
}

export interface BalanceUpdate {
  readonly kind: Kind,
  readonly category: 'deposits' | 'rewards',
  readonly contract: string,
  readonly delegate: string,
  readonly cycle: number,
  readonly change: string,
}

export interface Metadata {
  readonly protocol: string,
  readonly next_protocol: string,
  readonly test_chain_status: Record<string, any>,
  readonly max_operations_ttl: number,
  readonly max_operation_data_length: number,
  readonly max_block_header_length: number,
  readonly max_operation_list_length: Partial<OperationsList>[],
  readonly baker: string,
  readonly level: Array<Record<string, any>>,
  readonly voting_period_kind: string,
  readonly nonce_hash: null | string,
  readonly consumed_gas: string | number,
  readonly deactivated: Array<any>,
  readonly balance_updates: Array<Partial<BalanceUpdate>>,
  readonly delegate: string,
  readonly slots: number[],
}

export interface OperationContent {
  readonly kind: string,
  readonly source: string,
  readonly fee: string,
  readonly counter: string,
  readonly gas_limit: string,
  readonly storage_limit: string,
  readonly amount: string,
  readonly destination: string,
  readonly level: number,
  readonly metadata: Partial<Metadata>
}

export interface Operation {
  readonly protocol: string,
  readonly chain_id: string,
  readonly hash: string,
  readonly branch: string,
  readonly contents: Partial<OperationContent>[],
  readonly signature: string,
}

export interface BlockInterface {
  readonly protocol: string,
  readonly chain_in: string,
  readonly hash: string,
  readonly header: Partial<Header>,
  readonly metadata: Partial<Metadata>,
  readonly operations: Array<Array<Partial<Operation>>>,
}
