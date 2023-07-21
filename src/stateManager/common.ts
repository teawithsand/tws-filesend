import { ManagedPeerJS, generateSecureClientId } from "@teawithsand/tws-async-peer"
import { DefaultStickyEventBus, StickySubscribable, generateUUID } from "@teawithsand/tws-lts"
import { isFileTransferAuthNameValid } from "../defines"

export type CommonStateManagerState = {
	authSecret: string
	name: string
}

/**
 * State manager, which holds auth secret and name. It's common for both sender and receiver part.
 */
export class CommonStateManager {
	private readonly innerStateBus =
		new DefaultStickyEventBus<CommonStateManagerState>({
			authSecret: generateSecureClientId(),
			name: generateUUID(),
		})

	constructor(
		public readonly peer: ManagedPeerJS,
	) {
	}

	get stateBus(): StickySubscribable<CommonStateManagerState> {
		return this.innerStateBus
	}

	regenerateAuthSecret = () => {
		this.innerStateBus.emitEvent({
			...this.innerStateBus.lastEvent,
			authSecret: generateSecureClientId(),
		})
	}

	setName = (name: string) => {
		if (!isFileTransferAuthNameValid(name)) throw new Error("Invalid name")

		this.innerStateBus.emitEvent({
			...this.innerStateBus.lastEvent,
			name,
		})
	}

	close = () => {
		this.peer.close()
	}
}
