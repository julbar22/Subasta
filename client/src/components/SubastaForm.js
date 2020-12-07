import React from "react";

class SubastaForm extends React.Component {

  state = {
    account: "",
    date: ""
  }

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    const { drizzleState } = this.props;
    this.setState({ account: drizzleState.accounts[0] })
  }

  addSubasta(e) {
    e.preventDefault();
    //lo estoy usando como segundos de la subasta
    const { drizzle } = this.props;
    const contract = drizzle.contracts["Subasta"];
    const dateFinal= new Date(this.state.date);
    const dateActual = new Date();
    const differencia= (dateFinal.getTime()-dateActual.getTime())/1000;
    const valueFinal=Math.ceil(differencia)
    console.log(valueFinal)
    const stackId = contract.methods.SimpleAuction.cacheSend(valueFinal, this.state.account, {
      from: this.state.account
    });
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
      <div className="CreateContract">
        <h3>Crea tu propia subasta</h3>
        <form className="formLinea" onSubmit={this.addSubasta.bind(this)}>
          <label> Seleccione la cuenta:
          <select name="account" value={this.state.account} onChange={this.handleInputChange}>
              {this.getAllAcounts()}
            </select>
          </label>
          <label> fecha de cierre de la subasta:
          <input name="date" type="datetime-local" value={this.state.date} onChange={this.handleInputChange} placeholder="tiempo en segundos"></input>
          </label>
          <input className="ok-button" type="submit" value="Enviar"></input>
        </form>
      </div>
    );
  }
}

export default SubastaForm;