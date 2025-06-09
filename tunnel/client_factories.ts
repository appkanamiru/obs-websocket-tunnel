import type { ClientType, ClientTypeMap } from './types.ts'

export function createClient<T extends ClientType>(
  type: T,
  data: Omit<ClientTypeMap[T], 'type'>,
): ClientTypeMap[T] {
  return {
    ...data,
    type,
  } as ClientTypeMap[T]
}
