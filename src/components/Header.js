import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const HeaderContainer = styled.div`
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (min-width: 600px) {
    padding: 0 64px;
  }
`

const RocketText = styled.span`
  flex: 1 1 0;
  overflow: hidden;
  white-space: nowrap;
`

const LogoText = styled.h1`
  margin: 32px 16px;
  font-size: 30px;
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
  text-align: center;

  ${({ theme }) => theme.mediaQuery.md`
    font-size: 48px;
  `}
`

export default function Header() {
  const { t } = useTranslation()

  return (
    <HeaderContainer>
      <RocketText role='img' aria-label='rocket'>
        🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
      </RocketText>
      <LogoText>{t('title')}</LogoText>
      <RocketText role='img' aria-label='rocket'>
        🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
      </RocketText>
    </HeaderContainer>
  )
}
