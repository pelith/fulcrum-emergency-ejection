import React from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ReactComponent as LogoIcon } from '../assets/logo.svg'

const HeaderContainer = styled.div`
  height: 100px
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (min-width: 600px) {
    padding: 0 64px;
  }
`

const HeaderLogo = styled.a`
  color: ${({ theme }) => theme.colors.textColor};
  text-decoration: none;
  display: flex;
  align-items: center;

  > *:not(:first-child) {
    margin-left: 4px;
  }
`

const RocketText = styled.p`
  text-align: right;
`

const LogoText = styled.h1`
  font-size: 3em;
  letter-spacing: 2px;
  background-image: linear-gradient(
    to left,
    violet,
    indigo,
    blue,
    green,
    yellow,
    orange,
    red
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(
    to left,
    violet,
    indigo,
    blue,
    green,
    yellow,
    orange,
    red
  );
  border-image-slice: 1;
`

const LogoSubTitle = styled.div`
  font-size: 12px;
  font-weight: 300;
  letter-spacing: ${({ language }) => (language === 'zh' ? '3.5px' : '1.7px')};
`

export default function Header() {
  const { t, i18n } = useTranslation()
  const { search } = useLocation()

  return (
    <HeaderContainer>
      <p>🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀</p>
      <LogoText>{t('title')}</LogoText>
      <p>🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀</p>
    </HeaderContainer>
  )
}
