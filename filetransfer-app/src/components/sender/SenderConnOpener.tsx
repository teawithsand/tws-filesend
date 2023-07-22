import produce from "immer"
import React from "react"
import { useCommonStateManager, useSenderStateManager } from "../contexts"
import { useConnectAuthFactory, useTokenData } from "../useToken"
import { useStickySubscribable } from "@teawithsand/tws-lts-react"
import { ConnOpener } from "../exchange/ConnOpener"
import { SenderAdapterConnStage } from "@teawithsand/tws-filesend"

export const SenderConnOpener = () => {
	const senderStateManager = useSenderStateManager()
	const commonStateManager = useCommonStateManager()
	const token = useTokenData()
	const factory = useConnectAuthFactory()

	const peer = commonStateManager.peer

	const data = useStickySubscribable(senderStateManager.dataBus)
	const peerState = useStickySubscribable(peer.stateBus)

	return (
		<ConnOpener
			disabled={!peerState.isReady}
			token={token}
			onToken={async (token) => {
				console.log("On token", token)
				if (!peer) return

				if (peer.stateBus.lastEvent.id === token.peerId) return

				const conn = await peer.connect(token.peerId)
				console.log("Got conn from peer.connect!", conn)
				const id = senderStateManager.registry.addConn(conn, {
					auth: factory(token),
					...data,
				})

				senderStateManager.registry.updateConfig(id, (cfg) =>
					produce(cfg, (draft) => {
						draft.stage =
							SenderAdapterConnStage.AUTHENTICATE_SEND_HEADERS
					})
				)
			}}
		/>
	)
}
