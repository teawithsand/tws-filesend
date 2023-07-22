import { FileTransferEntry } from "@teawithsand/tws-filesend"
import { DownloadApiHelper, DownloadableEntry, DownloadableEntryType } from "@teawithsand/tws-web"
import React, { useState } from "react"
import {
	Button,
	Form
} from "react-bootstrap"
import styled from "styled-components"

const Container = styled.div`
	padding: 0.5em;
	border: 1px solid rgba(0, 0, 0, 0.125);
	border-radius: 0.5em;
	display: grid;
	grid-auto-flow: row;
	gap: 0.5em;
`

export const ReceiverDownloadAll = (props: {
	entries: FileTransferEntry[]
}) => {
	const [prefix, setPrefix] = useState("")
	return (
		<Container>
			<Form.Group>
				<Form.Label>Prefix</Form.Label>
				<Form.Control
					value={prefix}
					placeholder={
						"Prefix for names of all downloaded files(optional)."
					}
					onChange={(e) => {
						setPrefix(e.target.value)
					}}
					type="text"
				/>
			</Form.Group>
			<Form.Group>
				<Button
					onClick={() => {
						let actualPrefix = ""
						if (prefix) {
							actualPrefix = prefix + "_"
						}
						const downloadableEntries: DownloadableEntry[] =
							props.entries.map((v) => ({
								type: DownloadableEntryType.BLOB,
								blob: v.file,
								filename: actualPrefix + v.publicName,
							}))

						DownloadApiHelper.instance
							.entries(downloadableEntries)
							.download()
					}}
				>
					Download all files
				</Button>
			</Form.Group>
		</Container>
	)
}
