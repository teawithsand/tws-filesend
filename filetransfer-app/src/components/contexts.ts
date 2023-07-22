import { CommonStateManager, ReceiverStateManager, SenderStateManager } from "@teawithsand/tws-filesend"
import { throwExpression } from "@teawithsand/tws-lts"
import { createContext, useContext } from "react"

export const CommonStateManagerContext =
	createContext<CommonStateManager | null>(null)

export const useCommonStateManager = () =>
	useContext(CommonStateManagerContext) ??
	throwExpression(new Error("No peer helper found"))

export const SenderStateManagerContext =
	createContext<SenderStateManager | null>(null)

export const useSenderStateManager = () =>
	useContext(SenderStateManagerContext) ??
	throwExpression(new Error("No peer helper found"))

export const ReceiverStateManagerContext =
	createContext<ReceiverStateManager | null>(null)

export const useReceiverStateManager = () =>
	useContext(ReceiverStateManagerContext) ??
	throwExpression(new Error("No peer helper found"))
