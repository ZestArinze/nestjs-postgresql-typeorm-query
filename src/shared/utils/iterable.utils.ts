export const getUniqueListOfObjectsByKey = <T = any,>(key: string, arr: Array<T>): Array<T> => {
	return [...new Map(arr.map(item => [item[key], item])).values()]
}

export function randomItem<T = any,>(items: Array<T>): T {
	return items[Math.floor(Math.random() * items.length)];
}