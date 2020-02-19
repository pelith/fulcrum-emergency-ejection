import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const FooterContainer = styled.div`
  margin-top: 40px;
  background-color: ${({ theme }) => theme.colors.offWhite};

  ${({ theme }) => theme.mediaQuery.md`
    margin-top: 60px;
  `}
`

const FooterTop = styled.div`
  width: 100%;
  height: 40px;
  margin-top: 85px;
`

const FooterBottom = styled.div`
  width: 100%;
  min-height: 40px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.blue900};
  color: ${({ theme }) => theme.colors.white};
  font-size: 12px;
  font-weight: 400;
  font-family: ${({ theme }) => theme.fontFamilies.roboto};
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
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

const SocialLinks = styled.div`
  display: flex;
  align-items: center;

  > * {
    margin: 16px;
  }
`

const OtherLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  > * {
    margin: 16px;
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

const InternalLink = styled(Link)`
  font-size: 16px;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fontFamilies.roboto};
  color: ${({ theme }) => theme.colors.blueGray400};
  text-decoration: none;
  display: flex;
  align-items: center;
`

const LanguageSelectWrapper = styled.div`
  position: relative;
  width: 108px;
  height: 40px;
  padding: 0 40px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.blueGray50};
`

const LanguageSelect = styled.select`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  padding: 0 40px;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 16px;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fontFamilies.roboto};
  cursor: pointer;
  -webkit-appearance: none;

  &:focus {
    outline: none;
  }
`

export default function Footer() {
  const { t, i18n } = useTranslation()

  const onSelectLanguage = event => {
    i18n.changeLanguage(event.target.value)
  }

  return (
    <FooterContainer>
      <FooterActions>
        <ExternalLink href='https://pelith.com' target='_blank'>
          © 2020 Pelith, Inc.
        </ExternalLink>
        <ExternalLink href='https://easydai.app/' target='_blank'>
          EasyDAI
        </ExternalLink>
        <ExternalLink href='https://eauth.pelith.com' target='_blank'>
          Eauth
        </ExternalLink>
        <ExternalLink
          href='https://devpost.com/software/crypto-structured-fund'
          target='_blank'
        >
          Crypto Structured Fund
        </ExternalLink>
        <FooterText>Fulcrum Emergency Ejection</FooterText>
        <ExternalLink href='https://github.com/pelith' target='_blank'>
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
