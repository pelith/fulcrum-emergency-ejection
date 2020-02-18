import React, { useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useGasPrice } from '../hooks/ethereum'
import {
  parseQueryString,
  getContract,
} from '../utils'
import BigNumber from 'bignumber.js'
import FulcrumEmergencyEjection_ABI from '../constants/abis/fulcrumEmergencyEjection.json'
import IErc20_ABI from '../constants/abis/iErc20.json'
import styled from 'styled-components'
import ImportAccount from '../components/ImportAccount'
import { ReactComponent as LoadingIcon } from '../assets/loading.svg'

const ReturnButton = styled(Link)`
  margin-bottom: 25px
  position: fixed;
  left: 0;
  top: 100px;
  z-index: 99;
  border-radius: 3px 0 0 3px;
  font-size: 13px;
  padding: 10px 18px;
  cursor: pointer;
  box-shadow: 0 2px 15px -6px #000;
  display: block;

	background-color: #f6f7fa;
  color: #5a5e67;

  text-decoration: none;
  
  &:before {
    content: "\\2190";
    font-size: 15px;
    margin-right: 5px;
    position: relative;
    top: 1px;
  }
`

const CopyButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 16px;
  padding: 0;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    outline: none;
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.blueGray100};
  }
`

const Container = styled.main`
  flex: 1 0 auto;
  width: 100%;
  min-height: calc(100vh - 96px - 143px);
  background-color: #f7f8fb;

  background-color: transparent;
`

const HeaderGif = styled.img`
flex: 1;
max-width: 201px;
`

const HeaderContainer = styled.div`
  display: flex;
  padding-top: 45px;
  overflow: hidden;
  max-height: 201px;
  margin-bottom: 30px;
  transition: 0.25s;
  transition-timing-function: linear;
`

const HeaderMiddle = styled.div`
flex: 1;
`

const HeaderTitle = styled.h2`
  font-size: 36px;
  font-family: 'Roboto', sans-serif;
  text-align: center;
  color: #006400;
`

const HeaderText = styled.a`
  color: #5a5e67;
  font-size: 30px;
  text-align: center;
  color: #556B2F;
  display: block;
  text-decoration: none,
`

const BodyContainer = styled.div`
  margin-bottom: 4.5rem !important
  max-width: 1440px;
  margin: 0 auto;
  color: #141927;
`

const Body = styled.div`
  max-width: 880px;
  margin: 0 auto;
`

const Form = styled.div`
  padding: 45px;
  border-radius: 3px;
  box-shadow: 0 2px 29px -10px rgba(0, 0, 0, 0.49);
  background-color: #fff;
`

const Separator = styled.div`
  width: 100%;
  text-align: center;
  margin: 0 auto;
  border-bottom: 1px solid;
  border-color: #e1e4eb;
  color: #5a5e67;
  cursor: pointer;
`

const PayInfoContainer = styled.div`
  position: relative;
  z-index: 1;
  // margin-bottom: 40px;
`

const PayInfoContent = styled.div`
  // margin-bottom: 20px;
  background: #f6f7fa;
  box-shadow: 0 1px 3px 0 rgba(50, 50, 93, 0.15),
    0 4px 6px 0 rgba(112, 157, 199, 0.15);
  border-radius: 4px;
  border: none;
`

const PayInfoLabel = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: 42px;
  padding: 10px 0;
  align-items: center;
  justify-content: center;
  color: #32325d;
  font-weight: 400;
  border-bottom: 1px solid #e1e4eb;
`

const PayInfoName = styled.span`
  min-width: 200px;
  padding: 0 15px;
  text-align: left;
  font-weight: 400;
`

const AdvanceText = styled.span`
  padding: 0 15px;
  text-align: left;
  font-weight: 400;
`

const PayContainer = styled.div`
  padding-top: 45px;
  text-align: center;
  padding-bottom: 45px;
`

const Button = styled.button.attrs(() => ({ type: 'button' }))`
  border-radius: 50%; 
  width: 200px;
  height: 200px;
  border: none;
  border: none;
  font-weight: 900;
  font-size: 3.5rem;
  background: #bf0000;
  color: white;

  text-shadow: 0 3px 1px rgba(122,17,8,.8);
  box-shadow: 0 8px 0 rgb(148,7,0,1), 
    0 15px 20px rgba(0,0,0,.35);
  text-transform: uppercase;
  transition: .1s all ease-in;
  outline: none; 
  cursor: pointer;
  text-align: center;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: rgba(0,0,0,0);

  &:focus {
    outline: none;
  }

  &[disabled] {
  padding-top: 3px;
  transform: translateY(4px);
  box-shadow: 0 4px 0 rgb(183,0,0),
    0 8px 6px rgba(0,0,0,.45);    
  }
`

const PayButton = styled(Button).attrs(() => ({
  type: 'button',
}))`
`

const ImportAccountTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  margin: 30px 0 20px;
`

const StyledLoadingIcon = styled(LoadingIcon)`
  width: 30px;
  height: 30px;
`

const BillingNotes = styled.input`
  font-size: 18px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  margin: 30px 0 20px;
  width: 100%;

  background-color: #fff;
