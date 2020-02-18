// CheckoutForm.js
import React from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'
import styled from 'styled-components'
import { payBack } from '../utils'
import { ReactComponent as LoadingIcon } from '../assets/loading.svg'

const handleBlur = () => {
  console.log('[blur]')
}
const handleChange = change => {
  console.log('[change]', change)
}
const handleFocus = () => {
  console.log('[focus]')
}
const handleReady = () => {
  console.log('[ready]')
}

const Button = styled.button.attrs(() => ({ type: 'button' }))`
  width: 100%;
  height: 40px;
  margin: 20px 0;
  border: none;
  border-radius: 20px;
  padding: 0;
  background: linear-gradient(178deg, #ffb046 -66%, #f52880 371%) 0 0;
  color: ${({ theme }) => theme.colors.white};
  font-size: 13px;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fontFamilies.notoSans};
  letter-spacing: 1px;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &[disabled] {
    cursor: not-allowed;
    background: rgba(233, 213, 165, 0.8);
  }
`

const PayButton = styled(Button).attrs(() => ({
  type: 'button',
}))`
  width: 180px;
`

const CardElementContainer = styled.div`
  max-width: 400px;
  margin: 30px auto;
`

const StyledLoadingIcon = styled(LoadingIcon)`
  width: 30px;
  height: 30px;
`

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding,
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }
}

class CardForm extends React.Component {
  constructor() {
    super()
    this.state = {
      processing: false,
    }
  }

  handleSubmit = ev => {
    ev.preventDefault()
    if (this.props.stripe) {
      this.setState({ processing: true })
      this.props.stripe
        .createToken()
        .then(async token => {
          // Stripe returns cc token
          console.log('[token]', token)
          const amount =
            this.props.data.creditcard && this.props.data.creditcard.amount
              ? this.props.data.creditcard.amount
              : 0
          const currency =
            this.props.data.creditcard && this.props.data.creditcard.currency
              ? this.props.data.creditcard.currency
              : 0
          const payload = {
            token,
            uuid: this.props.data.uuid,
            amount,
            currency,
          }

          await payBack(this.props.data.creditcard.api, {
            uuid: this.props.data.uuid,
            userSelect: 'creditcard',
            creditcard: {
              token,
            },
          })
          console.log('[payload]', payload)
          window.close()
        })
        .catch(() => {
          this.setState({ processing: false })
        })
    } else {
      console.log("Stripe.js hasn't loaded yet.")
    }
  }

  render() {
    const { processing } = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Card details
          <CardElementContainer>
            <CardElement
              onBlur={handleBlur}
              onChange={handleChange}
              onFocus={handleFocus}
              onReady={handleReady}
              {...createOptions(14)}
            />
          </CardElementContainer>
        </label>
        <PayButton disabled={processing}>
          {processing ? <StyledLoadingIcon /> : 'Pay Now'}
        </PayButton>
      </form>
    )
  }
}

export default injectStripe(CardForm)
