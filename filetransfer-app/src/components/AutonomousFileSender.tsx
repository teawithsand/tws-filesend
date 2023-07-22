import React from "react"
import styled from "styled-components"
import { useCommonStateManager, useSenderStateManager } from "./contexts"
import { useStickySubscribable } from "@teawithsand/tws-lts-react"
import { SenderEntriesPicker } from "./sender/SenderEntriesPicker"
import { SenderStateController } from "./sender/SenderStateController"
import { SenderConnRegistrySpy } from "./sender/SenderConnRegistrySpy"
import { FileTransferData } from "@teawithsand/tws-filesend"
import { SenderContextProvider } from "./sender/SenderContextProvider"

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

const InnerFileSender = () => {
	const transferManager = useCommonStateManager()
	const senderManager = useSenderStateManager()
	const authSecret = useStickySubscribable(transferManager.stateBus)
	const peerState = useStickySubscribable(transferManager.peer.stateBus)

	return (
		<Container>
			<Section>
				<SectionTitle>Pick files to send</SectionTitle>
				<SectionBody>
					<SenderEntriesPicker />
				</SectionBody>
			</Section>
			<hr />
			<SenderStateController />
			<Section>
				<SectionTitle>
					Accept connections to perform file transfers
				</SectionTitle>
				<SectionBody>
					<SenderConnRegistrySpy registry={senderManager.registry} />
				</SectionBody>
			</Section>
		</Container>
	)
}

export const AutonomousFileSender = (props: {
	entries?: FileTransferData | null | undefined
}) => {
	const { entries } = props
	return (
		<SenderContextProvider data={entries ?? undefined}>
			<InnerFileSender />
		</SenderContextProvider>
	)
}