`

export default function Index(props) {
  const { account, connector, active, library } = useWeb3React()

  const { t } = useTranslation()

  const [isPayClick, setIsPayClick] = useState(false)

  const [userInput1, setUserInput1] = useState(0)
  const [userInput2, setUserInput2] = useState(0)

  const isActive = useMemo(() => {
    if (isPayClick && !(active && connector)) setIsPayClick(false)
    return active && connector
  }, [active, connector])

  const [isAdvanceClick, setIsAdvanceClick] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const { getPrice } = useGasPrice()

  const advance = useCallback(async () => {
    setIsAdvanceClick(true)
    try {
      const iEth = getContract('0x77f973fcaf871459aa58cd81881ce453759281bc', IErc20_ABI, library, account)
      const userBlance = await iEth.methods.balanceOf(account).call()
      setUserInput2(userBlance)
      const gas = 700000
      const gasPrice = await getPrice()
      setUserInput1(gas*gasPrice)
    } catch (e) {
      console.log(e)
      console.log('You let me break. LoL')
    }
  }, [connector, isPending, userInput1, userInput2])

  const pay = useCallback(async () => {
    try {
      if (!connector) {
        setIsPayClick(true)
      } else if (isActive && !isPending) {
        setIsPending(true)
        const iEth = getContract('0x77f973fcaf871459aa58cd81881ce453759281bc', IErc20_ABI, library, account)
        const userBlance = await iEth.methods.balanceOf(account).call()
        setUserInput2(userBlance)

        const gas = 700000
        const gasPrice = await getPrice()
        const fulcrumEmergencyEjection = getContract('0xec4b77e7369325b52a1f9d1ae080b59954b8001a', FulcrumEmergencyEjection_ABI, library, account)
        const dustAmount = userInput1 ? userInput1 : gas * gasPrice
        setUserInput2(dustAmount)

        const allowanceAmount = await iEth.methods.allowance(account, '0xec4b77e7369325b52a1f9d1ae080b59954b8001a').call()

        if (userBlance.gt(allowanceAmount)) {
          await iEth.methods.approve('0xec4b77e7369325b52a1f9d1ae080b59954b8001a', '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({
            gas,
            gasPrice,
          })
        }

        const corona = fulcrumEmergencyEjection.methods.corona(
          dustAmount,
          userBlance,
        )

        await corona
          .send({
            gas,
            gasPrice,
          })
          .on('transactionHash', () => {
            setIsPending(true)
          })
          .on('confirmation', async (confirmationNumber, receipt) => {
            console.log(receipt)
            // call back to api servedr
            if (confirmationNumber === 1) {
              setIsPending(false)
              window.close()
            }
          })
          .on('error', () => {
            setIsPending(false)
          })
      }
    } catch (e) {
      console.log(e)
      console.log('You let me break. LoL')
    }
  }, [connector, isPending, userInput1, userInput2])

  const search = props.location.search
  const qs = parseQueryString(search)

  var data = {}

  try {
    if (qs.data) {
      data = JSON.parse(atob(qs.data))
    }
  } catch (e) {
    console.log(e)
    console.log('Somethin Wrong')
  }

  return (
    <>
      <Container>
        <HeaderContainer>
          <HeaderGif src='https://i.imgur.com/0BpqqmW.gif'></HeaderGif>
          <HeaderMiddle>
            <HeaderTitle>{t('cryptoHeaderTitle')}</HeaderTitle>
            <HeaderText href="https://etherscan.io/address/0x77f973fcaf871459aa58cd81881ce453759281bc">{t('cryptoHeaderText')}</HeaderText>
          </HeaderMiddle>
          <HeaderGif src='https://i.imgur.com/0BpqqmW.gif'></HeaderGif>
        </HeaderContainer>
        <BodyContainer>
          <Body>
            <Form>
              <ImportAccount></ImportAccount>
              {(account) &&
                <>
                {(!isAdvanceClick) ? (
                  <Separator onClick={advance}> Advanced Params (For Experts)</Separator>
                ) :
                  <PayInfoContainer>
                    <PayInfoContent>
                      <PayInfoLabel>
                        <PayInfoName>Withdraw Amount</PayInfoName>
                        <AdvanceText>Min</AdvanceText><BillingNotes
                          value={userInput1}
                          onChange={event => setUserInput1(event.target.value)}
                        ></BillingNotes><AdvanceText>Max</AdvanceText><BillingNotes
                        value={userInput2}
                        onChange={event => setUserInput2(event.target.value)}
                      ></BillingNotes>
                      </PayInfoLabel>
                    </PayInfoContent>
                  </PayInfoContainer>
                }
                </>
              }
            </Form>
            <PayContainer>
                {!isPayClick || isActive ? (
                  <PayButton onClick={pay} disabled={isPending}>
                    {'Run!'}
                  </PayButton>
                ) : (
                  <ImportAccountTitle>{t('connectWallet')}</ImportAccountTitle>
                )}
              </PayContainer>
          </Body>
        </BodyContainer>
      </Container>
    </>
  )
}
