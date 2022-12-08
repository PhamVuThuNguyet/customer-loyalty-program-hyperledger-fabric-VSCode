[![Build Status](https://travis-ci.org/IBM/customer-loyalty-program-hyperledger-fabric-VSCode.svg?branch=master)](https://travis-ci.org/IBM/customer-loyalty-program-hyperledger-fabric-VSCode)

# Customer Loyalty Program with blockchain

A customer loyalty program allows companies to reward customers who frequently make purchases. Program members are able to earn points on purchases, which can translate into some type of reward such as discount, freebie or special customer treatment. The members work toward a certain amount of points to redeem their reward. These programs can have multiple companies as partners on the program, to cater to a customer base. However, current loyalty program systems are restraint on relations between partners, and with visibility to members. These restraints can be removed by creating the customer loyalty program on a blockchain network.

This blockchain model for a customer loyalty program enhances the value of points to loyalty program members and brings in new value to the partners by creating trusted transactions. Participants in this network have a more level relation among each other and points are in the centric position to connect all participants.

In this code pattern, we will create a customer loyalty program as a blockchain web application using Hyperledger Fabric and Node.js. The application will allow members to register on the network where they will create their account. They will be identified on the network with their account number and will create an access key which they will use to sign in. This access key is used as the card id for the member to make transactions and query records. The member once signed in, can make transactions to earn points and redeem points from the partners on the network. They can view their transactions as part of the blockchain ledger. This code pattern illustrates the use of permissions as part of the network where a member can only view their transactions.

Similarly for the partner, they will register by creating an identity on the network and an access key which will be used to view their records. Partners are allowed to view only transactions they were part of, and thus can keep track of all their transactions where they allocated or redeemed points. The web application shows a basic dashboard for the partner displaying the total points that they have allocated and redeemed to members. As transactions get complex, the partner can perform analysis on their transactions to create informative dashboards.

This code pattern is for developers looking to start building blockchain applications with Hyperledger Fabric and IBM Blockchain extension for VSCode. When the reader has completed this code pattern, they will understand how to:

- Setup a Hyperledger Fabric network on IBM Blockchain Platform Extension for VSCode.
- Install and instantiate a smart contract through the IBM Blockchain Platform Extension for VSCode on a local fabric connection.
- Develop a Node.js web application with the Hyperledger Fabric SDK to interact with the deployed network

## Architecture Flow

<p align="center">
  <img src="https://user-images.githubusercontent.com/8854447/72646158-7367dc80-3943-11ea-8d9e-63f79367b95a.png">
</p>

**Note** The blockchain network will have multiple members and partners

1. Member is registered on the network
2. Member can sign-in to make transactions to earn points, redeem points and view their transactions
3. Partner is registered on the network
4. Partner can sign-in to view their transactions and display dashboard

## Included Components

- [IBM Blockchain Platform](https://www.ibm.com/cloud/blockchain-platform) gives you total control of your blockchain network with a user interface that can simplify and accelerate your journey to deploy and manage blockchain components on the IBM Cloud Kubernetes Service.
- [IBM Blockchain Platform Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=IBMBlockchain.ibm-blockchain-platform) is designed to assist users in developing, testing, and deploying smart contracts -- including connecting to Hyperledger Fabric environments.

## Featured technology

- [Hyperledger Fabric ^v2.x](https://hyperledger-fabric.readthedocs.io) is a platform for distributed ledger solutions, underpinned by a modular architecture that delivers high degrees of confidentiality, resiliency, flexibility, and scalability.
- [Node.js](https://nodejs.org/en/) is an open source, cross-platform JavaScript run-time environment that executes server-side JavaScript code.
- [Express.js](https://expressjs.com/) is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- [Bootstrap](https://getbootstrap.com/) Bootstrap is an open source toolkit for developing with HTML, CSS, and JS.

## Running the application locally

Follow these steps to set up and run this code pattern.

### Prerequisites

You will need to follow the requirements for the project:

- [VSCode version 1.38.0 or greater](https://code.visualstudio.com)
- [Node v8.x or v10.x and npm v6.x or greater](https://nodejs.org/en/download/)
- [Docker version v17.06.2-ce or greater](https://www.docker.com/get-docker)
- [Docker Compose v1.14.0 or greater](https://docs.docker.com/compose/install/)
- Git
- cURL
- If you run this on windows, you will need docker desktop and WSL2

### Steps

1. [Clone the repo](#1-clone-the-repo)
2. [Install Fabric](#2-install-fabric)
3. [Install dependencies](#3-install-dependencies-for-chaincode-and-web-app)
4. [Setup network locally and deploy the smart contract](#4-setup-network-locally-and-deploy-the-smart-contract)
5. [Run the application](#5-run-the-application)

#### 1. Clone the repo

Clone this repository in a folder your choice:

```bash
git clone https://github.com/PhamVuThuNguyet/customer-loyalty-program-hyperledger-fabric-VSCode.git
cd customer-loyalty-program-hyperledger-fabric-VSCode
```

#### 2. Install Fabric

<b>After cloning the repo and cd into the main folder:</b>

- Extract the test-network.zip to the root directory.

```bash
sudo apt-get install unzip
unzip test-network.zip -d test-network
```

- Run below scripts to install prerequisites

```bash
./install-fabric.sh docker binaries
```

(install fabric images and binaries)

- If the binary installation failed, (usually it will say binaries not available to download), run this:

```bash
./bootstrap.sh -d -s
```

#### 3. Install dependencies for chaincode and web-app

```bash
cd ./contract/
npm install
```

```bash
cd ../web-app/
npm install
```

We also need to prepare environment variables.
Copy the `.env.dev` file to new `.env` file in web-app folder. Then change those values to match yours.

#### 4. Setup network locally and deploy the smart contract

- Cd into the root folder

```bash
cd ../
```

- Run:

```bash
./start.sh
```

- If you want to stop network, run:

```bash
./stop.sh
```

#### 5. Run the application

```bash
cd ./web-app/
npm start
```

## Intergrate Hyperledger Explorer

<h3>To run this tool, you must have Postgresql on your system. Follow <a href="https://www.cybertec-postgresql.com/en/postgresql-on-wsl2-for-windows-install-and-setup/">this link</a> to setup postgresql on Linux (or WSL)</h3>

<h3>Run postgresql</h3>
```bash
sudo service postgresql start
```
<h3>Make sure you have run postgresql and the test-network before do this</h3>
```bash
cd explorer
cp -rf ../test-network/organizations/ .
export EXPLORER_CONFIG_FILE_PATH=./config-ca.json
export EXPLORER_PROFILE_DIR_PATH=./connection-profile
export FABRIC_CRYPTO_PATH=./organizations
```

<h3>Now let's run the blockchain explorer</h3>
```bash
docker-compose up -d
```
You can login with account: exploreradmin (password: exploreradminpw)

If you want to stop it, run:

```bash
docker-compose down -v
```
## Integrate Fabric Operations Console
The console provides the following high level function:

- Ability to import and manage all Hyperledger Fabric Components from a single web console, no matter where they are located.
- Maintain complete control over identities, channels, and smart contracts.
- Join Peers to Channels and view channel membership as well as individual transactions and channel details.
- Register, view, delete, and re-enroll CA Users.
- View Ordering cluster and node information as well as view and modify consortium and channel membership.
- View and modify channel capabilities and ordering service parameters.
- Install and Instantiate chaincode.  Supports both 1.x and 2.x Lifecycle.
- View, Create, Import and Export Organizations and Identities.
- Role Based Access Control in UI to tightly control which Console users can perform which operations.

The console relies on [GRPC web](https://grpc.io/docs/platforms/web/) to allow GRPC based communication with Orderers and Peers via Node.js.  Management of Certificate Authorities is done via REST API and does not require a GRPC Web Instance.

For more Information see the [documentation for the current IBM production offerings](https://cloud.ibm.com/docs/blockchain-sw-252?topic=blockchain-sw-252-ibp-console-govern) which are driven by the code in this Lab proposal.

### High level architecture
<img src = "https://raw.githubusercontent.com/hyperledger-labs/fabric-operations-console/main/docs/images/architecture_hl.png"/>

### Running Fabric Operations Console

You can use the following steps to provision a network using Fabric test-network, add grpc-web proxy on that of that and import components into Console so that you can manage the test network.

#### Prerequisites
* zip
* jq
* docker
* docker-compose (V2)
* _[WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) (Windows only)_

#### Setup
Clone console repo into root folder(customer-loyalty-program-hyperledger-fabric-vscode)

`git clone https://github.com/hyperledger-labs/fabric-operations-console`

`cd fabric-operations-console`

<h3>Please make sure that you have already up the test-network before go to the next steps</h3>

#### Bring up console
- In fabric-operations-console\docker\docker-compose-grpc-web.yaml file, change all volume paths from ../fabric-samples/test-network/... to ../../test-network/...
- Then run: 
`./scripts/setupConsole.sh up`

#### Create zip file
Run the following command to create a zip of the console JSONs to match the network setup above

`./scripts/createAssets.sh`

#### Console setup
* Open browser to URL http://localhost:3000/
* Login with admin/password
* Change password

##### Import components into console
* Switch to "Settings" page 
* Click "Import"
* Select zip file ./workarea/console_assets.zip

##### Create Identities
* Switch to Nodes page and perform the following steps

###### ordererca
* Select CA "ordererca-local"
* Associate Identity
* Enter admin/adminpw for enroll id and secret
* Select the overflow menu (3 dots) against "ordererAdmin"
* Select "Enroll identity"
* Enter "ordererAdminpw" for Enroll secret
* Next
* Enter identity display name as "OrdererMSP Admin"
* Click "Add Identity to wallet"

###### org1ca
* Select CA "org1ca-local"
* Associate Identity
* Enter admin/adminpw for enroll id and secret
* Select the overflow menu (3 dots) against "org1admin"
* Select "Enroll identity"
* Enter "org1adminpw" for Enroll secret
* Next
* Enter identity display name as "Org1MSP Admin"
* Click "Add Identity to wallet"

###### org2ca
* Select CA "org2ca-local"
* Associate Identity
* Enter admin/adminpw for enroll id and secret
* Select the overflow menu (3 dots) against "org2admin"
* Select "Enroll identity"
* Enter "org2adminpw" for Enroll secret
* Next
* Enter identity display name as "Org2MSP Admin"
* Click "Add Identity to wallet"


##### Associate Identity
* Switch to Nodes page and perform the following steps
* Select peer "org1_peer1 - local"
* Associate Identity
* Select "Org1MSP Admin"

* Select peer "org2_peer1 - local"
* Associate Identity
* Select "Org2MSP Admin"

* Select orderer "orderer_local"
* Associate Identity
* Select "OrdererMSP Admin"

#### Enjoy!
You should be able to manage channels, Using 2.0 lifecycle to install, approve, commit smart contracts following the guide

#### Bring down network

`./scripts/setupConsole.sh down`


#### couchdb credentials (for console)
* URL - http://127.0.0.1:5985/_utils/
* Login - admin/password

## Links

- [Hyperledger Fabric Docs](http://hyperledger-fabric.readthedocs.io/en/latest/)
- [IBM Code Patterns for Blockchain](https://developer.ibm.com/patterns/category/blockchain/)

## License

This code pattern is licensed under the Apache Software License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1 (DCO)](https://developercertificate.org/) and the [Apache Software License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache Software License (ASL) FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
