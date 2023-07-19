import { ManagedPeerDataConnection } from "@teawithsand/tws-async-peer"
import type { DataConnection, Peer } from "peerjs"

export type FileTransferConn = ManagedPeerDataConnection

/**
 * Protocol version in case breaking changes were introduced in the future.
 */
export enum FileTransferVersion {
	V1 = 1,
}

/**
 * What role given party represents - does it provide token or does it validate one.
 */
export enum FileTransferAuthType {
	REQUEST = 1,
	PROVIDE = 2,
}

export const isFileTransferAuthNameValid = (name: string) => {
	if (name.length < 3) return false
	if (name.length > 64) return false

	// Valid char list
	if (!/^[a-zA-Z0-9_-]+$/.test(name)) return false

	// Can't start or end with _ or -
	if (/^[_-]+/.test(name)) return false
	if (/[_-]+$/.test(name)) return false

	return true
}


export type FileTransferHello = {
	version: FileTransferVersion
}

export type FileTransferAuthResult = {
	remotePartyName: string
}

export type FileTransferAuth = (
	| {
			type: FileTransferAuthType.PROVIDE
			authSecret: string
	  }
	| {
			type: FileTransferAuthType.REQUEST
			authSecret: string
	  }
) & {
	/**
	 * Name to send to remote party.
	 */
	name: string
}

export interface FileTransferEntry {
	/**
	 * Name of file.
	 */
	publicName: string

	/**
	 * The file itself.
	 * 
	 * The blob is concatenated from multiple chunks, and hopefully is swapped-out to disk for big files.
	 */
	file: Blob

	/**
	 * Essentially just data of any type.
	 * 
	 * Optional, since it's not really needed.
	 */
	untypedHeader?: any
}

export interface FileTransferEntryHeader {
	publicName: string
	size: number
}

export const fileTransferHeaderFromFileTransferEntry = (
	entry: FileTransferEntry
): FileTransferEntryHeader => ({
	publicName: entry.publicName,
	size: entry.file.size,
})

export enum ReceiverStageFileTransfer {
	PICK_TARGET = 1,
	EXCHANGE_CODE = 2,
	SHOW_SUMMARY = 3,
	PERFORM_RECEIVING = 4,
}

export interface FileTransferPeerData {
	peer: Peer
	dataConnections: DataConnection
}

export const MAGIC_ACCEPT_FILES = "MAGIC_ACCEPT_FILE"
export const MAGIC_DID_RECEIVE = "MAGIC_DID_RECEIVE"
export const MAGIC_AUTH_SUCCESS = "MAGIC_AUTH_SUCCESS"
export const MAGIC_AUTH_INIT = "MAGIC_AUTH_INIT"
export const MAGIC_DONE = "MAGIC_DONE"

/**
 * Token, which contains all data required to connect to remote party.
 * 
 * @see encodeFileTransferTokenData
 * @see decodeFileTransferTokenData
 */
export type FileTransferTokenData = {
	peerId: string
	authId: string
}

/**
 * Encodes FileTransferTokenData to string.
 * 
 * Inverse of decodeFileTransferTokenData
 * 
 * @see encodeFileTransferTokenData
 * @see FileTransferTokenData
 */
export const encodeFileTransferTokenData = (
	data: FileTransferTokenData
): string => {
	const { authId, peerId } = data
	return btoa(
		JSON.stringify({
			authId,
			peerId,
		})
	).replace(/[=]*/g, "")
}

/**
 * Decodes FileTransferTokenData from string.
 * 
 * Inverse of encodeFileTransferTokenData.
 * 
 * @see encodeFileTransferTokenData
 * @see FileTransferTokenData
 */
export const decodeFileTransferTokenData = (
	token: string
): FileTransferTokenData => {
	try {
		token = atob(token)
		if (typeof token !== "string")
			throw new Error("Invalid base64 string provided")
		const res = JSON.parse(token)
		if (typeof res !== "object" || res instanceof Array)
			throw new Error("Invalid token data type")
		const { authId, peerId } = res

		if (typeof authId !== "string" || typeof peerId !== "string")
			throw new Error("Invalid auth id provided")

		return {
			authId,
			peerId,
		}
	} catch (e) {
		throw new Error(`Filed to decode token: ${token}`)
	}
}
