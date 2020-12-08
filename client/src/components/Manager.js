import React from "react";
import SubastaForm from "./SubastaForm";
import SubastaABI from "../contracts/Subasta.json"

class Manager extends React.Component {

  state = {
    account: "",
    date: "",
    dataSubastas: null,
    subastas: [],
    stackId: null
  }

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentDidMount() {
    const { drizzleState } = this.props;
    this.sendSubasta = this.sendSubasta.bind(this);
    this.updateContracts();
    this.setState({ account: drizzleState.accounts[0] })
  }

  async updateContracts() {
    const { drizzle } = this.props;
    const contractManager = drizzle.contracts["ManagerSubastas"];
    const subastasAddress = await contractManager.methods.getContracts().call();
    subastasAddress.forEach(subasta => {
      this.addSubastaNueva(subasta);
    });
  }

  async addSubasta(time, account, name) {
    const subastaTemp = this.state.subastas;
    if (!subastaTemp.some((element) => element.name == name)) {
      const { drizzle } = this.props;
      const contractManager = drizzle.contracts["ManagerSubastas"];
      const stackId = await contractManager.methods.createContract(time, account, name).send({
        from: this.state.account
      });

      if (stackId.status) {
        this.updateContracts();
      }
      this.setState({ stackId });
    } else {
      alert("El nombre de la subasta ya esta registrado")
    }

  }

  async addSubastaNueva(_address) {
    const subastaTemp = this.state.subastas;
    if (!subastaTemp.some((element) => element.address == _address)) {
      const { drizzle } = this.props;
      const contractManager = drizzle.contracts["ManagerSubastas"];
      const valor = await contractManager.methods.getContractByAddress(_address).call();
      var contractConfig = {
        contractName: valor[0],
        web3Contract: new drizzle.web3.eth.Contract(SubastaABI.abi, _address)
      }
      try {
        drizzle.addContract(contractConfig)
        subastaTemp.push({ name: valor[0], address: _address, fechaCreacion: new Date() });
        this.setState({ subastas: subastaTemp });
      } catch (e) {
        console.log("ya existe");
        subastaTemp.push({ name: valor[0], address: _address, fechaCreacion: new Date() });
        this.setState({ subastas: subastaTemp });
      }
    }
  }

  getAllSubastas() {
    const { drizzle } = this.props;
    return this.state.subastas.map(subasta => {
      return (
        <div key={"div" + subasta.address} className="subastaItem">
          <label key={"key" + subasta.address}>direccion: {subasta.address} </label>
          <label key={"name" + subasta.address}>nombre: {subasta.name} </label>
          <input className="ok-button" type="button" value="Ver Subasta" onClick={() => this.sendSubasta(subasta)} />
        </div>);
    });
  }

  sendSubasta(subasta) {
    this.props.changeViewSubasta(subasta, true);
  }

  getAllAcounts() {
    const { drizzle, drizzleState } = this.props;
    const accountsArray = Object.values(drizzleState.accounts)
    return accountsArray.map(account => {
      return <option value={account} key={account} >{account}</option>
    });
  }


  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }


  render() {
    return (
      <div className="content">
        <div className="left">
          <SubastaForm drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} agregarSubasta={this.addSubasta.bind(this)} />
        </div>
        <div className="right">
          <h3>Lista de Subastas</h3>
          <div>
            {this.getAllSubastas()}
          </div>
        </div>
      </div>


    );
  }
}

export default Manager;