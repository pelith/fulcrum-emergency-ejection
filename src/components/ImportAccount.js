import React, { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { getContract } from '../utils'

import IErc20_ABI from '../constants/abis/iErc20.json'
import Erc20_ABI from '../constants/abis/erc20.json'

import {
  injected as injectedConnector,
  walletconnect as walletconnectConnector,
  fortmatic as fortmaticConnector,
  torus as torusConnector,
  portis as portisConnector,
} from '../connectors'

const ImportAccountContainer = styled.div`
  padding: 0 15 px;
  margin: 0 auto;
  padding: 0 1rem 20px;
  padding-left: 0px;
  padding-right: 0px;
`

const ImportAccountBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > * {
    margin: 12px;
  }

  ${({ theme }) => theme.mediaQuery.md`
    flex-direction: row;
    justify-content: space-between;
  `}
`

const ValueBox = styled.div`
  display: flex;
  flex-direction: column;
`

const ImportAccountTitle = styled.div`
  font-family: Hack, monospace;
  font-size: 18px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
`

const ImportAccountValue = styled.div`
  font-family: Hack, monospace;
  font-size: 18px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
`

const Text = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  margin: 30px 0 20px;
`

const ImportAccountContent = styled.div`
  font-family: Hack, monospace;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1550px;
  margin: 0 auto;
  -webkit-animation-name: slideInUp;
  animation-name: slideInUp;
  animation-duration: 0.3s;
  animation-timing-function: ease-out;
`

const ImportAccountItem = styled.div`
  width: 120px;
  margin: 0 0 12px;

  &.large {
    width: 160px;
  }
`

const ImportAccountButton = styled.div`
  height: 100%;
  display: flex;
  position: relative;
  padding: 6px 10px;
  align-items: center;
  justify-content: center;
  transition: all 0.4s;
  outline: none;
  border: 1px solid;
  border-radius: 3px;
  cursor: pointer;

  border-color: #f6f7fa;
  background-color: #f6f7fa;
  color: #5a5e67;

  &:hover {
    background-color: transparent;
  }

  &:hover .ItemButtonIcon.Metamask {
    background-position: -31px 0;
  }

  &:hover .ItemButtonIcon.Fortmatic {
    background-position: -31px 0;
  }

  &:hover .ItemButtonIcon.Torus {
    background-position: -31px 0;
  }

  &:hover .ItemButtonIcon.Portis {
    background-position: -31px 0;
  }

  &:hover .ItemButtonIcon.WalletConnect {
    background-position: -31px 5px;
  }

  &:hover .ItemButtonName.Metamask {
    color: #ff9008;
  }

  &:hover .ItemButtonName.Fortmatic {
    color: #617bff;
  }

  &:hover .ItemButtonName.Torus {
    color: #3996ff;
  }

  &:hover .ItemButtonName.Portis {
    color: #3996ff;
  }

  &:hover .ItemButtonName.WalletConnect {
    color: #3d9cf8;
  }
`

const ItemButtonIcon = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 7px;
  background: 0 0 no-repeat;
  &.Metamask {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MiIgaGVpZ2h0PSIxOSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNLTEtMWgyMnYyMkgtMXoiLz48cGF0aCBmaWxsPSIjOTI5NDk4IiBkPSJNMTkuMjE0LjA0bC03Ljg4OCA1LjkyN0wxMi43OSAyLjQ3ek0xLjAyMi4wNGw3LjgxNyA1Ljk4M0w3LjQ0NSAyLjQ3eiIvPjxwYXRoIGZpbGw9IiM5MTkzOTciIGQ9Ik0xNi4zNzkgMTMuNzc5bC0yLjA5OSAzLjI1NiA0LjQ5IDEuMjUxIDEuMjg0LTQuNDM1ek0uMTkgMTMuODUxbDEuMjc1IDQuNDM1IDQuNDktMS4yNS0yLjA5LTMuMjU3eiIvPjxwYXRoIGZpbGw9IiM5Mjk0OTgiIGQ9Ik01LjcxIDguMjc3bC0xLjI1IDEuOTE3IDQuNDUxLjItLjE1LTQuODUyem04LjgxNSAwTDExLjQzIDUuNDg2bC0uMTAzIDQuOTA4IDQuNDUtLjJ6bS04LjU2OSA4Ljc1OGwyLjY4NS0xLjMyMy0yLjMxMy0xLjgyOXptNS42MzktMS4zMjNsMi42ODUgMS4zMjMtLjM3Mi0zLjE1MnoiLz48cGF0aCBkPSJNMTQuMjggMTcuMDM1bC0yLjY4NS0xLjMyMy4yMTQgMS43NzItLjAyNC43NDZ6bS04LjMyNCAwTDguNDUgMTguMjNsLS4wMTYtLjc0Ni4yMDYtMS43NzJ6IiBmaWxsPSIjQ0NDRUQyIi8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTguNDk4IDEyLjcxMmwtMi4yMzMtLjY2NSAxLjU3Ni0uNzN6bTMuMjQgMGwuNjU3LTEuMzk1IDEuNTg0LjczeiIvPjxwYXRoIGQ9Ik01Ljk1NiAxNy4wMzVsLjM4OC0zLjI1Ni0yLjQ3OS4wNzJ6bTcuOTM2LTMuMjU2bC4zODggMy4yNTYgMi4wOTktMy4xODR6bTEuODg1LTMuNTg1bC00LjQ1MS4yLjQxMiAyLjMxOC42NTctMS4zOTUgMS41ODQuNzN6bS05LjUxMiAxLjg1M2wxLjU3Ni0uNzMuNjU3IDEuMzk1LjQxMi0yLjMxOC00LjQ1MS0uMnoiIGZpbGw9IiM3RjgxODUiLz48cGF0aCBmaWxsPSIjOTE5Mzk3IiBkPSJNNC40NTkgMTAuMTk0bDEuODcgMy42OS0uMDY0LTEuODM3em05LjUyIDEuODUzbC0uMDcxIDEuODM2IDEuODY5LTMuNjl6Ii8+PHBhdGggZmlsbD0iIzkwOTI5NiIgZD0iTTguOTEgMTAuMzk0bC0uNDEyIDIuMzE4LjUyMyAyLjczNS4xMS0zLjZ6bTIuNDE2IDBsLS4yMTQgMS40NDQuMTAzIDMuNjEuNTIzLTIuNzM2eiIvPjxwYXRoIGZpbGw9IiM5RDlGQTMiIGQ9Ik0xMS43MzggMTIuNzEybC0uNTIzIDIuNzM1LjM4LjI2NSAyLjMxMy0xLjgyOS4wNzEtMS44MzZ6bS01LjQ3My0uNjY1bC4wNjMgMS44MzYgMi4zMTMgMS44MjkuMzgtLjI2NS0uNTIzLTIuNzM1eiIvPjxwYXRoIGZpbGw9IiNCOUJCQkYiIGQ9Ik0xMS43ODUgMTguMjNsLjAyNC0uNzQ2LS4xOTgtLjE3Nkg4LjYyNWwtLjE5LjE3Ni4wMTYuNzQ2LTIuNDk1LTEuMTk1Ljg3MS43MjJMOC42MDEgMTloMy4wMzRsMS43NzQtMS4yNDMuODcxLS43MjJ6Ii8+PHBhdGggZmlsbD0iIzQ2NDY0NiIgZD0iTTExLjU5NSAxNS43MTJsLS4zOC0uMjY1SDkuMDJsLS4zOC4yNjUtLjIwNiAxLjc3Mi4xOS0uMTc2aDIuOTg2bC4xOTguMTc2eiIvPjxwYXRoIGQ9Ik0xOS41NDcgNi4zNTJsLjY2NS0zLjI3Mi0uOTk4LTMuMDQtNy42MTkgNS43MjcgMi45MyAyLjUxIDQuMTQzIDEuMjI3LjkxLTEuMDgzLS4zOTUtLjI4OC42MzMtLjU4Ni0uNDgzLS4zODUuNjM0LS40OXpNLjAyNCAzLjA4bC42NzMgMy4yNzItLjQyOC4zMi42MzQuNDktLjQ4My4zODUuNjMzLjU4Ni0uMzk2LjI4OC45MTEgMS4wODNMNS43MSA4LjI3N2wyLjkzLTIuNTFMMS4wMjMuMDR6IiBmaWxsPSIjNTA1MjU2Ii8+PHBhdGggZmlsbD0iIzlEOUZBMyIgZD0iTTE4LjY2OCA5LjUwNGwtNC4xNDMtMS4yMjcgMS4yNTIgMS45MTctMS44NyAzLjY5IDIuNDcyLS4wMzNoMy42NzV6TTUuNzEgOC4yNzdMMS41NjggOS41MDQuMTkgMTMuODUxaDMuNjc1bDIuNDYzLjAzMi0xLjg2OS0zLjY5eiIvPjxwYXRoIGZpbGw9IiM5RUEwQTQiIGQ9Ik0xMS4zMjYgMTAuMzk0bC4yNjktNC42MjcgMS4xOTYtMy4yOTdINy40NDVMOC42NCA1Ljc2N2wuMjcgNC42MjcuMTAyIDEuNDYuMDA4IDMuNTkzaDIuMTk0bC4wMDgtMy41OTN6Ii8+PHBhdGggZmlsbD0iI0Y3N0IwMCIgZD0iTTUwLjI5OC4wNGwtNy45MjMgNS45MjUgMS40NzItMy40OTZ6bS0xOC4yNzIgMGw3Ljg1MSA1Ljk4LTEuNC0zLjU1eiIvPjxwYXRoIGZpbGw9IiNGODdCMDAiIGQ9Ik00Ny40NSAxMy43NzNsLTIuMTA4IDMuMjU1IDQuNTEgMS4yNSAxLjI4OS00LjQzM3ptLTE2LjI2LjA3MmwxLjI4MiA0LjQzMyA0LjUxLTEuMjUtMi4xLTMuMjU1eiIvPjxwYXRoIGZpbGw9IiNGNzdEMDAiIGQ9Ik0zNi43MzUgOC4yNzNsLTEuMjU3IDEuOTE2IDQuNDcuMi0uMTUtNC44NXptOC44NTQgMGwtMy4xMS0yLjc5LS4xMDQgNC45MDcgNC40Ny0uMnoiLz48cGF0aCBmaWxsPSIjRjc3QjAwIiBkPSJNMzYuOTgyIDE3LjAyOGwyLjY5Ni0xLjMyMy0yLjMyMi0xLjgyOHptNS42NjMtMS4zMjNsMi42OTcgMS4zMjMtLjM3NC0zLjE1eiIvPjxwYXRoIGQ9Ik00NS4zNDIgMTcuMDI4bC0yLjY5Ny0xLjMyMy4yMTUgMS43NzItLjAyNC43NDV6bS04LjM2IDBsMi41MDUgMS4xOTQtLjAxNS0uNzQ1LjIwNi0xLjc3MnoiIGZpbGw9IiNERkM3QkEiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMzkuNTM1IDEyLjcwN2wtMi4yNDMtLjY2NiAxLjU4My0uNzN6bTMuMjU0IDBsLjY2LTEuMzk1IDEuNTkuNzN6Ii8+PHBhdGggZmlsbD0iI0UzNjcwMCIgZD0iTTM2Ljk4MiAxNy4wMjhsLjM5LTMuMjU1LTIuNDkuMDcyem03Ljk3LTMuMjU1bC4zOSAzLjI1NSAyLjEwOC0zLjE4M3oiLz48cGF0aCBmaWxsPSIjRTI2NjAwIiBkPSJNNDYuODQ1IDEwLjE5bC00LjQ3LjIuNDE0IDIuMzE3LjY2LTEuMzk1IDEuNTkuNzN6bS05LjU1MyAxLjg1MWwxLjU4My0uNzMuNjYgMS4zOTYuNDE0LTIuMzE3LTQuNDctLjJ6Ii8+PHBhdGggZD0iTTM1LjQ3OCAxMC4xOWwxLjg3OCAzLjY4Ny0uMDY0LTEuODM2em05LjU2MiAxLjg1MWwtLjA3MiAxLjgzNiAxLjg3Ny0zLjY4OHptLTUuMDkxLTEuNjUxbC0uNDE0IDIuMzE3LjUyNSAyLjczNC4xMTItMy42em0yLjQyNiAwbC0uMjE1IDEuNDQzLjEwNCAzLjYwOC41MjUtMi43MzR6IiBmaWxsPSIjRjg3QjAwIi8+PHBhdGggZmlsbD0iI0ZGOEMwMCIgZD0iTTQyLjc4OSAxMi43MDdsLS41MjUgMi43MzQuMzgxLjI2NCAyLjMyMy0xLjgyOC4wNzItMS44MzZ6bS01LjQ5Ny0uNjY2bC4wNjQgMS44MzYgMi4zMjIgMS44MjguMzgyLS4yNjQtLjUyNS0yLjczNHoiLz48cGF0aCBmaWxsPSIjQ0RCNUE3IiBkPSJNNDIuODM2IDE4LjIyMmwuMDI0LS43NDUtLjE5OS0uMTc3aC0yLjk5OGwtLjE5MS4xNzcuMDE2Ljc0NS0yLjUwNi0xLjE5NC44NzUuNzIxIDEuNzgyIDEuMjQzaDMuMDQ2bDEuNzgyLTEuMjQzLjg3NS0uNzIxeiIvPjxwYXRoIGZpbGw9IiMxODE4MTgiIGQ9Ik00Mi42NDUgMTUuNzA1bC0uMzgxLS4yNjRINDAuMDZsLS4zODIuMjY0LS4yMDYgMS43NzIuMTktLjE3N2gzbC4xOTguMTc3eiIvPjxwYXRoIGQ9Ik01MC42MzIgNi4zNWwuNjY4LTMuMjcyTDUwLjI5OC4wNGwtNy42NTMgNS43MjQgMi45NDQgMi41MSA0LjE2IDEuMjI2LjkxNS0xLjA4Mi0uMzk4LS4yODkuNjM2LS41ODUtLjQ4NS0uMzg1LjYzNi0uNDg5ek0zMS4wMjQgMy4wNzhMMzEuNyA2LjM1bC0uNDMuMzIxLjYzNy40OS0uNDg1LjM4NC42MzYuNTg1LS4zOTguMjg5LjkxNSAxLjA4MiA0LjE2LTEuMjI3IDIuOTQzLTIuNTA5TDMyLjAyNi4wNHoiIGZpbGw9IiM4QjQ0MDIiLz48cGF0aCBmaWxsPSIjRkY4RDAwIiBkPSJNNDkuNzQ5IDkuNWwtNC4xNi0xLjIyNyAxLjI1NiAxLjkxNi0xLjg3NyAzLjY4OCAyLjQ4Mi0uMDMyaDMuNjl6TTM2LjczNSA4LjI3M0wzMi41NzUgOS41bC0xLjM4NCA0LjM0NWgzLjY5bDIuNDc1LjAzMi0xLjg3OC0zLjY4OHoiLz48cGF0aCBmaWxsPSIjRkY4QzAwIiBkPSJNNDIuMzc1IDEwLjM5bC4yNy00LjYyNiAxLjIwMi0zLjI5NWgtNS4zN2wxLjIwMSAzLjI5NS4yNyA0LjYyNi4xMDQgMS40NTkuMDA4IDMuNTkyaDIuMjA0bC4wMDgtMy41OTJ6Ii8+PC9nPjwvc3ZnPg==);
  }

  &.Fortmatic {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MiIgaGVpZ2h0PSIxOSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjOTI5NDk4IiBkPSJtMTQuMjU1NDg0LDBsLTQuNzM4NDk5LDBsLTQuNzU4NDkyLDBsLTQuNzU4NDkzLDBsMCw0LjcxNjY5NGwwLDQuNzE2Njk0bDAsMC4yOTcyNzFsMCw0LjM3OTc4OGwwLDAuMDE5ODE4bDAsNC42NzcwNThsNC43NTg0OTMsMGwwLC00LjY1NzI0bDAsLTAuMDE5ODE4bDAsLTQuMzc5Nzg4bDAsLTAuMjk3MjcxbDAsLTQuNzE2Njk0bDQuNzU4NDkyLDBsNC43NTg0OTMsMGw0Ljc1ODQ5MywwbDAsLTQuNzE2Njk0bC00Ljc3ODQ4NywwbDAsLTAuMDE5ODE4eiIvPjxwYXRoIGZpbGw9IiM5Mjk0OTgiIGQ9Im0xMCwxNC40MzEyMjNsNC40MzEyMjQsMGwwLDQuNDY4Nzc3bDAuMTY4OTg3LDBjMS4xNDUzNTksMCAyLjIzNDM4OCwtMC40NTA2MzMgMy4wNDE3NzMsLTEuMjU4MDE3YzAuODA3Mzg0LC0wLjgwNzM4NCAxLjI1ODAxNywtMS44OTY0MTQgMS4yNTgwMTcsLTMuMDQxNzczbDAsLTQuNjAwMjEybC04LjkwMDAwMSwwbDAsNC40MzEyMjR6Ii8+PHBhdGggZmlsbD0iIzYxN0JGRiIgZD0ibTQ1LjI1NTQ4NCwwbC00LjczODQ5OSwwbC00Ljc1ODQ5MiwwbC00Ljc1ODQ5MywwbDAsNC43MTY2OTRsMCw0LjcxNjY5NGwwLDAuMjk3MjcxbDAsNC4zNzk3ODhsMCwwLjAxOTgxOGwwLDQuNjc3MDU4bDQuNzU4NDkzLDBsMCwtNC42NTcyNGwwLC0wLjAxOTgxOGwwLC00LjM3OTc4OGwwLC0wLjI5NzI3MWwwLC00LjcxNjY5NGw0Ljc1ODQ5MiwwbDQuNzU4NDkzLDBsNC43NTg0OTMsMGwwLC00LjcxNjY5NGwtNC43Nzg0ODcsMGwwLC0wLjAxOTgxOHoiLz48cGF0aCBmaWxsPSIjNjE3QkZGIiBkPSJtNDEsMTQuNDMxMjIzbDQuNDMxMjI0LDBsMCw0LjQ2ODc3N2wwLjE2ODk4OCwwYzEuMTQ1MzU4LDAgMi4yMzQzODgsLTAuNDUwNjMzIDMuMDQxNzcyLC0xLjI1ODAxN2MwLjgwNzM4NCwtMC44MDczODQgMS4yNTgwMTcsLTEuODk2NDE0IDEuMjU4MDE3LC0zLjA0MTc3MmwwLC00LjYwMDIxMmwtOC45MDAwMDEsMGwwLDQuNDMxMjI0eiIvPjwvZz48L3N2Zz4=);
  }

  &.Torus {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MiIgaGVpZ2h0PSIxOSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cmVjdCBoZWlnaHQ9IjUuODA1NTYiIHdpZHRoPSIxMCIgZmlsbD0iIzkyOTQ5OCIvPjxyZWN0IGhlaWdodD0iMTkiIHdpZHRoPSI2IiB5PSIwLjAzIiB4PSI1IiBmaWxsPSIjOTI5NDk4Ii8+PGNpcmNsZSByPSIzIiBjeT0iMyIgY3g9IjE1IiBmaWxsPSIjOTI5NDk4Ii8+PHJlY3QgeD0iMzEiIGhlaWdodD0iNS44MDU1NiIgd2lkdGg9IjEwIiBmaWxsPSIjMzk5NmZmIi8+PHJlY3QgaGVpZ2h0PSIxOSIgd2lkdGg9IjYiIHk9IjAuMDMiIHg9IjM2IiBmaWxsPSIjMzk5NmZmIi8+PGNpcmNsZSByPSIzIiBjeT0iMyIgY3g9IjQ2IiBmaWxsPSIjMzk5NmZmIi8+PC9nPjwvc3ZnPg==);
  }

  &.Portis {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTIiIGhlaWdodD0iMTkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cG9seWdvbiBmaWxsPSIjMkMyQzJDIiBwb2ludHM9IjAuMTgyNzQ4MzQ5Mjg5MDAzOCwxMC43NjY5NzA4NjY5OTU1MDcgMC42MzE3MzE2MjM0NzczMzk5LDEwLjU3MTg1MTQxNDIxMDg2OSA2LjE5MDAwNDc1MzQ1NTQ4Nyw4LjE1NTYzOTUxNTgyNDUzMiAxMi4xOTcyNjE5NjM2NjAzODUsMTAuNzY2OTcwODY2OTk1NTA3IDkuOTQwMDIxNTIzODk4ODY3LDE1LjQyNjQ1ODM2MTQ4NDk0NyA0LjQyMjAwNDkzMzE3MTE1NywxNi4yMDY5NDEwMzkyNzA1MzIgMC4yNzMxMjAxNDQ0NzI5MTY1LDExLjcyOTQzMTEwMzkyMDQzMyAwLjE4Mjc0ODM0OTI4OTAwMzgsMTAuNzY2OTcwODY2OTk1NTA3Ii8+PHBvbHlnb24gZmlsbD0iIzM5MzkzOSIgIHBvaW50cz0iNi4xOTAwMDQ3NTM0NTU0ODcsNi45MzYwMzE0ODk3MDM1MSA2LjE5MDAwNDc1MzQ1NTQ4NywxMi45NTUyMDEyNzg1MTM0MTQgMTEuOTQ2Mjc0Mzc2Mjc3NDMzLDkuNTUwMjQwMDAyNTk5ODIxIDYuMTkwMDA0NzUzNDU1NDg3LDYuOTM2MDMxNDg5NzAzNTEiLz48cG9seWdvbiBmaWxsPSIjNjc2NzY3IiBwb2ludHM9IjYuMTkwMDA0NzUzNDU1NDg3LDAgNi4xOTAwMDQ3NTM0NTU0ODcsNi45MzYwMzE0ODk3MDM1MSAxMS45NDYyNzQzNzYyNzc0MzMsOS41NTAyNDAwMDI1OTk4MjEgNi4xOTAwMDQ3NTM0NTU0ODcsMCIvPjxwb2x5Z29uIGZpbGw9IiM1MjUyNTIiIHBvaW50cz0iNi4xOTAwMDQ3NTM0NTU0ODcsNi45MzYwMzE0ODk3MDM1MSA2LjE5MDAwNDc1MzQ1NTQ4NywxMi45NTUyMDEyNzg1MTM0MTQgNS4zNjg0NDMxOTQ3MzcyMjksMTIuNDY5MjQ2MTMyNDQ3NTUyIDAuNDQxMTI5NDIyODg0Mzc3MSw5LjU1NDc1OTE3MTAzMzc2NiAwLjQzMzczNTQwNDM4MjQzNjEzLDkuNTUwMjQwMDAyNTk5ODIxIDAuNDQ0ODI2NDAxNzE4ODAzNjcsOS41NDUzMTAwODkxNTYzNzQgNS4zNjg0NDMxOTQ3MzcyMjksNy4zMDkwMjA1NjQ4Njc3NTEgNi4xOTAwMDQ3NTM0NTU0ODcsNi45MzYwMzE0ODk3MDM1MSIvPjxwb2x5Z29uIGZpbGw9IiM5RjlGOUYiIHBvaW50cz0iNi4xOTAwMDQ3NTM0NTU0ODcsMCA2LjE5MDAwNDc1MzQ1NTQ4Nyw2LjkzNjAzMTQ4OTcwMzUxIDAuNDMzNzM1NDA0MzgyNDM2MTMsOS41NTAyNDAwMDI1OTk4MjEgNi4xOTAwMDQ3NTM0NTU0ODcsMCIvPjxwYXRoIGZpbGw9IiM5RjlGOUYiIGQ9Im0wLjE4Mjc0OCwxMC43NjY5NzJsNi4wMDcyNTcsMy41NTM2NjRhNi44Nzk3NTUsNi44Nzk3NTUgMCAwIDEgLTAuNDMwMDg3LDEuNTc2NTc2Yy0wLjQ4MDYxMywxLjE2MTY4OCAtMS40NTE2OTksMi4zOTAzMzMgLTMuMzMwNjEsMS40NTU4MDdsMCwwYy0xLjQ3NzE2NywtMS4yMDkzMzggLTIuNDI5MzU3LC0zLjA4NDk2MyAtMi40MjkzNTcsLTUuMDg4NzUxYTYuMTgxODM4LDYuMTgxODM4IDAgMCAxIDAuMTgyNzk3LC0xLjQ5NzI5NnoiLz48cGF0aCBmaWxsPSIjODk4OTg5IiBkPSJtOS45NTA3MDIsMTcuMzUxNzg3bC0wLjAxNDc4OCwwLjAxMTkxM2MtMC4wMzEyMTksMC4wMjU0NjggLTAuMDYyNDM5LDAuMDUwNTI2IC0wLjA5NDA2OSwwLjA3NTE3M2wtMC4wMDgyMTYsMC4wMDY1NzNxLTAuMDUxMzQ3LDAuMDQxMDc4IC0wLjEwMzUxNywwLjA3ODg3Yy0wLjAzNzM4MSwwLjAyNzkzMyAtMC4wNzUxNzMsMC4wNTU4NjYgLTAuMTEzMzc1LDAuMDgyMTU2cy0wLjA3NjQwNSwwLjA1MzgxMiAtMC4xMTUwMTksMC4wODAxMDJzLTAuMDY4MTg5LDAuMDQ2MDA3IC0wLjEwMjI4NCwwLjA2ODE4OWwtMC4wMTg4OTYsMC4wMTIzMjNjLTAuMDM2MTQ5LDAuMDIzNDE1IC0wLjA3MjI5NywwLjA0NjQxOCAtMC4xMDg0NDYsMC4wNjg2YTAuMTA4MDM1LDAuMTA4MDM1IDAgMCAxIC0wLjAxMzU1NiwwLjAwODIxNmMtMC4wMzczODEsMC4wMjM0MTUgLTAuMDc0NzYyLDAuMDQ2MDA3IC0wLjExMjU1NCwwLjA2Nzc3OXMtMC4wODIxNTYsMC4wNDcyNCAtMC4xMjMyMzQsMC4wNjk4MzNzLTAuMDgyMTU2LDAuMDQ0MzY0IC0wLjEyMzIzNCwwLjA2NTcyNWwtMC4wMDQ1MTgsMC4wMDI0NjRjLTAuMDQxMDc4LDAuMDIxMzYxIC0wLjA4MjE1NiwwLjA0MTA3OCAtMC4xMjMyMzQsMC4wNjI0MzlzLTAuMDgyMTU2LDAuMDQxMDc4IC0wLjEyNjUyMSwwLjA2MTIwNnMtMC4wODU0NDIsMC4wNDEwNzggLTAuMTI4MTY0LDAuMDU4MzMxYy0wLjA4NTg1MywwLjAzNzc5MiAtMC4xNzI5MzksMC4wNzM1MyAtMC4yNjA0MzUsMC4xMDcyMTRzLTAuMTc2MjI1LDAuMDY1MzE0IC0wLjI2NTc3NSwwLjA5NDg5Yy0wLjAzNTczOCwwLjAxMTkxMyAtMC4wNzE0NzYsMC4wMjM0MTUgLTAuMTA3NjI1LDAuMDM0NTA2cy0wLjA4MjE1NiwwLjAyNDY0NyAtMC4xMjExOCwwLjAzNjE0OWMtMC4wNjgxODksMC4wMTkzMDcgLTAuMTM2NzksMC4wMzc3OTIgLTAuMjA1MzksMC4wNTQ2MzRjLTAuMDI1ODc5LDAuMDA2NTczIC0wLjA1MjE2OSwwLjAxMjczNCAtMC4wNzg0NTksMC4wMTg0ODVsLTAuMDQzOTU0LDAuMDEwMjdjLTAuMDM2NTU5LDAuMDA4MjE2IC0wLjA3MzExOSwwLjAxNjAyIC0wLjExMDA4OSwwLjAyMzQxNXMtMC4wNjczNjgsMC4wMTM1NTYgLTAuMTAxNDYzLDAuMDE5NzE3cy0wLjA2MjAyOCwwLjAxMTUwMiAtMC4wOTMyNDcsMC4wMTY0MzFzLTAuMDY5MDExLDAuMDExMDkxIC0wLjEwMzUxNywwLjAxNjAyMWMtMC4wMTY4NDIsMC4wMDI4NzUgLTAuMDMzNjg0LDAuMDA1MzQgLTAuMDUwOTM3LDAuMDA3Mzk0bC0wLjA3NzYzNywwLjAxMDI2OWwtMC4wNDMxMzIsMC4wMDUzNGMtMC4wMjgzNDQsMC4wMDM2OTcgLTAuMDU3MDk4LDAuMDA2NTczIC0wLjA4NTg1MywwLjAwOTQ0OGMtMC4wMzUzMjcsMC4wMDM2OTcgLTAuMDcwMjQ0LDAuMDA2OTgzIC0wLjEwNTU3LDAuMDA5ODU5Yy0wLjAyNzUyMiwwLjAwMjA1NCAtMC4wNTUwNDUsMC4wMDQ1MTkgLTAuMDgyMTU2LDAuMDA2MTYycy0wLjA0NzY1MSwwLjAwMzI4NiAtMC4wNzE4ODcsMC4wMDQxMDhsLTAuMDAzMjg2LDBjLTAuMDI3OTMzLDAgLTAuMDU1ODY2LDAuMDAzMjg2IC0wLjA4MjE1NiwwLjAwNDEwOGMtMC4wMzg2MTMsMCAtMC4wNzc2MzgsMC4wMDI4NzUgLTAuMTE2NjYyLDAuMDAzNjk3cy0wLjA3ODA0OCwwIC0wLjExNzQ4MywwYy0wLjAzOTE2MSwwIC0wLjA3ODMyMiwwIC0wLjExNzQ4Mywwcy0wLjA3ODA0OCwwIC0wLjExNjY2MiwtMC4wMDM2OTdjLTAuMDI4MzQ0LDAgLTAuMDU2Mjc3LC0wLjAwMjQ2NSAtMC4wODQyMSwtMC4wMDQxMDhsLTAuMDAzMjg2LDBjLTAuMDI0MjM2LDAgLTAuMDQ4MDYxLC0wLjAwMjQ2NSAtMC4wNzE4ODcsLTAuMDA0MTA4cy0wLjA1NTA0NSwtMC4wMDQxMDggLTAuMDgyMTU2LC0wLjAwNjE2MmMtMC4wMzUzMjcsLTAuMDAyODc1IC0wLjA3MDI0NCwtMC4wMDYxNjIgLTAuMTA1NTcxLC0wLjAwOTg1OWMtMC4wMjg3NTUsLTAuMDAyODc1IC0wLjA1NzUwOSwtMC4wMDU3NTEgLTAuMDg1ODUzLC0wLjAwOTQ0OGwtMC4wNDEwNzgsLTAuMDA1MzRjLTAuMDI1ODc5LC0wLjAwMjg3NSAtMC4wNTE3NTgsLTAuMDA2NTcyIC0wLjA3NzYzNywtMC4wMTAyNjljLTAuMDE3MjUzLDAgLTAuMDM0MDk1LC0wLjAwNDUxOCAtMC4wNTA5MzcsLTAuMDA3Mzk0cS0wLjA1MjE2OSwtMC4wMDczOTQgLTAuMTAzNTE3LC0wLjAxNjAyMWMtMC4wMzEyMTksLTAuMDA0OTMgLTAuMDYyNDM5LC0wLjAxMDY4IC0wLjA5MzI0NywtMC4wMTY0MzFzLTAuMDY3Nzc5LC0wLjAxMjczNCAtMC4xMDE0NjMsLTAuMDE5NzE3cy0wLjA3MzUzLC0wLjAxNTE5OSAtMC4xMTAwODksLTAuMDIzNDE1bC0wLjA0Mzk1NCwtMC4wMTAyN2MtMC4wMjYyOSwtMC4wMDU3NTEgLTAuMDUyNTgsLTAuMDExOTEyIC0wLjA3ODQ1OSwtMC4wMTg0ODVjLTAuMDY5MDExLC0wLjAxNjg0MiAtMC4xMzc2MTIsLTAuMDM1MzI3IC0wLjIwNTM5LC0wLjA1NDYzNGwtMC4xMjMyMzQsLTAuMDM2MTQ5Yy0wLjAzNjE0OSwtMC4wMTEwOTEgLTAuMDcxODg3LC0wLjAyMjU5MyAtMC4xMDc2MjUsLTAuMDM0NTA2Yy0wLjA4OTU1LC0wLjAyOTU3NiAtMC4xNzc4NjgsLTAuMDYxMjA2IC0wLjI2NTc3NSwtMC4wOTQ4OXMtMC4xNzYyMjUsLTAuMDY4NiAtMC4yNTgzODEsLTAuMTA2MzkyYy0wLjA0MTA3OCwtMC4wMTg4OTYgLTAuMDg1NDQyLC0wLjAzODYxMyAtMC4xMjgxNjQsLTAuMDU4MzMxcy0wLjA4NDYyMSwtMC4wNDEwNzggLTAuMTI2NTIxLC0wLjA2MTIwN3MtMC4wODIxNTYsLTAuMDQxMDc4IC0wLjEyMzIzNCwtMC4wNjI0MzlsLTAuMDA0NTE5LC0wLjAwMjQ2NWMtMC4wNDEwNzgsLTAuMDIxMzYgLTAuMDgyMTU2LC0wLjA0MzU0MyAtMC4xMjMyMzQsLTAuMDY1NzI1cy0wLjA4MjE1NiwtMC4wNDYwMDcgLTAuMTIzMjM0LC0wLjA2OTgzMnMtMC4wNzM1MywtMC4wNDM1NDMgLTAuMTEwNSwtMC4wNjc3NzlsLTAuMDEzNTU1LC0wLjAwODIxNmMtMC4wMzYxNDksLTAuMDIyMTgyIC0wLjA3MjI5OCwtMC4wNDUxODYgLTAuMTA4NDQ2LC0wLjA2ODZsLTAuMDE4ODk2LC0wLjAxMjMyM2MtMC4wMzQwOTUsLTAuMDIyMTgyIC0wLjA2ODYsLTAuMDQ1MTg2IC0wLjEwMjI4NCwtMC4wNjgxOXMtMC4wNzcyMjcsLTAuMDUyOTkxIC0wLjExNTAxOSwtMC4wODAxMDJzLTAuMDc1OTk0LC0wLjA1NTA0NSAtMC4xMTMzNzUsLTAuMDgyMTU2cy0wLjA2OTQyMiwtMC4wNTIxNjkgLTAuMTAzNTE3LC0wLjA3ODg3bC0wLjAwODIxNiwtMC4wMDY1NzJjLTAuMDMxNjMsLTAuMDI0NjQ3IC0wLjA2Mjg0OSwtMC4wNDk3MDQgLTAuMDk0MDY5LC0wLjA3NTE3M2wtMC4wMTQ3ODgsLTAuMDExOTEyYzEuODc4OTExLDAuOTM0NTI2IDIuODQ5OTk2LC0wLjI5NDExOSAzLjMzMDYxLC0xLjQ1NTgwN2E2Ljg3OTc1NSw2Ljg3OTc1NSAwIDAgMCAwLjQzMDA4NywtMS41NzUzNDRhNi44NzkzNDQsNi44NzkzNDQgMCAwIDAgMC40Mjk2NzcsMS41NzU3NTVjMC40ODA2MTMsMS4xNjA0NTUgMS40NTE2OTksMi4zODkxIDMuMzMwNjEsMS40NTQ1NzR6Ii8+PHBhdGggZmlsbD0iIzY3Njc2NyIgZD0ibTEyLjM4MDA1OSwxMi4yNjQyNjhjMCwyLjAwMzc4OCAtMC45NTI2LDMuODc5MDAyIC0yLjQyOTM1Nyw1LjA4NzUxOWMtMS44Nzg5MTEsMC45MzQ1MjYgLTIuODQ5OTk2LC0wLjI5NDExOSAtMy4zMzA2MSwtMS40NTU4MDdhNi44NzkzNDQsNi44NzkzNDQgMCAwIDEgLTAuNDMwMDg3LC0xLjU3NTM0NGw2LjAwNzI1NywtMy41NTM2NjRhNi4xODE4MzgsNi4xODE4MzggMCAwIDEgMC4xODI3OTcsMS40OTcyOTZ6Ii8+PHBvbHlnb24gZmlsbD0iIzEzMzQ0NCIgcG9pbnRzPSIzMS4xODI4MDYwMTUwMTQ2NSwxMC43NjY5NzA2MzQ0NjA0NSAzMS42MzE3ODgyNTM3ODQxOCwxMC41NzE4NTE3MzAzNDY2OCAzNy4xOTAwNDI0OTU3Mjc1NCw4LjE1NTYzOTY0ODQzNzUgNDMuMTk3MjY5NDM5Njk3MjY2LDEwLjc2Njk3MDYzNDQ2MDQ1IDQwLjk0MDA0MjQ5NTcyNzU0LDE1LjQyNjQ1ODM1ODc2NDY0OCAzNS40MjIwNDY2NjEzNzY5NSwxNi4yMDY5NDE2MDQ2MTQyNTggMzEuMjczMTc4MTAwNTg1OTM4LDExLjcyOTQzMTE1MjM0Mzc1IDMxLjE4MjgwNjAxNTAxNDY1LDEwLjc2Njk3MDYzNDQ2MDQ1Ii8+PHBvbHlnb24gZmlsbD0iIzFkNDI1OSIgcG9pbnRzPSIzNy4xOTAwNDI0OTU3Mjc1NCw2LjkzNjAzMTM0MTU1MjczNCAzNy4xOTAwNDI0OTU3Mjc1NCwxMi45NTUyMDExNDg5ODY4MTYgNDIuOTQ2Mjg1MjQ3ODAyNzM0LDkuNTUwMjM5NTYyOTg4MjgxIDM3LjE5MDA0MjQ5NTcyNzU0LDYuOTM2MDMxMzQxNTUyNzM0Ii8+PHBvbHlnb24gZmlsbD0iIzRiNmI5YSIgcG9pbnRzPSIzNy4xOTAwNDI0OTU3Mjc1NCwwIDM3LjE5MDA0MjQ5NTcyNzU0LDYuOTM2MDMxMzQxNTUyNzM0IDQyLjk0NjI4NTI0NzgwMjczNCw5LjU1MDIzOTU2Mjk4ODI4MSAzNy4xOTAwNDI0OTU3Mjc1NCwwIi8+PHBvbHlnb24gZmlsbD0iIzNlNTU3OCIgcG9pbnRzPSIzNy4xOTAwNDI0OTU3Mjc1NCw2LjkzNjAzMTM0MTU1MjczNCAzNy4xOTAwNDI0OTU3Mjc1NCwxMi45NTUyMDExNDg5ODY4MTYgMzYuMzY4NDgyNTg5NzIxNjgsMTIuNDY5MjQ1OTEwNjQ0NTMxIDMxLjQ0MTE4ODgxMjI1NTg2LDkuNTU0NzU5MDI1NTczNzMgMzEuNDMzNzk0MDIxNjA2NDQ1LDkuNTUwMjM5NTYyOTg4MjgxIDMxLjQ0NDg4NTI1MzkwNjI1LDkuNTQ1MzEwMDIwNDQ2Nzc3IDM2LjM2ODQ4MjU4OTcyMTY4LDcuMzA5MDIwNTE5MjU2NTkyIDM3LjE5MDA0MjQ5NTcyNzU0LDYuOTM2MDMxMzQxNTUyNzM0Ii8+PHBvbHlnb24gZmlsbD0iIzZkYjJkOCIgcG9pbnRzPSIzNy4xOTAwNDI0OTU3Mjc1NCwwIDM3LjE5MDA0MjQ5NTcyNzU0LDYuOTM2MDMxMzQxNTUyNzM0IDMxLjQzMzc5NDAyMTYwNjQ0NSw5LjU1MDIzOTU2Mjk4ODI4MSAzNy4xOTAwNDI0OTU3Mjc1NCwwIi8+PHBhdGggZmlsbD0iIzZkYjJkOCIgZD0ibTMxLjE4MjgwMSwxMC43NjY5NzJsNi4wMDcyNTcsMy41NTM2NjRhNi44Nzk3NTUsNi44Nzk3NTUgMCAwIDEgLTAuNDMwMDg3LDEuNTc2NTc2Yy0wLjQ4MDYxNCwxLjE2MTY4OCAtMS40NTE2OTksMi4zOTAzMzMgLTMuMzMwNjEsMS40NTU4MDdsMCwwYy0xLjQ3NzE2NywtMS4yMDkzMzggLTIuNDI5MzU3LC0zLjA4NDk2MyAtMi40MjkzNTcsLTUuMDg4NzUxYTYuMTgxODM4LDYuMTgxODM4IDAgMCAxIDAuMTgyNzk3LC0xLjQ5NzI5NnoiLz48cGF0aCBmaWxsPSIjNTI5YmJhIiBkPSJtNDAuOTUwNzU1LDE3LjM1MTc4N2wtMC4wMTQ3ODgsMC4wMTE5MTJjLTAuMDMxMjE5LDAuMDI1NDY5IC0wLjA2MjQzOSwwLjA1MDUyNiAtMC4wOTQwNjksMC4wNzUxNzNsLTAuMDA4MjE2LDAuMDA2NTczcS0wLjA1MTM0NywwLjA0MTA3OCAtMC4xMDM1MTYsMC4wNzg4NjljLTAuMDM3MzgxLDAuMDI3OTMzIC0wLjA3NTE3MywwLjA1NTg2NyAtMC4xMTMzNzYsMC4wODIxNTdzLTAuMDc2NDA1LDAuMDUzODEyIC0wLjExNTAxOCwwLjA4MDEwMnMtMC4wNjgxOSwwLjA0NjAwNyAtMC4xMDIyODUsMC4wNjgxODlsLTAuMDE4ODk2LDAuMDEyMzI0Yy0wLjAzNjE0OCwwLjAyMzQxNCAtMC4wNzIyOTcsMC4wNDY0MTggLTAuMTA4NDQ2LDAuMDY4NmEwLjEwODAzNSwwLjEwODAzNSAwIDAgMSAtMC4wMTM1NTUsMC4wMDgyMTZjLTAuMDM3MzgxLDAuMDIzNDE0IC0wLjA3NDc2MiwwLjA0NjAwNyAtMC4xMTI1NTQsMC4wNjc3NzlzLTAuMDgyMTU2LDAuMDQ3MjM5IC0wLjEyMzIzNCwwLjA2OTgzMnMtMC4wODIxNTcsMC4wNDQzNjUgLTAuMTIzMjM1LDAuMDY1NzI1bC0wLjAwNDUxOCwwLjAwMjQ2NWMtMC4wNDEwNzgsMC4wMjEzNjEgLTAuMDgyMTU2LDAuMDQxMDc4IC0wLjEyMzIzNCwwLjA2MjQzOXMtMC4wODIxNTcsMC4wNDEwNzcgLTAuMTI2NTIxLDAuMDYxMjA2cy0wLjA4NTQ0MiwwLjA0MTA3OCAtMC4xMjgxNjMsMC4wNTgzMzFjLTAuMDg1ODU0LDAuMDM3NzkyIC0wLjE3MjkzOSwwLjA3MzUzIC0wLjI2MDQzNSwwLjEwNzIxM3MtMC4xNzYyMjUsMC4wNjUzMTUgLTAuMjY1Nzc2LDAuMDk0ODkxYy0wLjAzNTczOCwwLjAxMTkxMyAtMC4wNzE0NzUsMC4wMjM0MTQgLTAuMTA3NjI0LDAuMDM0NTA1cy0wLjA4MjE1NiwwLjAyNDY0NyAtMC4xMjExOCwwLjAzNjE0OWMtMC4wNjgxOSwwLjAxOTMwNyAtMC4xMzY3OSwwLjAzNzc5MiAtMC4yMDUzOTEsMC4wNTQ2MzRjLTAuMDI1ODc5LDAuMDA2NTczIC0wLjA1MjE2OSwwLjAxMjczNCAtMC4wNzg0NTksMC4wMTg0ODVsLTAuMDQzOTUzLDAuMDEwMjdjLTAuMDM2NTYsMC4wMDgyMTUgLTAuMDczMTE5LDAuMDE2MDIgLTAuMTEwMDksMC4wMjM0MTRzLTAuMDY3MzY3LDAuMDEzNTU2IC0wLjEwMTQ2MiwwLjAxOTcxOHMtMC4wNjIwMjgsMC4wMTE1MDEgLTAuMDkzMjQ4LDAuMDE2NDMxcy0wLjA2OTAxMSwwLjAxMTA5MSAtMC4xMDM1MTYsMC4wMTYwMmMtMC4wMTY4NDIsMC4wMDI4NzYgLTAuMDMzNjg0LDAuMDA1MzQgLTAuMDUwOTM3LDAuMDA3Mzk0bC0wLjA3NzYzOCwwLjAxMDI3bC0wLjA0MzEzMiwwLjAwNTM0Yy0wLjAyODM0NCwwLjAwMzY5NyAtMC4wNTcwOTgsMC4wMDY1NzIgLTAuMDg1ODUzLDAuMDA5NDQ4Yy0wLjAzNTMyNywwLjAwMzY5NyAtMC4wNzAyNDMsMC4wMDY5ODMgLTAuMTA1NTcsMC4wMDk4NTljLTAuMDI3NTIzLDAuMDAyMDU0IC0wLjA1NTA0NSwwLjAwNDUxOCAtMC4wODIxNTcsMC4wMDYxNjFzLTAuMDQ3NjUsMC4wMDMyODcgLTAuMDcxODg2LDAuMDA0MTA4bC0wLjAwMzI4NywwYy0wLjAyNzkzMywwIC0wLjA1NTg2NiwwLjAwMzI4NiAtMC4wODIxNTYsMC4wMDQxMDhjLTAuMDM4NjEzLDAgLTAuMDc3NjM3LDAuMDAyODc1IC0wLjExNjY2MSwwLjAwMzY5N3MtMC4wNzgwNDgsMCAtMC4xMTc0ODQsMGMtMC4wMzkxNjEsMCAtMC4wNzgzMjIsMCAtMC4xMTc0ODMsMHMtMC4wNzgwNDgsMCAtMC4xMTY2NjIsLTAuMDAzNjk3Yy0wLjAyODM0NCwwIC0wLjA1NjI3NywtMC4wMDI0NjUgLTAuMDg0MjEsLTAuMDA0MTA4bC0wLjAwMzI4NiwwYy0wLjAyNDIzNiwwIC0wLjA0ODA2MSwtMC4wMDI0NjUgLTAuMDcxODg3LC0wLjAwNDEwOHMtMC4wNTUwNDQsLTAuMDA0MTA3IC0wLjA4MjE1NiwtMC4wMDYxNjFjLTAuMDM1MzI3LC0wLjAwMjg3NiAtMC4wNzAyNDMsLTAuMDA2MTYyIC0wLjEwNTU3LC0wLjAwOTg1OWMtMC4wMjg3NTUsLTAuMDAyODc2IC0wLjA1NzUxLC0wLjAwNTc1MSAtMC4wODU4NTMsLTAuMDA5NDQ4bC0wLjA0MTA3OSwtMC4wMDUzNGMtMC4wMjU4NzksLTAuMDAyODc2IC0wLjA1MTc1OCwtMC4wMDY1NzMgLTAuMDc3NjM3LC0wLjAxMDI3Yy0wLjAxNzI1MywwIC0wLjAzNDA5NSwtMC4wMDQ1MTggLTAuMDUwOTM3LC0wLjAwNzM5NHEtMC4wNTIxNjksLTAuMDA3Mzk0IC0wLjEwMzUxNiwtMC4wMTYwMmMtMC4wMzEyMiwtMC4wMDQ5MyAtMC4wNjI0MzksLTAuMDEwNjgxIC0wLjA5MzI0OCwtMC4wMTY0MzFzLTAuMDY3Nzc5LC0wLjAxMjczNSAtMC4xMDE0NjMsLTAuMDE5NzE4cy0wLjA3MzUyOSwtMC4wMTUxOTkgLTAuMTEwMDg5LC0wLjAyMzQxNGwtMC4wNDM5NTMsLTAuMDEwMjdjLTAuMDI2MjksLTAuMDA1NzUxIC0wLjA1MjU4LC0wLjAxMTkxMiAtMC4wNzg0NTksLTAuMDE4NDg1Yy0wLjA2OTAxMSwtMC4wMTY4NDIgLTAuMTM3NjEyLC0wLjAzNTMyNyAtMC4yMDUzOTEsLTAuMDU0NjM0bC0wLjEyMzIzNCwtMC4wMzYxNDljLTAuMDM2MTQ5LC0wLjAxMTA5MSAtMC4wNzE4ODcsLTAuMDIyNTkyIC0wLjEwNzYyNSwtMC4wMzQ1MDVjLTAuMDg5NTUsLTAuMDI5NTc2IC0wLjE3Nzg2OCwtMC4wNjEyMDYgLTAuMjY1Nzc1LC0wLjA5NDg5MXMtMC4xNzYyMjUsLTAuMDY4NiAtMC4yNTgzODEsLTAuMTA2MzkyYy0wLjA0MTA3OCwtMC4wMTg4OTYgLTAuMDg1NDQyLC0wLjAzODYxMyAtMC4xMjgxNjMsLTAuMDU4MzNzLTAuMDg0NjIxLC0wLjA0MTA3OSAtMC4xMjY1MjEsLTAuMDYxMjA3cy0wLjA4MjE1NiwtMC4wNDEwNzggLTAuMTIzMjM0LC0wLjA2MjQzOWwtMC4wMDQ1MTksLTAuMDAyNDY0Yy0wLjA0MTA3NywtMC4wMjEzNjEgLTAuMDgyMTU2LC0wLjA0MzU0MyAtMC4xMjMyMzQsLTAuMDY1NzI1cy0wLjA4MjE1NiwtMC4wNDYwMDggLTAuMTIzMjM0LC0wLjA2OTgzM3MtMC4wNzM1MywtMC4wNDM1NDMgLTAuMTEwNSwtMC4wNjc3NzlsLTAuMDEzNTU2LC0wLjAwODIxNWMtMC4wMzYxNDgsLTAuMDIyMTgyIC0wLjA3MjI5NywtMC4wNDUxODYgLTAuMTA4NDQ2LC0wLjA2ODYwMWwtMC4wMTg4OTYsLTAuMDEyMzIzYy0wLjAzNDA5NSwtMC4wMjIxODIgLTAuMDY4NiwtMC4wNDUxODYgLTAuMTAyMjg0LC0wLjA2ODE5cy0wLjA3NzIyNywtMC4wNTI5OSAtMC4xMTUwMTksLTAuMDgwMTAycy0wLjA3NTk5NCwtMC4wNTUwNDUgLTAuMTEzMzc1LC0wLjA4MjE1NnMtMC4wNjk0MjIsLTAuMDUyMTY5IC0wLjEwMzUxNywtMC4wNzg4N2wtMC4wMDgyMTYsLTAuMDA2NTcyYy0wLjAzMTYzLC0wLjAyNDY0NyAtMC4wNjI4NDksLTAuMDQ5NzA1IC0wLjA5NDA2OCwtMC4wNzUxNzNsLTAuMDE0Nzg4LC0wLjAxMTkxM2MxLjg3ODkxLDAuOTM0NTI2IDIuODQ5OTk2LC0wLjI5NDExOSAzLjMzMDYwOSwtMS40NTU4MDdhNi44Nzk3NTUsNi44Nzk3NTUgMCAwIDAgMC40MzAwODgsLTEuNTc1MzQ0YTYuODc5MzQ0LDYuODc5MzQ0IDAgMCAwIDAuNDI5Njc2LDEuNTc1NzU1YzAuNDgwNjE0LDEuMTYwNDU2IDEuNDUxNjk5LDIuMzg5MTAxIDMuMzMwNjEsMS40NTQ1NzV6Ii8+PHBhdGggZmlsbD0iIzRiNmI5YSIgZD0ibTQzLjM4MDExMiwxMi4yNjQyNjhjMCwyLjAwMzc4OCAtMC45NTI2LDMuODc5MDAyIC0yLjQyOTM1Nyw1LjA4NzUxOWMtMS44Nzg5MTEsMC45MzQ1MjYgLTIuODQ5OTk2LC0wLjI5NDExOSAtMy4zMzA2MSwtMS40NTU4MDdhNi44NzkzNDQsNi44NzkzNDQgMCAwIDEgLTAuNDMwMDg3LC0xLjU3NTM0NGw2LjAwNzI1NywtMy41NTM2NjRhNi4xODE4MzgsNi4xODE4MzggMCAwIDEgMC4xODI3OTcsMS40OTcyOTZ6Ii8+PC9nPjwvc3ZnPg==);
  }

  &.WalletConnect {
    background-position: 0;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSIxMSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNLTItNmg1M3YyMkgtMnoiLz48cGF0aCBmaWxsPSIjOUVBMUFBIiBkPSJNMy44OSAyLjE1YzMuMDk4LTIuODY2IDguMTIyLTIuODY2IDExLjIyIDBsLjM3My4zNDRhLjM0OC4zNDggMCAwMTAgLjUxOWwtMS4yNzUgMS4xOGEuMjEuMjEgMCAwMS0uMjggMGwtLjUxNC0uNDc1Yy0yLjE2Mi0xLjk5OS01LjY2Ni0xLjk5OS03LjgyOCAwbC0uNTUuNTA4YS4yMS4yMSAwIDAxLS4yOCAwTDMuNDggMy4wNDZhLjM0OC4zNDggMCAwMTAtLjUxOGwuNDEtLjM3OXptMTMuODU4IDIuNDRsMS4xMzYgMS4wNWEuMzQ4LjM0OCAwIDAxMCAuNTE4bC01LjEyIDQuNzM1YS40Mi40MiAwIDAxLS41NiAwTDkuNTcgNy41MzNhLjEwNS4xMDUgMCAwMC0uMTQgMGwtMy42MzMgMy4zNmEuNDIuNDIgMCAwMS0uNTYxIDBMLjExNiA2LjE1OGEuMzQ4LjM0OCAwIDAxMC0uNTE5bDEuMTM2LTEuMDVhLjQyLjQyIDAgMDEuNTYgMGwzLjYzNCAzLjM2YS4xMDUuMTA1IDAgMDAuMTQgMEw5LjIyIDQuNTlhLjQyLjQyIDAgMDEuNTYxIDBsMy42MzQgMy4zNmEuMTA1LjEwNSAwIDAwLjE0IDBsMy42MzMtMy4zNmEuNDIuNDIgMCAwMS41NjEgMHoiLz48cGF0aCBmaWxsPSIjM0Q5Q0Y4IiBkPSJNMzQuODkgMi4xNWMzLjA5OC0yLjg2NiA4LjEyMi0yLjg2NiAxMS4yMiAwbC4zNzMuMzQ0YS4zNDguMzQ4IDAgMDEwIC41MTlsLTEuMjc1IDEuMThhLjIxLjIxIDAgMDEtLjI4IDBsLS41MTQtLjQ3NWMtMi4xNjItMS45OTktNS42NjYtMS45OTktNy44MjggMGwtLjU1LjUwOGEuMjEuMjEgMCAwMS0uMjggMGwtMS4yNzYtMS4xOGEuMzQ4LjM0OCAwIDAxMC0uNTE4bC40MS0uMzc5em0xMy44NTggMi40NGwxLjEzNiAxLjA1YS4zNDguMzQ4IDAgMDEwIC41MThsLTUuMTIgNC43MzVhLjQyLjQyIDAgMDEtLjU2IDBsLTMuNjM0LTMuMzZhLjEwNS4xMDUgMCAwMC0uMTQgMGwtMy42MzMgMy4zNmEuNDIuNDIgMCAwMS0uNTYxIDBsLTUuMTItNC43MzVhLjM0OC4zNDggMCAwMTAtLjUxOWwxLjEzNi0xLjA1YS40Mi40MiAwIDAxLjU2IDBsMy42MzQgMy4zNmEuMTA1LjEwNSAwIDAwLjE0IDBsMy42MzMtMy4zNmEuNDIuNDIgMCAwMS41NjEgMGwzLjYzNCAzLjM2YS4xMDUuMTA1IDAgMDAuMTQgMGwzLjYzMy0zLjM2YS40Mi40MiAwIDAxLjU2MSAweiIvPjwvZz48L3N2Zz4=);
  }
