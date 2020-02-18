import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ReactComponent as LanguageIcon } from '../assets/language.svg'
import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg'

const FooterContainer = styled.div`
  margin-top: 40px;

  ${({ theme }) => theme.mediaQuery.md`
    margin-top: 60px;
  `}
`

const FooterTop = styled.div`
  width: 100%;
  height: 200px;
  padding-top: 56px;
  background-color: ${({ theme }) => theme.colors.offWhite};
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
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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

const StyledLanguageIcon = styled(LanguageIcon)`
  position: absolute;
  left: 10px;
  top: 8px;
  width: 24px;
  height: 24px;
`

const StyledLanguageDropdown = styled(DropdownIcon)`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  height: 20px;
`

export default function Footer() {
  const { t, i18n } = useTranslation()

  const onSelectLanguage = event => {
    i18n.changeLanguage(event.target.value)
  }

  return (
    <FooterContainer>
    </FooterContainer>
  )
}
