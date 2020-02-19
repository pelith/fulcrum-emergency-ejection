import { useState, useMemo, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'

import { getContract, getGasPrice } from '../utils'

export function useContract(address, abi, withSignerIfPossible = true) {
  const { account, library } = useWeb3React()

  return useMemo(() => {
    try {
      return getContract(
        address,
        abi,
        library,
        withSignerIfPossible ? account : undefined,
      )
    } catch {
      return null
    }
  }, [address, abi, library, account, withSignerIfPossible])
}

export function useGasPrice() {
  const [level, setLevel] = useState('fast')
  const getPrice = useCallback(() => getGasPrice(level), [level])

  return { getPrice, setLevel }
}
