import { assert, assertStrictEquals, assertThrows } from '@std/assert';
import {
	BiMap,
	BiMapKeyConflictError,
	BiMapValueConflictError,
} from '@/index.ts';

Deno.test('BiMap: basic', () => {
	for (
		const bimap of [
			BiMap.from(BiMap.from({ one: 1, two: 2 })),
			BiMap.from(new Map([['one', 1], ['two', 2]])),
			BiMap.from([['one', 1], ['two', 2]]),
			BiMap.from({ one: 1, two: 2 }),
		]
	) {
		// hasKey, hasValue

		assert(bimap.hasKey('one'));
		assert(bimap.hasValue(1));
		assert(bimap.hasKey('two'));
		assert(bimap.hasValue(2));

		// getKey, getValue
		assert(bimap.getKey(1) === 'one');
		assert(bimap.getValue('one') === 1);
		assert(bimap.getKey(2) === 'two');
		assert(bimap.getValue('two') === 2);

		// Deletion

		assert(bimap.deleteKey('one'));
		assert(!bimap.deleteKey('one'));
		assert(!bimap.hasKey('one'));
		assert(!bimap.hasValue(1));
		assert(bimap.hasKey('two'));
		assert(bimap.hasValue(2));

		assert(bimap.deleteValue(2));
		assert(!bimap.deleteValue(2));
		assert(!bimap.hasKey('two'));
		assert(!bimap.hasValue(2));
	}

	assertStrictEquals(BiMap.from({ one: 1 }).getKey(2), undefined);
	assertStrictEquals(BiMap.from({ one: 1 }).getValue('two'), undefined);
});

Deno.test('BiMap: setAll', () => {
	const bimap = BiMap.from({ one: 1, two: 2 });
	bimap.setAll([['three', 3], ['four', 4]]);
	assert(bimap.hasKey('one'));
	assert(bimap.hasValue(1));
	assert(bimap.hasKey('two'));
	assert(bimap.hasValue(2));
	assert(bimap.hasKey('three'));
	assert(bimap.hasValue(3));
	assert(bimap.hasKey('four'));
	assert(bimap.hasValue(4));
});

Deno.test('BiMap: iterators', () => {
	const bimap = BiMap.from({ one: 1, two: 2 });

	// Test keys iterator
	const keys = [...bimap.keys()];
	assert(keys.includes('one'));
	assert(keys.includes('two'));

	// Test values iterator
	const values = [...bimap.values()];
	assert(values.includes(1));
	assert(values.includes(2));

	// Test entries iterator
	const entries = [...bimap.entries()];
	assert(entries.some(([k, v]) => k === 'one' && v === 1));
	assert(entries.some(([k, v]) => k === 'two' && v === 2));
});

Deno.test('BiMap: clone', () => {
	const bimap = BiMap.from({ one: 1, two: 2 });
	const clone = bimap.clone();

	// Ensure clone has the same data
	assert(clone.hasKey('one'));
	assert(clone.hasValue(1));
	assert(clone.hasKey('two'));
	assert(clone.hasValue(2));

	// Ensure modifications to the clone do not affect the original
	clone.deleteKey('one');
	assert(!clone.hasKey('one'));
	assert(!clone.hasValue(1));
	assert(bimap.hasKey('one'));
	assert(bimap.hasValue(1));
});

Deno.test('BiMap: error', () => {
	assertThrows(
		() => BiMap.from({ one: 1 }).add('one', 2),
		BiMapKeyConflictError,
	);
	assertThrows(
		() => BiMap.from({ one: 1 }).add('two', 1),
		BiMapValueConflictError,
	);
});
