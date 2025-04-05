import {
	BiMapKeyConflictError,
	BiMapNoSuchKeyError,
	BiMapNoSuchValueError,
	BiMapValueConflictError,
} from '@/bimap/error.ts';

/**
 * A BiMap (Bi-directional map) is a type of dictionary or hash table that holds key-value pairs and also maintains an inverse mapping from values to keys.
 *
 * The key is unique in a BiMap, and so is the value in the inverse mapping. This allows for efficient lookup by both keys and values.
 *
 * @template K - The type of key
 * @template V - The type of value
 */
export class BiMap<K, V> {
	protected key2value: Map<K, V> = new Map();
	protected value2key: Map<V, K> = new Map();

	/**
	 * The number of key-value pairs in the BiMap.
	 */
	get size(): number {
		return this.key2value.size;
	}

	/**
	 * Removes all key-value pairs from the BiMap.
	 */
	public clear(): this {
		this.key2value.clear();
		this.value2key.clear();
		return this;
	}

	public hasKey(key: K): boolean {
		return this.key2value.has(key);
	}

	public hasValue(value: V): boolean {
		return this.value2key.has(value);
	}

	/**
	 * @throws {BiMapNoSuchKeyError} Error is throwed if the given key does not exist
	 */
	public assertHasKey(key: K) {
		if (!this.hasKey(key)) {
			throw new BiMapNoSuchKeyError(key);
		}
	}

	/**
	 * @throws {BiMapNoSuchValueError} Error is throwed if the given value does not exist
	 */
	public assertHasValue(value: V) {
		if (!this.hasValue(value)) {
			throw new BiMapNoSuchValueError(value);
		}
	}

	/**
	 * Remove a key-value pair from the BiMap object.
	 *
	 * @returns true if an key in the BiMap existed and has been removed, or false if the key does not exist.
	 */
	public deleteKey(key: K): boolean {
		if (this.hasKey(key)) {
			this.value2key.delete(this.key2value.get(key)!);
			this.key2value.delete(key);
			return true;
		}
		return false;
	}

	/**
	 * Remove a key-value pair by value from the BiMap object.
	 *
	 * @returns true if an value in the BiMap existed and has been removed, or false if the value does not exist.
	 */
	public deleteValue(value: V): boolean {
		if (this.hasValue(value)) {
			this.key2value.delete(this.value2key.get(value)!);
			this.value2key.delete(value);
			return true;
		}
		return false;
	}

	/**
	 * Removes multiple keys from the BiMap object.
	 *
	 * @param keys - The keys to remove
	 * @returns The number of keys removed
	 */
	public deleteKeys(keys: K[]): number {
		let num = 0;
		for (let i = 0; i < keys.length; i++) {
			if (this.deleteKey(keys[i])) {
				num++;
			}
		}
		return num;
	}

	/**
	 * Removes multiple values from the BiMap object.
	 *
	 * @param values - The values to remove
	 * @returns The number of values removed
	 */
	public deleteValues(values: V[]): number {
		let num = 0;
		for (let i = 0; i < values.length; i++) {
			if (this.deleteValue(values[i])) {
				num++;
			}
		}
		return num;
	}

	/**
	 * Returns a value from the BiMap object.
	 *
	 * @template U - the returned value will be casted to this type
	 * @returns Returns the value associated with the specified key
	 */
	public getValue<U extends V = V>(key: K): U | undefined {
		return this.key2value.get(key) as U | undefined;
	}

	/**
	 * Returns a key from the BiMap object.
	 *
	 * @template U - the returned value will be casted to this type
	 * @returns Returns the key associated with the specified value
	 */
	public getKey<U extends K = K>(value: V): U | undefined {
		return this.value2key.get(value) as U | undefined;
	}

	/**
	 * Returns an iterable of keys in the map
	 */
	public keys(): MapIterator<K> {
		return this.key2value.keys();
	}

	/**
	 * Returns an iterable of values in the map
	 */
	public values(): MapIterator<V> {
		return this.value2key.keys();
	}

	/**
	 * Returns an iterable of key, value pairs for every entry in the map.
	 */
	public entries(): MapIterator<[K, V]> {
		return this.key2value.entries();
	}

	/**
	 * Executes a provided function once per each key/value pair in the BiMap, in insertion order.
	 */
	public forEach(callback: (pair: [key: K, value: V], bimap: this) => void) {
		this.key2value.forEach((value, key) => callback([key, value], this));
	}

	public clone(): BiMap<K, V> {
		const cloned = new BiMap<K, V>();
		cloned.key2value = new Map(this.key2value);
		cloned.value2key = new Map(this.value2key);
		return cloned;
	}

