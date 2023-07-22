import React from "react"
import styled from "styled-components"
import { useCommonStateManager, useReceiverStateManager } from "./contexts"
import { useStickySubscribable } from "@teawithsand/tws-lts-react"
import { ReceiverStateController } from "./receiver/ReceiverStateController"
import { ReceiverConnRegistrySpy } from "./receiver/ReceiverConnRegistrySpy"
import { ReceiverContextProvider } from "./receiver/ReceiverContextProvider"

const Container = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-template-columns: auto;
	gap: 1em;
`

const Section = styled.div``

const SectionTitle = styled.h3``

const SectionBody = styled.div``

// TODO(teawithsand): clear conn registry on entries or auth code or peer id change
//  can do it with hack

const InnerFileReceiver = () => {
	const transferManager = useCommonStateManager()
	const receiverManager = useReceiverStateManager()
	const authSecret = useStickySubscribable(transferManager.stateBus)
	const peerState = useStickySubscribable(transferManager.peer.stateBus)

	return (
		<Container>
			<ReceiverStateController />
			<Section>
				<SectionTitle>
					3. Accept connections to perform file transfers
				</SectionTitle>
				<SectionBody>
					<ReceiverConnRegistrySpy
						registry={receiverManager.registry}
					/>
				</SectionBody>
			</Section>
		</Container>
	)
}

export const AutonomousFileReceiver = () => {
	return (
		<ReceiverContextProvider>
			<InnerFileReceiver />
		</ReceiverContextProvider>
	)
}
