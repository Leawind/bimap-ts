# BiMap TypeScript Library

A TypeScript library provides a bi-directional map (BiMap) implementation, allowing efficient lookups by both keys and values. This library ensures that both keys and values are unique, maintaining an inverse mapping from values to keys.

## Features

- Efficient lookup by both keys and values.
- Unique keys and values.
- Methods for adding, deleting, and retrieving key-value pairs.
- Iterators for keys, values, and entries.

## Usage

### Import

```typescript
import { BiMap } from '@leawind/bimap';
```

### Create a BiMap

You can create a BiMap using various input types:

```typescript
const bimap1: BiMap<string, number> = BiMap.from(
	new Map([['one', 1], ['two', 2]]),
);
const bimap2: BiMap<string, number> = BiMap.from([['one', 1], ['two', 2]]);
const bimap3: BiMap<string, number> = BiMap.from({ one: 1, two: 2 });
```

### Add Key-Value Pairs

```typescript
const bimap = new BiMap<string, number>();
bimap.set('one', 1);
bimap.set('two', 2);
```

### Retrieve Values and Keys

```typescript
const value: number = bimap.getValue('one'); // 1
const key: string = bimap.getKey(2); // 'two'
```

### Delete Key-Value Pairs

```typescript
bimap.deleteKey('one');
bimap.deleteValue(2);
```

### Iterate Over Keys, Values, and Entries

```typescript
for (const key of bimap.keys()) {
	console.log(key);
}

for (const value of bimap.values()) {
	console.log(value);
}

for (const [key, value] of bimap.entries()) {
	console.log(key, value);
}
```

### Clone a BiMap

```typescript
const clone = bimap.clone();
```
