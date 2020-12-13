const Subasta = artifacts.require("ManagerSubastas");

module.exports = function(deployer) {
  deployer.deploy(Subasta);
};
