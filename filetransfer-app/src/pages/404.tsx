import * as React from "react"
import { HeadFC, Link, PageProps } from "gatsby"
const NotFoundPage: React.FC<PageProps> = () => {
	return (
		<>Not found. <Link to="/">Go to main page</Link></>
	)
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
