import { ConnRegistry, ManagedPeerEventType } from "@teawithsand/tws-async-peer"
import { FileTransferAuthType, FileTransferEntry } from "../defines"
import { CommonStateManager } from "./common"
import { DefaultStickyEventBus, StickySubscribable, SubscriptionCanceler } from "@teawithsand/tws-lts"
import { produce } from "immer"
import { SenderAdapterConnStage, SenderConnAdapter } from "../adapter/sender"

export interface FileTransferData {
	entries: FileTransferEntry[]
	untypedHeader: any
}

export class SenderStateManager {
	public readonly registry = new ConnRegistry(new SenderConnAdapter())
	private readonly innerDataBus = new DefaultStickyEventBus<FileTransferData>(
		{
			entries: [],
			untypedHeader: undefined,
		}
	)

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
						entries: this.dataBus.lastEvent.entries,
						untypedHeader: this.dataBus.lastEvent.untypedHeader,
					})

					this.registry.updateConfig(id, (cfg) =>
						produce(cfg, (draft) => {
							draft.stage =
								SenderAdapterConnStage.AUTHENTICATE_SEND_HEADERS
						})
					)
				}
			})
	}

	get dataBus(): StickySubscribable<FileTransferData> {
		return this.innerDataBus
	}

	setFileTransferData = (data: FileTransferData) => {
		this.innerDataBus.emitEvent({
			...data,
			entries: [...data.entries],
		})
	}

	/**
	 * Removes all connections from conn registry.
	 */
	purgeConnRegistry = () => {
		for (const key of Object.keys(this.registry.stateBus.lastEvent)) {
			this.registry.setConfig(key, {
				stage: SenderAdapterConnStage.CLOSE,
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