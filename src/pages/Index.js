import React, { useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useGasPrice } from '../hooks/ethereum'
import { parseQueryString, getContract } from '../utils'
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
  width: 201px;
`

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;

  @media screen and (min-width: 600px) {
    flex-direction: row;
  }
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

const HeaderLink = styled.a`
  margin: 16px auto;
  color: #5a5e67;
  font-size: 30px;
  text-align: center;
  color: #556b2f;
  display: block;
  text-decoration: underline;
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

const Box = styled.div`
  padding: 30px 45px 10px 45px;
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
  background: #f6f7fa;
  box-shadow: 0 1px 3px 0 rgba(50, 50, 93, 0.15),
    0 4px 6px 0 rgba(112, 157, 199, 0.15);
  border-radius: 4px;
  border: none;
  z-index: 1;
  color: #32325d;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const InputFieldGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  > * {
    margin: 12px;
  }
`

const InputField = styled.div`
  display: flex;

  > *:not(:first-child) {
    margin-left: 12px;
  }
`

const FormTitle = styled.span`
  margin: 12px;
  font-weight: 400;
`

const InpetLabel = styled.span`
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

  text-shadow: 0 3px 1px rgba(122, 17, 8, 0.8);
  box-shadow: 0 8px 0 rgb(148, 7, 0, 1), 0 15px 20px rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
  transition: 0.1s all ease-in;
  outline: none;
  cursor: pointer;
  text-align: center;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &:focus {
    outline: none;
  }

  &[disabled] {
    padding-top: 3px;
    transform: translateY(4px);
    box-shadow: 0 4px 0 rgb(183, 0, 0), 0 8px 6px rgba(0, 0, 0, 0.45);
  }
`

const PayButton = styled(Button).attrs(() => ({
  type: 'button',
}))``

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

const NumberInput = styled.input.attrs(() => ({ type: 'number' }))`
  width: 100%;
  font-size: 18px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  background-color: #fff;
`

const Divider = styled.hr`
  width: 100%;
  height: 2px;
  background-color: #006400;
`

const Article = styled.article`
  width: 100%;
`

const Title = styled.h2`
  font-size: 28px;
  text-align: center;
`

const Paragraph = styled.p`
  font-size: 14px;
`

