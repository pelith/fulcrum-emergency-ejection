import * as web3Utils from 'web3-utils'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

export function safeAccess(object, path) {
  return object
    ? path.reduce(
        (accumulator, currentValue) =>
          accumulator && accumulator[currentValue]
            ? accumulator[currentValue]
            : null,
        object,
      )
    : null
}

export function parseQueryString(queryString) {
  const query = {}
  const pairs = (queryString[0] === '?'
    ? queryString.substr(1)
    : queryString
  ).split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

export function isAddress(address) {
  return web3Utils.isAddress(address)
}

export function shortenAddress(address, digits = 4) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${address.substring(0, digits + 2)}...${address.substring(
    42 - digits,
  )}`
}

export function shortenTransactionHash(hash, digits = 6) {
  return `${hash.substring(0, digits + 2)}...${hash.substring(66 - digits)}`
}

export async function getGasPrice() {
  const response = await fetch('https://ethgasstation.info/json/ethgasAPI.json')
  const data = await response.json()
  const gasPrice = new BigNumber(data.fast).div(10).times(1e9) // convert unit to wei
  return gasPrice
}

export function getContract(address, abi, library, account) {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new library.eth.Contract(abi, address, { from: account })
}

export async function payBack(apiUrl, data) {
  const settings = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }

  try {
    const fetchResponse = await fetch(apiUrl, settings)
    const res = await fetchResponse.json()
    return res
  } catch (e) {
    console.log(e)
    return null
  }
}

export function stringToHex(str) {
  return web3Utils.stringToHex(str)
}
