import * as React from "react"
import type { PageProps } from "gatsby"
import { Navbar } from "../ui/Navbar"
import { Container } from "react-bootstrap"
import { Footer } from "../ui/Footer"


const IndexPage: React.FC<PageProps> = () => {
	return <Container>
		<Navbar />
		<main>
			<h1>Teawithsand's file sending tool</h1>
			<p>Easy file transfers using web browsers made possible.</p>
			<p>Source available on github at <a href="https://github.com/teawtihsand/tws-filesend">teawithsand/tws-filesend</a></p>
			<h3>POC warning!</h3>
			<p>
				Right now this demo page uses builtin peerjs STUN and TURN servers as well as peerjs token exchange server.
				These are meant for debugging only, which means that they are not suitable for production use.
				I will publicly announce this project only after this is done, and if you somehow found it, that's good for you I guess.
			</p>
			<p>
				This is the main reason transferring files is so slow. I'll soon setup my own peerjs and coturn servers,
				so they may speed things up a little.
			</p>
			<p>
				Having said that, TURNs are not required if you are transferring over LAN or you are lucky and NAT punching works.
			</p>
		</main>
		<Footer />
	</Container>
}

export default IndexPage
