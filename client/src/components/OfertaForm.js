import React from "react";

class OfertaForm extends React.Component {

    state = {
        ether: "0",
        account: "",
        valida: true
    }

    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        const { drizzleState } = this.props;
        this.setState({ account: drizzleState.accounts[0] })
    }

    async addOferta(e) {
        e.preventDefault();
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts[this.props.nameContract];
        let ofertaValida = true;
        try {
            await contract.methods.bid().call({
                from: this.state.account,
                value: drizzle.web3.utils.toWei(this.state.ether, "ether")
            });
        } catch (err) {
            ofertaValida = false
        }

        if (ofertaValida) {
            contract.methods.bid.cacheSend({
                from: this.state.account,
                value: drizzle.web3.utils.toWei(this.state.ether, "ether")
            });
        }

        this.setState({ valida: ofertaValida })
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    getAllAcounts() {
        const { drizzle, drizzleState } = this.props;
        const accountsArray = Object.values(drizzleState.accounts)
        return accountsArray.map(account => {
            return <option value={account} key={account} >{account}</option>
        });
    }

    getError() {
        if (this.state.valida)
            return "";
        else
            return (
                <div>
                    <h3>La oferta no es valida, revisa los valores suministrados y la fecha de finalizacion de la subasta</h3>
                </div>
            )
    }


    render() {
        return (
            <div className="OfertaEther">
                <h3>Oferta con Ether</h3>
                <form className="formLinea " onSubmit={this.addOferta.bind(this)}>
                    <label > Seleccione la cuenta:
                     <select className='formLineaWide'name="account" value={this.state.account} onChange={this.handleInputChange}>
                            {this.getAllAcounts()}
                        </select>
                    </label>
                    <label > ingrese la cantidad de ether a ofertar:
                        <input className='formLineaWide'name="ether" type="text" value={this.state.ether} onChange={this.handleInputChange} placeholder="valor en ether"></input>
                    </label>
                    <input className="ok-button" type="submit" value="Enviar"></input>
                </form>
                {this.getError()}

            </div>
        );
    }
}

export default OfertaForm;