	/**
	 * Adds a new pair of [key, value] to the BiMap.
	 *
	 * If any pair with the same key or value already exists, they will be removed.
	 */
	public set(key: K, value: V): this {
		if (this.hasKey(key)) {
			this.deleteKey(key);
		}
		if (this.hasValue(value)) {
			this.deleteValue(value);
		}
		this.key2value.set(key, value);
		this.value2key.set(value, key);
		return this;
	}
	/**
	 * Adds multiple pairs of [key, value] to the BiMap.
	 *
	 * If any pair with the same key or value already exists, they will be removed.
	 */
	public setAll(pairs: BiMap<K, V>): this;
	public setAll(pairs: Map<K, V>): this;
	public setAll(pairs: [K, V][]): this;
	public setAll(this: BiMap<string, V>, pairs: Record<string, V>): this;
	public setAll(
		pairs:
			| BiMap<K, V>
			| Map<K, V>
			| [K, V][]
			| Record<string, V>,
	): this {
		if (pairs instanceof BiMap) {
			pairs.forEach(([key, value]) => this.set(key, value));
		} else if (pairs instanceof Map) {
			for (const [key, value] of pairs.entries()) {
				this.set(key, value);
			}
		} else if (Array.isArray(pairs)) {
			for (let i = 0; i < pairs.length; i++) {
				const [key, value] = pairs[i];
				this.set(key, value);
			}
		} else {
			const arr = Object.entries(pairs);
			for (let i = 0; i < arr.length; i++) {
				const [key, value] = arr[i];
				this.set(key as K, value);
			}
		}
		return this;
	}

	/**
	 * Adds a new pair of [key, value] to the BiMap.
	 *
	 * If any pair with the same key or value already exists, an error will be thrown.
	 *
	 * @throws {BiMapKeyConflictError} Error is throwed if the given key already exists
	 * @throws {BiMapValueConflictError} Error is throwed if the given value already exists
	 */
	public add(key: K, value: V): this {
		if (this.hasKey(key)) {
			throw new BiMapKeyConflictError(key);
		} else if (this.hasValue(value)) {
			throw new BiMapValueConflictError(value);
		}
		this.key2value.set(key, value);
		this.value2key.set(value, key);
		return this;
	}

	/**
	 * Adds multiple pairs of [key, value] to the BiMap.
	 *
	 * If any pair with the same key or value already exists, an error will be thrown.
	 *
	 * @throws {BiMapKeyConflictError} Error is throwed if the given key already exists
	 * @throws {BiMapValueConflictError} Error is throwed if the given value already exists
	 */
	public addAll(pairs: BiMap<K, V>): this;
	public addAll(pairs: Map<K, V>): this;
	public addAll(pairs: [K, V][]): this;
	public addAll(this: BiMap<string, V>, pairs: Record<string, V>): this;
	public addAll(
		pairs:
			| BiMap<K, V>
			| Map<K, V>
			| [K, V][]
			| Record<string, V>,
	): this;
	public addAll(
		pairs:
			| BiMap<K, V>
			| Map<K, V>
			| [K, V][]
			| Record<string, V>,
	): this {
		if (pairs instanceof BiMap) {
			pairs.forEach(([key, value]) => this.add(key, value));
		} else if (pairs instanceof Map) {
			for (const [key, value] of pairs.entries()) {
				this.add(key, value);
			}
		} else if (Array.isArray(pairs)) {
			for (let i = 0; i < pairs.length; i++) {
				const [key, value] = pairs[i];
				this.add(key, value);
			}
		} else {
			const arr = Object.entries(pairs);
			for (let i = 0; i < arr.length; i++) {
				const [key, value] = arr[i];
				this.add(key as K, value);
			}
		}
		return this;
	}

	/**
	 * Creates a new BiMap
	 */
	public static from<K, V>(pairs: BiMap<K, V>): BiMap<K, V>;
	public static from<K, V>(pairs: Map<K, V>): BiMap<K, V>;
	public static from<K, V>(pairs: [K, V][]): BiMap<K, V>;
	public static from<V>(pairs: Record<string, V>): BiMap<string, V>;
	public static from<K, V>(
		pairs:
			| BiMap<K, V>
			| Map<K, V>
			| [K, V][]
			| Record<string, V>,
	): BiMap<K, V>;
	public static from<K, V>(
		pairs:
			| BiMap<K, V>
			| Map<K, V>
			| [K, V][]
			| Record<string, V>,
	): BiMap<K, V> {
		return new BiMap<K, V>().addAll(pairs);
	}
}
