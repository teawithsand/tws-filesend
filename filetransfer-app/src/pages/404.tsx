import * as React from "react"
import { HeadFC, Link, PageProps } from "gatsby"
import { Container } from "react-bootstrap"
import { Navbar } from "../ui/Navbar"
import { Footer } from "../ui/Footer"

const NotFoundPage: React.FC<PageProps> = () => {
	return (
		<Container>
			<Navbar />
			<h1>There is nothing here</h1>
			<Link to="/">Go to main page</Link>
			<Footer />
		</Container>
	)
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
