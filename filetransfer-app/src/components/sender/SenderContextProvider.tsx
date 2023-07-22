import { CommonStateManager, FileTransferData, SenderStateManager } from "@teawithsand/tws-filesend"
import React, { ReactNode, useEffect, useState } from "react"
import { makePeer } from "../useToken"
import { CommonStateManagerContext, SenderStateManagerContext } from "../contexts"
import { wrapNoSSR } from "@teawithsand/tws-lts-react"

const InnerSenderContextProvider = (props: {
	data?: FileTransferData
	children?: ReactNode
}) => {
	const { data: data } = props

	// Hack to bypass SSR
	const [commonStateManager, setCommonStateManager] =
		useState<CommonStateManager | null>(null)
	const [senderStateManager, setSenderStateManager] =
		useState<SenderStateManager | null>(null)

	useEffect(() => {
		setCommonStateManager(
			new CommonStateManager(makePeer())
		)
	}, [])

	useEffect(() => {
		if (!commonStateManager) return

		setSenderStateManager(new SenderStateManager(commonStateManager))
	}, [commonStateManager])

	useEffect(() => {
		if (!commonStateManager) return
		commonStateManager.peer.setConfig({
			acceptDataConnections: true,
			acceptMediaConnections: false,
		})
	}, [commonStateManager])

	useEffect(() => {
		if (!senderStateManager) return
		return () => {
			senderStateManager.close()
		}
	}, [senderStateManager])

	useEffect(() => {
		if (!commonStateManager) return
		return () => {
			commonStateManager.close()
		}
	}, [commonStateManager])

	useEffect(() => {
		if (!senderStateManager) return
		if (data) senderStateManager.setFileTransferData(data)
	}, [data, senderStateManager])

	if (!senderStateManager || !commonStateManager) {
		return <></>
	}

	return (
		<CommonStateManagerContext.Provider
			value={commonStateManager}
		>
			<SenderStateManagerContext.Provider value={senderStateManager}>
				{props.children}
			</SenderStateManagerContext.Provider>
		</CommonStateManagerContext.Provider>
	)
}

export const SenderContextProvider = wrapNoSSR(InnerSenderContextProvider)
