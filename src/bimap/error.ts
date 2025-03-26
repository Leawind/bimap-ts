export class BiMapError extends Error {}

/**
 * @template K - The type of the key.
 */
export class BiMapNoSuchKeyError<K> extends BiMapError {
	constructor(cause: K) {
		super(`No such key: ${cause}`, { cause });
	}
}

/**
 * @template V - The type of the value.
 */
export class BiMapNoSuchValueError<V> extends BiMapError {
	constructor(cause: V) {
		super(`No such value: ${cause}`, { cause });
	}
}

/**
 * @template K - The type of the key.
 */
export class BiMapKeyConflictError<K> extends BiMapError {
	constructor(key: K) {
		super(`Key conflict: ${key}`);
	}
}

/**
 * @template V - The type of the value.
 */
export class BiMapValueConflictError<V> extends BiMapError {
	constructor(value: V) {
		super(`Value conflict: ${value}`);
	}
}
