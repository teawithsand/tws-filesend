import produce from "immer"
import React from "react"
import { useCommonStateManager, useReceiverStateManager } from "../contexts"
import { useConnectAuthFactory, useTokenData } from "../useToken"
import { useStickySubscribable } from "@teawithsand/tws-lts-react"
import { ConnOpener } from "../exchange/ConnOpener"
import { ReceiverAdapterConnStage } from "@teawithsand/tws-filesend"

export const ReceiverConnOpener = () => {
	const senderStateManager = useReceiverStateManager()
	const commonStateManager = useCommonStateManager()
	const token = useTokenData()
	const factory = useConnectAuthFactory()

	const peer = commonStateManager.peer

	const peerState = useStickySubscribable(peer.stateBus)

	return (
		<ConnOpener
			disabled={!peerState.isReady}
			token={token}
			onToken={async (token) => {
				if (!peer) return
				if (peer.stateBus.lastEvent.id === token.peerId) return

				const conn = await peer.connect(token.peerId)
				const id = senderStateManager.registry.addConn(conn, {
					auth: factory(token),
				})

				senderStateManager.registry.updateConfig(id, (cfg) =>
					produce(cfg, (draft) => {
						draft.stage =
							ReceiverAdapterConnStage.AUTHENTICATE_RECEIVE_HEADER
					})
				)
			}}
		/>
	)
}
