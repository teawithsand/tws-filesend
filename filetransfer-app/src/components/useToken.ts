import { ManagedPeerJS } from "@teawithsand/tws-async-peer"
import { FileTransferAuth, FileTransferAuthType, FileTransferTokenData } from "@teawithsand/tws-filesend"
import { useMemo } from "react"
import { useCommonStateManager } from "./contexts"
import { useStickySubscribable, useStickySubscribableSelector } from "@teawithsand/tws-lts-react"

export const makePeer = () => {
	const peer = new ManagedPeerJS()
	// TODO(teawithsand): set up my own TURN server, in a way, which will make it just work
	// TODO(teawithsand): here insert my peerjs server address
	return peer
}

export const useConnectAuthFactory = (): ((
	token: FileTransferTokenData
) => FileTransferAuth) => {
	const transferStateManager = useCommonStateManager()
	const state = useStickySubscribable(transferStateManager.stateBus)

	return (token: FileTransferTokenData) => {
		return {
			type: FileTransferAuthType.PROVIDE,
			authSecret: token.authId,
			name: state.name,
		}
	}
}

export const useTokenData = (): FileTransferTokenData => {
	const transferStateManager = useCommonStateManager()
	const state = useStickySubscribable(transferStateManager.stateBus)
	const peerId = useStickySubscribableSelector(
		transferStateManager.peer.stateBus,
		(state) => state.id ?? ""
	)

	return useMemo(
		() => ({
			authId: state.authSecret,
			peerId,
		}),
		[state, peerId]
	)
}
