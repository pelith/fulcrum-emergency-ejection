import React from 'react'
import styled from 'styled-components'

const FooterContainer = styled.div`
  margin-top: 40px;
  background-color: ${({ theme }) => theme.colors.offWhite};

  ${({ theme }) => theme.mediaQuery.md`
    margin-top: 60px;
  `}
`

const FooterActions = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  > * {
    margin: 12px;
  }
`

const FooterText = styled.a`
  font-size: 16px;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fontFamilies.roboto};
  color: ${({ theme }) => theme.colors.blueGray400};
  text-decoration: none;
  display: flex;
  align-items: center;

  > *:not(:first-child) {
    margin-left: 8px;
  }
`

const ExternalLink = styled.a`
  font-size: 16px;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fontFamilies.roboto};
  color: ${({ theme }) => theme.colors.blueGray400};
  text-decoration: none;
  display: flex;
  align-items: center;

  > *:not(:first-child) {
    margin-left: 8px;
  }
`

export default function Footer() {
  return (
    <FooterContainer>
      <FooterActions>
        <ExternalLink href='https://pelith.com' target='_blank'>
          © 2020 Pelith, Inc.
        </ExternalLink>
        <ExternalLink href='https://easydai.app/' target='_blank'>
          EasyDAI
        </ExternalLink>
        <ExternalLink
          href='https://github.com/pelith/node-eauth-server'
          target='_blank'
        >
          Eauth
        </ExternalLink>
        <ExternalLink
          href='https://devpost.com/software/crypto-structured-fund'
          target='_blank'
        >
          Crypto Structured Fund
        </ExternalLink>
        <FooterText>Fulcrum Emergency Ejection</FooterText>
        <ExternalLink
          href='https://github.com/pelith/fulcrum-emergency-ejection'
          target='_blank'
        >
          Github
        </ExternalLink>
        <ExternalLink
          href='https://etherscan.io/address/0xec4b77e7369325b52a1f9d1ae080b59954b8001a#code'
          target='_blank'
        >
          Contract
        </ExternalLink>
      </FooterActions>
    </FooterContainer>
  )
}
