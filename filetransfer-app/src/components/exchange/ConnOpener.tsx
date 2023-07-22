import React, { useRef, useState } from "react"
import { Alert, Form } from "react-bootstrap"
import styled from "styled-components"
import { QRAuthCodeSender } from "./QRAuthCodeSender"
import { TextAuthCodeSender } from "./TextAuthCodeSender"
import { TextAuthCodeReceiver } from "./TextAuthCodeReceiver"
import { QRAuthCodeReceiver } from "./QRAuthCodeReceiver"
import { FileTransferTokenData } from "@teawithsand/tws-filesend"

enum State {
	PICK = 1,
	SHOW_CODE = 2,
	SHOW_QR = 3,
	ENTER_CODE = 4,
	SCAN_QR = 5,
}

const Container = styled.div``

const DisplayContainer = styled.div`
	margin-top: 1em;
`

export const ConnOpener = (props: {
	disabled?: boolean
	token: FileTransferTokenData
	onToken: (token: FileTransferTokenData) => Promise<void>
}) => {
	const { token, onToken: innerOnToken, disabled } = props
	const [state, setState] = useState<State>(State.PICK)
	const runningCtrRef = useRef(0)
	const [runningCtr, setRunningCtr] = useState(0)
	let innerDisplay = null

	const onToken = (token: FileTransferTokenData) => {
		setState(State.PICK)

		runningCtrRef.current++
		setRunningCtr(runningCtrRef.current)

		innerOnToken(token).finally(() => {
			runningCtrRef.current--
			setRunningCtr(runningCtrRef.current)
		})
	}

	if (state === State.SHOW_QR) {
		innerDisplay = <QRAuthCodeSender token={token} />
	} else if (state === State.SHOW_CODE) {
		innerDisplay = <TextAuthCodeSender token={token} />
	} else if (state === State.ENTER_CODE) {
		innerDisplay = <TextAuthCodeReceiver onToken={onToken} />
	} else if (state === State.SCAN_QR) {
		innerDisplay = <QRAuthCodeReceiver onToken={onToken} />
	} else {
		innerDisplay = (
			<Alert variant="info">
				Pick some code exchange method in order to connect to remote
				device.
			</Alert>
		)
	}

	if (disabled) {
		return (
			<Container>
				<Alert variant="info">
					Please start client using button above before exchanging
					code. If you want to send files, make sure you have selected
					at least one.
				</Alert>
			</Container>
		)
	}

	return (
		<Container>
			<Form.Group>
				<Form.Select
					value={state}
					onChange={(e) => {
						// ignore changes if promise till conn open is pending.
						// TODO(teawithsand): Please note that some info should be shown
						if (runningCtr) return

						setState(parseInt(e.target.value) || State.PICK)
					}}
				>
					<option value={State.PICK}>Pick connect method</option>
					<option value={State.SHOW_CODE}>Show code</option>
					<option value={State.SHOW_QR}>Show QR</option>
					<option value={State.ENTER_CODE}>Enter code</option>
					<option value={State.SCAN_QR}>Scan QR</option>
				</Form.Select>
			</Form.Group>
			<DisplayContainer>{innerDisplay}</DisplayContainer>
		</Container>
	)
}
