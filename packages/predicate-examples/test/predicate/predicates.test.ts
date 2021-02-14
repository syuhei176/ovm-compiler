import chai from 'chai'
import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'
import * as MockAdjudicationContract from '../../build/contracts/MockAdjudicationContract.json'
import * as MockChallenge from '../../build/contracts/MockChallenge.json'
import * as MockAtomicPredicate from '../../build/contracts/MockAtomicPredicate.json'
import * as MockCompiledPredicate from '../../build/contracts/MockCompiledPredicate.json'
import * as Utils from '../../build/contracts/Utils.json'
import * as ethers from 'ethers'
import {randomAddress} from '../helpers/utils'
import {createTestCases} from './testcase'

chai.use(solidity)
chai.use(require('chai-as-promised'))
const {expect, assert} = chai

describe('predicates', () => {
  let provider = createMockProvider()
  let wallets = getWallets(provider)
  let wallet = wallets[0]
  let mockChallenge: ethers.Contract
  const notAddress = randomAddress()
  const andAddress = randomAddress()
  const forAllSuchThatAddress = randomAddress()
  const ownershipPayout = randomAddress()
  let mockAtomicPredicateAddress: string
  let mockAtomicPredicate: ethers.Contract
  let mockCompiledPredicate: ethers.Contract

  beforeEach(async () => {
    mockAtomicPredicate = await deployContract(wallet, MockAtomicPredicate, [])
    mockAtomicPredicateAddress = mockAtomicPredicate.address
    mockChallenge = await deployContract(wallet, MockChallenge, [])
    mockCompiledPredicate = await deployContract(
      wallet,
      MockCompiledPredicate,
      []
    )
  })

  const testcases = createTestCases(
    [notAddress, andAddress, forAllSuchThatAddress],
    wallet
  )

  testcases.forEach(testcase => {
    describe(testcase.name, () => {
      let targetPredicate: ethers.Contract
      beforeEach(async () => {
        const utils = await deployContract(wallet, Utils, [])
        const adjudicationContract = await deployContract(
          wallet,
          MockAdjudicationContract,
          [false]
        )
        targetPredicate = await deployContract(
          wallet,
          testcase.contract,
          [
            adjudicationContract.address,
            utils.address,
            notAddress,
            andAddress,
            forAllSuchThatAddress
          ].concat(testcase.extraArgs),
          {gasLimit: 5000000}
        )
        await targetPredicate.setPredicateAddresses(
          mockAtomicPredicate.address,
          mockAtomicPredicate.address,
          mockAtomicPredicate.address,
          mockAtomicPredicate.address,
          mockAtomicPredicate.address,
          mockAtomicPredicate.address,
          mockAtomicPredicate.address,
          mockAtomicPredicate.address,
          mockAtomicPredicate.address,
          ownershipPayout
        )
      })

      describe('isValidChallenge', () => {
        testcase.validChallenges.forEach(validChallenge => {
          it(validChallenge.name, async () => {
            const result = await mockChallenge.isValidChallenge(
              validChallenge.getProperty(
                targetPredicate,
                mockCompiledPredicate
              ),
              [validChallenge.challengeInput || '0x'],
              validChallenge.getChallenge(
                targetPredicate,
                mockAtomicPredicateAddress,
                mockCompiledPredicate
              )
            )
            assert.isTrue(result)
          })
        })

        testcase.invalidChallenges.forEach(invalidChallenge => {
          it(invalidChallenge.name, async () => {
            const challengeInput = '0x'
            await expect(
              mockChallenge.isValidChallenge(
                invalidChallenge.getProperty(
                  targetPredicate,
                  mockCompiledPredicate
                ),
                [challengeInput],
                invalidChallenge.getChallenge(
                  targetPredicate,
                  mockAtomicPredicateAddress,
                  mockCompiledPredicate
                )
              )
            ).to.be.reverted
          })
        })
      })

      describe('decide', () => {
        testcase.decideTrueTestCases.forEach(decideTrueTestCase => {
          it(decideTrueTestCase.name, async () => {
            const parameters = decideTrueTestCase.createParameters(
              mockCompiledPredicate
            )
            const result = await targetPredicate.decide(
              parameters.inputs,
              parameters.witnesses
            )
            assert.isTrue(result)
          })
        })

        testcase.invalidDecideTestCases.forEach(decideTrueTestCase => {
          it(decideTrueTestCase.name, async () => {
            const parameters = decideTrueTestCase.createParameters(
              mockCompiledPredicate
            )
            await expect(
              targetPredicate.decide(parameters.inputs, parameters.witnesses)
            ).to.be.reverted
          })
        })
      })
    })
  })
})