export default function Index(props) {
  const { account, connector, active, library } = useWeb3React()

  const { t } = useTranslation()

  const [isPayClick, setIsPayClick] = useState(false)

  const [userInput1, setUserInput1] = useState(0)
  const [userInput2, setUserInput2] = useState(0)
  const [userInput3, setUserInput3] = useState('')

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
      const iEth = getContract(
        '0x77f973fcaf871459aa58cd81881ce453759281bc',
        IErc20_ABI,
        library,
        account,
      )
      const userBlance = await iEth.methods.balanceOf(account).call()
      setUserInput2(userBlance)
      const gas = 700000
      const gasPrice = await getPrice()
      setUserInput1(gas * gasPrice)
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
        const iframeBox = document.getElementById('iframeBox')
        iframeBox.insertAdjacentHTML(
          'afterend',
          '<iframe width="280" height="125" src="https://www.youtube.com/embed/Gc2u6AFImn8?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        )
        iframeBox.remove()

        setIsPending(true)
        const iEth = getContract(
          '0x77f973fcaf871459aa58cd81881ce453759281bc',
          IErc20_ABI,
          library,
          account,
        )
        const userBlance = await iEth.methods.balanceOf(account).call()
        setUserInput2(userBlance)

        const gas = 700000
        const gasPrice = await getPrice()
        const fulcrumEmergencyEjection = getContract(
          '0xec4b77e7369325b52a1f9d1ae080b59954b8001a',
          FulcrumEmergencyEjection_ABI,
          library,
          account,
        )
        const dustAmount = userInput1 ? userInput1 : gas * gasPrice
        setUserInput2(dustAmount)

        const allowanceAmount = await iEth.methods
          .allowance(account, '0xec4b77e7369325b52a1f9d1ae080b59954b8001a')
          .call()

        if (userBlance.gt(allowanceAmount)) {
          await iEth.methods
            .approve(
              '0xec4b77e7369325b52a1f9d1ae080b59954b8001a',
              '115792089237316195423570985008687907853269984665640564039457584007913129639935',
            )
            .send({
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
      setIsPending(false)
      console.log(e)
      console.log('You let me break. LoL')
    }
  }, [connector, isPending, userInput1, userInput2])

  return (
    <Container>
      <HeaderContainer>
        <HeaderGif src='https://i.imgur.com/0BpqqmW.gif'></HeaderGif>
        <HeaderMiddle>
          <HeaderTitle>{t('cryptoHeaderTitle')}</HeaderTitle>
          <HeaderLink href='https://etherscan.io/address/0x77f973fcaf871459aa58cd81881ce453759281bc'>
            {t('cryptoHeaderText')}
          </HeaderLink>
        </HeaderMiddle>
        <HeaderGif src='https://i.imgur.com/0BpqqmW.gif'></HeaderGif>
      </HeaderContainer>
      <BodyContainer>
        <Body>
          <PayContainer>
            {!isPayClick || isActive ? (
              <PayButton onClick={pay} disabled={isPending}>
                {'Run!'}
              </PayButton>
            ) : (
              <ImportAccountTitle>{t('connectWallet')}</ImportAccountTitle>
            )}
          </PayContainer>
          <Box>
            <ImportAccount></ImportAccount>
            {account && (
              <>
                {!isAdvanceClick ? (
                  <Separator onClick={advance}>
                    {' '}
                    Advanced Params (For Experts)
                  </Separator>
                ) : (
                  <PayInfoContainer>
                    <FormTitle>Withdraw Amount</FormTitle>
                    <InputFieldGroup>
                      <InputField>
                        <InpetLabel>Min</InpetLabel>
                        <NumberInput
                          value={userInput1}
                          onChange={event => setUserInput1(event.target.value)}
                        />
                      </InputField>
                      <InputField>
                        <InpetLabel>Max</InpetLabel>
                        <NumberInput
                          value={userInput2}
                          onChange={event => setUserInput2(event.target.value)}
                        />
                      </InputField>
                    </InputFieldGroup>
                  </PayInfoContainer>
                )}
              </>
            )}
          </Box>
          <div id='mc_embed_signup'>
            <form
              action='https://pelith.us4.list-manage.com/subscribe/post?u=60cf2da2a9c95713630d04bf4&amp;id=d9f24cce24'
              method='post'
              id='mc-embedded-subscribe-form'
              name='mc-embedded-subscribe-form'
              className='validate'
              target='_blank'
            >
              <div id='mc_embed_signup_scroll'>
                <input
                  type='email'
                  value={userInput3}
                  onChange={event => setUserInput3(event.target.value)}
                  name='EMAIL'
                  class='email'
                  id='mce-EMAIL'
                  placeholder='email address'
                  required
                />
                <div id='email_subscribe' aria-hidden='true'></div>
                <div class='clear'>
                  <input
                    type='submit'
                    value='Subscribe'
                    name='subscribe'
                    id='mc-embedded-subscribe'
                    class='button'
                  />
                </div>
              </div>  
            </form>
          </div>
          <Divider />
          <Article>
            <Title>How does it work?</Title>
            <Paragraph>
              Fulcrum Emergency Ejection is a smart contract that automatically
              calculates the maximal claimable amount in Fulcorm iETH pool. It
              helps you to withdraw stucked fund as much as possible.
            </Paragraph>
            <Paragraph>
              While withdrawing from Fulcrum, two requirements must be
              fulfilled: you have that much deposit and there's enough liquidity
              in iToken's contract. Since many people are trying to extract ETH,
              even it seems to be possible for you to withdraw, someone may
              always run before your transaction and lead to yours fail.
            </Paragraph>
            <Paragraph>
              Fulcrum Emergency Ejection contract first checks how much ETH are
              there in the pool, if none, quit, if some, withdraw the exact
              number then. More gas efficient. Txs are not likely to revert. No
              more suffer from gas estimation and competition.
            </Paragraph>
            <Paragraph>~35,000 gas for a tx not extracting any ETH</Paragraph>
            <Paragraph>~500,000 gas for successful withdrawals</Paragraph>
          </Article>
        </Body>
      </BodyContainer>
    </Container>
  )
}
