import React, { Suspense } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'
import styled from 'styled-components'

import AppLoader from './components/AppLoader'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ThemeProvider, { GlobalStyle } from './themes'

function getLibrary(provider) {
  return new Web3(provider)
}

const AppLayout = styled.div`
  width: 100vw;
`

function Router() {
  return (
    <Suspense fallback={null}>
      <AppLoader>
        <BrowserRouter>
          <AppLayout>
            <Header />
            <Switch>
              <Route exact path='/' component={Home} />
            </Switch>
          </AppLayout>
        </BrowserRouter>
      </AppLoader>
    </Suspense>
  )
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider>
        <GlobalStyle />
        <Router />
      </ThemeProvider>
    </Web3ReactProvider>
  )
}

export default App
