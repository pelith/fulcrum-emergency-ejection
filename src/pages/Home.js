import React, { useCallback, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { useGasPrice } from '../hooks/ethereum'
import { getContract } from '../utils'

import FulcrumEmergencyEjection_ABI from '../constants/abis/fulcrumEmergencyEjection.json'
import IErc20_ABI from '../constants/abis/iToken.json'
import styled from 'styled-components'
import ImportAccount from '../components/ImportAccount'

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
  display: flex;
  flex-direction: column;
  align-items: center;
`

const HeaderTitle = styled.h2`
  font-size: 36px;
  font-family: 'Roboto', sans-serif;
  text-align: center;
  color: #006400;
`

const HeaderTitleContainer = styled.div`
  display: flex;
`

const LanguageSelectWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.blueGray50};
  margin: auto;
  margin-left: 10px;
  margin-right: 10px;
`

const LanguageSelect = styled.select`
  background-color: transparent;
  font-size: 36px;
  font-family: 'Roboto', sans-serif;
  text-align: center;
  color: #006400;
  width: 100%;

  cursor: pointer;
  -webkit-appearance: none;

  &:focus {
    outline: none;
  }
`

const HeaderLink = styled.a`
  margin: 16px auto;
  color: #5a5e67;
  font-size: 30px;
  text-align: center;
  color: #556b2f;
  display: inline-block;
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

const RunButtonWrapper = styled.div`
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

const RunButton = styled(Button).attrs(() => ({
  type: 'button',
}))``

const ConnectWalletMessage = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  margin: 30px 0 20px;
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
  margin: 24px 0;
  background-color: #006400;
`

const SubscribeForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
`

const TextInput = styled.input``

const SubscribeButton = styled.button`
  font-size: 14px;
  font-weight: 500;
  border: none;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  letter-spacing: 0.03em;
  color: #fff;
  background-color: #450000;
  box-sizing: border-box;
  height: 32px;
  line-height: 32px;
  padding: 0 18px;
  display: inline-block;
  margin: 0;
  transition: all 0.23s;

  &:hover {
    background-color: #aa0000;
    cursor: pointer;
  }
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

const BlackBox = styled.div`
  width: 280px;
  height: 125px;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function Index(props) {
  const { t } = useTranslation()
  const { account, active, library } = useWeb3React()

  const [token, setToken] = useState('eth')

  const bond = {
    eth: '0x77f973fcaf871459aa58cd81881ce453759281bc',
    usdc: '0xF013406A0B1d544238083DF0B93ad0d2cBE0f65f',
  }

  const contract = {
    eth: '0xec4b77e7369325b52a1f9d1ae080b59954b8001a',
    usdc: '0xb54f0b588a9f2dbe44459ae1fec37d62e50dee41',
  }

  const [amountMin, setAmountMin] = useState(0)
  const [amountMax, setAmountMax] = useState(0)
  const [email, setEmail] = useState('')
  const [isPlay, setIsPlay] = useState(false)

  const [isShowConnectMessage, setIsShowConnectMessage] = useState(false)
  useEffect(() => {
    if (active) {
      setIsShowConnectMessage(false)
    }
  }, [active])

  const [isAdvanceClick, setIsAdvanceClick] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const { getPrice } = useGasPrice()

  const advance = useCallback(async () => {
    setIsAdvanceClick(true)
    try {
      const iToken = getContract(bond[token], IErc20_ABI, library, account)
      const userBlance = await iToken.methods.balanceOf(account).call()
      setAmountMax(userBlance)

      const gas = 700000
      const gasPrice = await getPrice()
      setAmountMin(gas * gasPrice)
    } catch (e) {
      console.log(e)
    }
  }, [library, account, getPrice])

  const run = useCallback(async () => {
    if (!active) {
      setIsShowConnectMessage(true)
      return
    }
    if (isPending) {
      return
    }

    // play happy youtube video
    setIsPlay(false)
    setTimeout(() => {
      setIsPlay(true)
    }, 300)

    try {
      setIsPending(true)
      const iToken = getContract(bond[token], IErc20_ABI, library, account)
      const userBlance = await iToken.methods.balanceOf(account).call()
      setAmountMax(userBlance)

      const gas = 700000
      const gasPrice = await getPrice()
      const fulcrumEmergencyEjection = getContract(
        contract[token],
        FulcrumEmergencyEjection_ABI,
        library,
        account,
      )
      const dustAmount = amountMin ? amountMin : gas * gasPrice
      setAmountMax(dustAmount)

      const allowanceAmount = await iToken.methods
        .allowance(account, contract[token])
        .call()

      if (userBlance.gt(allowanceAmount)) {
        await iToken.methods
          .approve(
            contract[token],
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
    } catch (e) {
      console.log(e)
      setIsPending(false)
    }
  }, [active, isPending, library, account, getPrice, amountMin])

  const onSelectToken = event => {
    setToken(event.target.value)
  }

  return (
    <Container>
      <HeaderContainer>
        <HeaderGif src='https://i.imgur.com/0BpqqmW.gif' />
        <HeaderMiddle>
          <HeaderTitleContainer>
            <HeaderTitle>{t('HeaderTitle1')}</HeaderTitle>
            <LanguageSelectWrapper>
              <LanguageSelect value={token} onChange={onSelectToken}>
                <option value='eth'>ETH</option>
                <option value='usdc'>USDC</option>
              </LanguageSelect>
            </LanguageSelectWrapper>
            <HeaderTitle>{t('HeaderTitle2')}</HeaderTitle>
          </HeaderTitleContainer>
          <HeaderLink
            href={'https://etherscan.io/address/' + bond[token]}
            target='_blank'
          >
            {t('cryptoHeaderText')}
          </HeaderLink>
        </HeaderMiddle>
        <HeaderGif src='https://i.imgur.com/0BpqqmW.gif' />
      </HeaderContainer>
      <BodyContainer>
        <Body>
          <RunButtonWrapper>
            {isShowConnectMessage ? (
              <ConnectWalletMessage>{t('connectWallet')}</ConnectWalletMessage>
            ) : (
              <RunButton onClick={run} disabled={isPending}>
                Run!
              </RunButton>
            )}
          </RunButtonWrapper>
          <Box>
            <ImportAccount
              token={token}
              videoChild={
                isPlay ? (
                  <iframe
                    title='happy video'
                    width='280'
                    height='125'
                    src='https://www.youtube.com/embed/Gc2u6AFImn8?autoplay=1'
                    frameborder='0'
                    allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                    allowfullscreen
                  />
                ) : (
                  <BlackBox id='iframeBox' />
                )
              }
            />
            {account && (
              <>
                {!isAdvanceClick ? (
                  <Separator onClick={advance}>
                    Advanced Params (For Experts)
                  </Separator>
                ) : (
                  <PayInfoContainer>
                    <FormTitle>Withdraw Amount</FormTitle>
                    <InputFieldGroup>
                      <InputField>
                        <InpetLabel>Min</InpetLabel>
                        <NumberInput
                          value={amountMin}
                          onChange={event => setAmountMin(event.target.value)}
                        />
                      </InputField>
                      <InputField>
                        <InpetLabel>Max</InpetLabel>
                        <NumberInput
                          value={amountMax}
                          onChange={event => setAmountMax(event.target.value)}
                        />
                      </InputField>
                    </InputFieldGroup>
                  </PayInfoContainer>
                )}
              </>
            )}
          </Box>
          <Divider />
          <Title>Subscribe Now for more DeFi products and tools</Title>
          <div id='mc_embed_signup'>
            <SubscribeForm
              action='https://pelith.us4.list-manage.com/subscribe/post?u=60cf2da2a9c95713630d04bf4&amp;id=d9f24cce24'
              method='post'
              id='mc-embedded-subscribe-form'
              name='mc-embedded-subscribe-form'
              className='validate'
              target='_blank'
            >
              <TextInput
                type='email'
                value={email}
                onChange={event => setEmail(event.target.value)}
                name='EMAIL'
                className='email'
                id='mce-EMAIL'
                placeholder='email address'
                required
              />
              <SubscribeButton name='subscribe' id='mc-embedded-subscribe'>
                Subscribe
              </SubscribeButton>
            </SubscribeForm>
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
