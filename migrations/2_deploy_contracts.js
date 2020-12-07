const Subasta = artifacts.require("Subasta");

module.exports = function(deployer) {
  deployer.deploy(Subasta);
};
