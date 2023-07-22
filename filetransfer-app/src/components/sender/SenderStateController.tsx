import React, { CSSProperties } from "react"
import styled from "styled-components"
import { PeerManager } from "../PeerManager"
import { SenderConnOpener } from "./SenderConnOpener"

const Section = styled.div``

const SectionTitle = styled.h3``

const SectionBody = styled.div``

const Container = styled.div`
	display: grid;
	gap: 1em;
`

export const SenderStateController = (props: {
	style?: CSSProperties
	className?: string
}) => {
	return (
		<Container {...props}>
			<Section>
				<SectionTitle>Communications</SectionTitle>
				<SectionBody>
					<PeerManager />
				</SectionBody>
			</Section>
			<Section>
				<SectionBody>
					<SenderConnOpener />
				</SectionBody>
			</Section>
		</Container>
	)
}
