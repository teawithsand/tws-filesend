import { CommonStateManager, ReceiverStateManager } from "@teawithsand/tws-filesend"
import React, { ReactNode, useEffect, useState } from "react"
import { makePeer } from "../useToken"
import { CommonStateManagerContext, ReceiverStateManagerContext } from "../contexts"

export const ReceiverContextProvider = (props: { children?: ReactNode }) => {
	// Hack to bypass SSR
	const [commonStateManager, setCommonStateManager] =
		useState<CommonStateManager | null>(null)
	const [receiverStateManager, setReceiverStateManager] =
		useState<ReceiverStateManager | null>(null)

	useEffect(() => {
		setCommonStateManager(
			new CommonStateManager(
				makePeer()
			)
		)
	}, [])

	useEffect(() => {
		if (!commonStateManager) return

		setReceiverStateManager(
			new ReceiverStateManager(commonStateManager)
		)
	}, [commonStateManager])

	useEffect(() => {
		if (!commonStateManager) return
		commonStateManager.peer.setConfig({
			acceptDataConnections: true,
			acceptMediaConnections: false,
		})
	}, [commonStateManager])

	useEffect(() => {
		if (!receiverStateManager) return
		return () => {
			receiverStateManager.close()
		}
	}, [receiverStateManager])

	useEffect(() => {
		if (!commonStateManager) return
		return () => {
			commonStateManager.close()
		}
	}, [commonStateManager])

	if (!receiverStateManager || !commonStateManager) return <></>

	return (
		<CommonStateManagerContext.Provider
			value={commonStateManager}
		>
			<ReceiverStateManagerContext.Provider value={receiverStateManager}>
				{props.children}
			</ReceiverStateManagerContext.Provider>
		</CommonStateManagerContext.Provider>
	)
}
