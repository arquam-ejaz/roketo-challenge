import 'regenerator-runtime/runtime'
import { initContract, login, logout } from './utils'
import { utils } from "near-api-js";
import Big from "big.js";
import getConfig from './config'
import { mont } from 'bn.js';

const BN = require("bn.js");
const nearConfig = getConfig('testnet')



window.onload = (event) => {
  getBalance();
  getStreamDetails()
};

async function getBalance() {
  await window.contract.ft_balance_of({
    account_id: window.accountId
  }).then((value) => {
    value = utils.format.formatNearAmount(value)
    document.getElementById('wNEAR').innerHTML += value + ' <span title="NEAR Tokens" style="display: inline-block; color: black;">Ⓝ</span>'
  })
}

async function getStreamDetails() {


  await window.roketo_contract.get_account({
    "account_id": window.accountId
  }).then((details) => {
    document.getElementById('outgoing-streams').innerHTML += details['active_outgoing_streams']
    document.getElementById('incoming-streams').innerHTML += details['active_incoming_streams']
    document.getElementById('last-stream').innerHTML += details['last_created_stream']
  })

}

// global variable used throughout
// let currentGreeting

// const submitButton = document.querySelector('form button')

// document.querySelector('form').onsubmit = async (event) => {
//   event.preventDefault()

//   // get elements from the form using their id attribute
//   const { fieldset, greeting } = event.target.elements

//   // disable the form while the value gets updated on-chain
//   fieldset.disabled = true

//   try {
//     // make an update call to the smart contract
//     await window.contract.setGreeting({
//       // pass the value that the user entered in the greeting field
//       message: greeting.value
//     })
//   } catch (e) {
//     alert(
//       'Something went wrong! ' +
//       'Maybe you need to sign out and back in? ' +
//       'Check your browser console for more info.'
//     )
//     throw e
//   } finally {
//     // re-enable the form, whether the call succeeded or failed
//     fieldset.disabled = false
//   }

//   // disable the save button, since it now matches the persisted value
//   submitButton.disabled = true

//   // update the greeting in the UI
//   await fetchGreeting()

//   // show notification
//   document.querySelector('[data-behavior=notification]').style.display = 'block'

//   // remove notification again after css animation completes
//   // this allows it to be shown again next time the form is submitted
//   setTimeout(() => {
//     document.querySelector('[data-behavior=notification]').style.display = 'none'
//   }, 11000)
// }

// document.querySelector('input#greeting').oninput = (event) => {
//   if (event.target.value !== currentGreeting) {
//     submitButton.disabled = false
//   } else {
//     submitButton.disabled = true
//   }
// }

const form1 = document.
  getElementById('form1');

form1.addEventListener('submit', formSubmit1);

async function formSubmit1(event) {
  event.preventDefault();
  let convert = document.getElementById('convert').value
  convert = utils.format.parseNearAmount(convert.toString()).toString()

  try {

    await window.contract.near_deposit({},
      200000000000000,
      new BN(convert),
    )
  } catch (e) {
    alert(
      'Something went wrong! ' +
      'Maybe you need to sign out and back in? ' +
      'Check your browser console for more info.'
    )
    throw e
  }



}

const form2 = document.
  getElementById('form2');

form2.addEventListener('submit', formSubmit2);

async function formSubmit2(event) {
  event.preventDefault();

  let invest = document.getElementById('invest').value
  invest = utils.format.parseNearAmount(invest.toString()).toString()
  let months = document.getElementById('months').value
  let tokens_per_sec = Big(invest).div(2628002 * months).round().toNumber()

  console.log(invest)
  console.log(months)
  console.log(tokens_per_sec)
  try {

    await window.contract.ft_transfer_call({
      receiver_id: 'streaming-r-v2.dcversus.testnet',
      amount: invest,
      memo: 'Roketo transfer',
      msg: JSON.stringify({
        Create: {
          request: {
            "owner_id": window.accountId,
            "receiver_id": "swaps-wnear-wbtc.aejaz.testnet",
            "tokens_per_sec": tokens_per_sec,
          }
        }
      }),
    },
      200000000000000,
      new BN("1"));
  } catch (e) {
    alert(
      'Something went wrong! ' +
      'Maybe you need to sign out and back in? ' +
      'Check your browser console for more info.'
    )
    throw e
  }

  // try {

  //   await window.walletConnection.account().functionCall({
  //     contractId: nearConfig.contractName,
  //     method_name: 'near_deposit',
  //     args: {},
  //     gas: new BN('300000000000000'),
  //     amount: new BN(invest),
  //     walletCallbackUrl: window.location.href
  //   }).then(async () => {
  //     await window.walletConnection.account().functionCall({
  //       contractId: window.contractId,
  //       method_name: 'ft_transfer_call',
  //       args: {
  //         amount: invest,
  //         receiver_id: "aejaz.testnet",

  //         memo: "",
  //         msg: JSON.stringify({
  //           Create: {
  //             request: {
  //               owner_id: `${window.accountId}`,
  //               receiver_id: 'aejaz.testnet',
  //               tokens_per_sec:
  //                 tokens_per_sec
  //             },
  //           },
  //         }),
  //       },
  //       gas: new BN('300000000000000'),
  //       amount: new BN(invest),
  //       walletCallbackUrl: window.location.href
  //     })
  //   })
  //   await window.contract.nft_mint({
  //     token_id: window.accountId + 'g',
  //     metadata: {
  //       title: "Thank you for saving Giraffes",
  //       description: "This NFT is a part of NEAR Spring Hackathon ;)",
  //       media: "https://link.ap1.storjshare.io/jutghzhpqtvijphwfx2gbqqai55q/demo-bucket%2Fgiraffe.gif?wrap=0"
  //     },
  //     receiver_id: window.accountId,
  //   },
  //     300000000000000,
  //     new BN(amt))
  // } catch (e) {
  //   alert(
  //     'Something went wrong! ' +
  //     'Maybe you need to sign out and back in? ' +
  //     'Check your browser console for more info.'
  //   )
  //   throw e
  // }

}

document.querySelector('#sign-in-button').onclick = login
document.querySelector('#sign-out-button').onclick = logout

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector('#signed-out-flow').style.display = 'block'
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {
  document.querySelector('#signed-in-flow').style.display = 'block'

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = window.accountId
  })

  // populate links in the notification box
  // const accountLink = document.querySelector('[data-behavior=notification] a:nth-of-type(1)')
  // accountLink.href = accountLink.href + window.accountId
  // accountLink.innerText = '@' + window.accountId
  // const contractLink = document.querySelector('[data-behavior=notification] a:nth-of-type(2)')
  // contractLink.href = contractLink.href + window.contract.contractId
  // contractLink.innerText = '@' + window.contract.contractId

  // update with selected networkId
  // accountLink.href = accountLink.href.replace('testnet', networkId)
  // contractLink.href = contractLink.href.replace('testnet', networkId)

  // fetchGreeting()
}

// // update global currentGreeting variable; update DOM with it
// async function fetchGreeting() {
//   currentGreeting = await contract.getGreeting({ accountId: window.accountId })
//   document.querySelectorAll('[data-behavior=greeting]').forEach(el => {
//     // set divs, spans, etc
//     el.innerText = currentGreeting

//     // set input elements
//     el.value = currentGreeting
//   })
// }

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow()
    else signedOutFlow()
  })
  .catch(console.error)