`

const ItemButtonName = styled.div`
  font-size: 12px;
  font-weight: 500;
  position: relative;
  top: 1px;
`

const UnconnectorButton = styled.button`
  margin-right: auto;
  width: 80%;
  height: 40px;
  margin: 24px 0 0 0;
  padding: 0;
  border: none;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.blueGray50};
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 13px;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fontFamilies.notoSans};
  letter-spacing: 1px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const IframeBox = styled.div`
  width: 280px;
  height: 125px;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function ImportAccount() {
  const { t } = useTranslation()

  const {
    account,
    active,
    activate,
    deactivate,
    connector,
    library,
  } = useWeb3React()

  const isDetectedWeb3 = !!window.ethereum || !!window.web3

  const [balance, setbalance] = useState(0)
  const [ibalance, setIBalance] = useState(0)

  const balanceTest = useMemo(() => {
    ;(async () => {
      try {
        if (active && connector) {
          const iEth = getContract(
            '0x77f973fcaf871459aa58cd81881ce453759281bc',
            IErc20_ABI,
            library,
            account,
          )
          const test = new BigNumber(
            await iEth.methods.balanceOf(account).call(),
          )

          setbalance(test.div(1e18).toString())
        } else {
          setbalance(0)
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [active, connector])

  const iBalanceTest = useMemo(() => {
    ;(async () => {
      const a = async () => {
        try {
          if (active && connector) {
            const wEth = getContract(
              '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
              Erc20_ABI,
              library,
              account,
            )
            const test = new BigNumber(
              await wEth.methods
                .balanceOf('0x77f973fcaf871459aa58cd81881ce453759281bc')
                .call(),
            )

            setIBalance(test.gt(0) ? test.div(1e18).toString() : 0)
          } else {
            setIBalance(0)
          }
        } catch (e) {
          console.log(e)
        }
      }
      await a()
      setInterval(async () => {
        await a()
      }, 120000)
    })()
  }, [active, connector])

  const isInjected = useMemo(() => active && connector === injectedConnector, [
    active,
    connector,
  ])

  const isWalletConnected = useMemo(
    () => active && connector === walletconnectConnector,
    [active, connector],
  )

  const isFortmaticConnected = useMemo(
    () => active && connector === fortmaticConnector,
    [active, connector],
  )

  const isTorusConnected = useMemo(
    () => active && connector === torusConnector,
    [active, connector],
  )

  const isPortisConnected = useMemo(
    () => active && connector === portisConnector,
    [active, connector],
  )

  const connectInjectedWallet = useCallback(async () => {
    try {
      await activate(injectedConnector, undefined, true)
    } catch (e) {
      console.log('You let me break. LoL')
    }
  }, [activate])

  const connectFortmatic = useCallback(async () => {
    try {
      await activate(fortmaticConnector, undefined, true)
    } catch {
      console.log('You let me break. LoL')
    }
  }, [activate])

  const connectTorus = useCallback(async () => {
    try {
      await activate(torusConnector, undefined, true)
    } catch {
      await torusConnector.deactivate()
    }
  }, [activate])

  const connectPortis = useCallback(async () => {
    try {
      await activate(portisConnector, undefined, true)
    } catch {
      console.log('You let me break. LoL')
    }
  }, [activate])

  const connectWalletconnect = useCallback(async () => {
    try {
      await activate(walletconnectConnector, undefined, true)
    } catch {
      console.log('You let me break. LoL')
    }
  }, [activate])

  const unconnectWallet = useCallback(() => {
    deactivate()
    if (connector === walletconnectConnector) {
      connector.close()
    }
  }, [connector, deactivate])

  const particialAddress = account => {
    const prefixAddress = account.slice(0, 8)
    const suffixAddress = account.slice(account.length - 8, account.length)
    return `${prefixAddress}...${suffixAddress}`
  }

  return (
    <ImportAccountContainer>
      {(isInjected ||
        isWalletConnected ||
        isFortmaticConnected ||
        isTorusConnected ||
        isPortisConnected) && (
        <>
          <ImportAccountBox>
            <ValueBox>
              <ImportAccountTitle>
                Account:&nbsp;{particialAddress(account)}
              </ImportAccountTitle>
              <ImportAccountValue>Your ETH:{balance}</ImportAccountValue>
              <ImportAccountValue>
                iETH:&nbsp;&nbsp;&nbsp;&nbsp;{ibalance}
              </ImportAccountValue>
              <UnconnectorButton onClick={unconnectWallet}>
                {t('logout')}
              </UnconnectorButton>
            </ValueBox>
            <IframeBox id='iframeBox'>{}</IframeBox>
          </ImportAccountBox>
        </>
      )}
      {!(
        isInjected ||
        isWalletConnected ||
        isFortmaticConnected ||
        isTorusConnected ||
        isPortisConnected
      ) && (
        <>
          <ImportAccountContent>
            <ImportAccountItem className='import-account__item'>
              <ImportAccountButton
                isConnected={isInjected}
                disabled={!isDetectedWeb3}
                onClick={connectInjectedWallet}
              >
                <ItemButtonIcon className='ItemButtonIcon Metamask'></ItemButtonIcon>
                <ItemButtonName className='ItemButtonName Metamask'>
                  METAMASK
                </ItemButtonName>
              </ImportAccountButton>
            </ImportAccountItem>
            <ImportAccountItem className='import-account__item'>
              <ImportAccountButton
                isConnected={isFortmaticConnected}
                onClick={connectFortmatic}
              >
                <ItemButtonIcon className='ItemButtonIcon Fortmatic'></ItemButtonIcon>
                <ItemButtonName className='ItemButtonName Fortmatic'>
                  FORTMATIC
                </ItemButtonName>
              </ImportAccountButton>
            </ImportAccountItem>
            <ImportAccountItem className='import-account__item'>
              <ImportAccountButton
                isConnected={isTorusConnected}
                onClick={connectTorus}
              >
                <ItemButtonIcon className='ItemButtonIcon Torus'></ItemButtonIcon>
                <ItemButtonName className='ItemButtonName Torus'>
                  TORUS
                </ItemButtonName>
              </ImportAccountButton>
            </ImportAccountItem>
            <ImportAccountItem className='import-account__item'>
              <ImportAccountButton
                isConnected={isPortisConnected}
                onClick={connectPortis}
              >
                <ItemButtonIcon className='ItemButtonIcon Portis'></ItemButtonIcon>
                <ItemButtonName className='ItemButtonName Portis'>
                  PORTIS
                </ItemButtonName>
              </ImportAccountButton>
            </ImportAccountItem>
            <ImportAccountItem className='large import-account__item'>
              <ImportAccountButton
                isConnected={isWalletConnected}
                onClick={connectWalletconnect}
              >
                <ItemButtonIcon className='ItemButtonIcon WalletConnect'></ItemButtonIcon>
                <ItemButtonName className='ItemButtonName WalletConnect'>
                  WALLET CONNECT
                </ItemButtonName>
              </ImportAccountButton>
            </ImportAccountItem>
          </ImportAccountContent>
        </>
      )}
    </ImportAccountContainer>
  )
}
