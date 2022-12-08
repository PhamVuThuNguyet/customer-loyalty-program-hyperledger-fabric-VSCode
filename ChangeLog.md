
# Change Log
All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).
 
## [[1.0.0]](https://github.com/PhamVuThuNguyet/customer-loyalty-program-hyperledger-fabric-VSCode/compare/v1.0.0-alpha...v1.0.0-rc) - 2022-12-08
### Added
* Setup CI/CD 
* Authentication for users 
* Unit test for API
* Add api to post and get products
* Add function to get product list by partner on member side 
* Add start and stop scripts to up network and deploy chaincode easier 

### Changed
* Rewrite network.js file to make it work with Fabric latest version (v2.5)
* Update initledger function in chaincode to fix error that clean state when server is downed
* Change exchange rate when redeem points
* Update UI
* Reformat the folder's structure
* Update environment variables to clean code