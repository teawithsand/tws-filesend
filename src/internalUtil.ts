export const randomArrayBufferSync = (size: number): ArrayBuffer => {
	const MAX_LEN = 1024

	const buffer = new ArrayBuffer(size)
	let offset = 0
	for (;;) {
		if (offset === buffer.byteLength) break

		const sz = Math.min(MAX_LEN, buffer.byteLength - offset)
		const arr = new Uint8Array(buffer.slice(offset, offset + sz))

		crypto.getRandomValues(arr)
		offset += sz
	}
	return buffer
}
