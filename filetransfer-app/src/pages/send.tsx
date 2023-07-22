import * as React from "react"
import type { PageProps } from "gatsby"
import { AutonomousFileSender } from "../components/AutonomousFileSender"
import { Container } from "react-bootstrap"

const SendPage: React.FC<PageProps> = () => {
    return <Container>
        <AutonomousFileSender />
    </Container>
}

export default SendPage
