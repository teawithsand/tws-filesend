import { ConnRegistry, ManagedPeerEventType } from "@teawithsand/tws-async-peer"
import { SubscriptionCanceler } from "@teawithsand/tws-lts"
import { CommonStateManager } from "./common"
import { FileTransferAuthType } from "../defines"
import { produce } from "immer"
import { ReceiverAdapterConnStage, ReceiverConnAdapter } from "../adapter"

export class ReceiverStateManager {
	public readonly registry = new ConnRegistry(new ReceiverConnAdapter())

	private fileTransferStateManagerSubscriptionCanceller: SubscriptionCanceler | null =
		null

	constructor(fileTransferStateManager: CommonStateManager) {
		this.fileTransferStateManagerSubscriptionCanceller =
			fileTransferStateManager.peer.eventBus.addSubscriber((event) => {
				if (event.type === ManagedPeerEventType.MEDIA_CONN) {
					event.conn.close()
				} else if (event.type === ManagedPeerEventType.DATA_CONN) {
					const { lastEvent } = fileTransferStateManager.stateBus

					const id = this.registry.addConn(event.conn, {
						auth: {
							type: FileTransferAuthType.REQUEST,
							authSecret: lastEvent.authSecret,
							name: lastEvent.name,
						},
					})

					this.registry.updateConfig(id, (cfg) =>
						produce(cfg, (draft) => {
							draft.stage =
								ReceiverAdapterConnStage.AUTHENTICATE_RECEIVE_HEADER
						})
					)
				}
			})
	}

	/**
	 * Removes all connections from conn registry.
	 */
	purgeConnRegistry = () => {
		for (const key of Object.keys(this.registry.stateBus.lastEvent)) {
			this.registry.setConfig(key, {
				stage: ReceiverAdapterConnStage.CLOSE,
			})
			// TODO(teawithsand): fix remove conn bug in registry implementation
			//  right now conn may be re-added by some event even if it was removed
			this.registry.removeConn(key)
		}
	}

	close = () => {
		if (this.fileTransferStateManagerSubscriptionCanceller) {
			this.fileTransferStateManagerSubscriptionCanceller()
			this.fileTransferStateManagerSubscriptionCanceller = null
		}

		this.purgeConnRegistry()
	}
}