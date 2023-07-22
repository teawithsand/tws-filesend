import type { PageProps } from "gatsby"
import * as React from "react"
import { Container } from "react-bootstrap"
import { AutonomousFileReceiver } from "../components/AutonomousFileReceiver"

const SendPage: React.FC<PageProps> = () => {
    return <Container>
        <AutonomousFileReceiver />
    </Container>
}

export default SendPage
