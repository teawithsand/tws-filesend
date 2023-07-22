import React from "react"
import styled from "styled-components"

const FooterText = styled.footer`
    text-align: right;
`

export const Footer = () => {
    return <FooterText className="mb-3 mt-3">
        Made by <a href="https://teawithsand.com">teawithsand</a>. <a href="https://github.com/teawithsand/tws-filesend">Source available on on github</a>
    </FooterText>
}