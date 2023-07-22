import * as React from "react"
import type { PageProps } from "gatsby"
import { AutonomousFileSender } from "../components/AutonomousFileSender"
import { Container } from "react-bootstrap"
import { Footer } from "../ui/Footer"
import { Navbar } from "../ui/Navbar"

const SendPage: React.FC<PageProps> = () => {
    return <Container>
        <Navbar />
        <main>
            <AutonomousFileSender />
        </main>
        <Footer />
    </Container>
}

export default SendPage
