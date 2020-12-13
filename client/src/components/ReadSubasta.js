import React from "react";
import OfertaForm from "./OfertaForm"

class ReadSubasta extends React.Component {

  dateFinal = null;
  state = {
    dataTime: null,
    dataBeneficiario: null,
    dataHighestBidder: null,
    dataHighestBid: null,
    dataAuctionStart: null,
    dataEnded: null

  };

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts[this.props.nameContract];
    // let drizzle know we want to watch the `myString` method
    const dataTime = contract.methods["biddingTime"].cacheCall();
    const dataBeneficiario = contract.methods["beneficiary"].cacheCall();
    const dataHighestBidder = contract.methods["highestBidder"].cacheCall();
    const dataHighestBid = contract.methods["highestBid"].cacheCall();
    const dataAuctionStart = contract.methods["auctionStart"].cacheCall();
    const dataEnded = contract.methods["ended"].cacheCall();
    this.setState({ dataTime, dataBeneficiario, dataHighestBidder, dataHighestBid, dataAuctionStart, dataEnded });

  }

  isEnded(Subasta) {
    const finalizada = Subasta.ended[this.state.dataEnded];
    if (!finalizada) {
      if (this.dateFinal && this.dateFinal.getTime() < new Date().getTime()) {
        const { drizzle } = this.props;
        const contract = drizzle.contracts[this.props.nameContract];
        contract.methods.auctionEnd().send({from:this.props.drizzleState.accounts[0] });
        alert("La subasta se finalizara");
      }
    }
  }

  render() {
    // get the contract state from drizzleState
    const Subasta = this.props.drizzleState.contracts[this.props.nameContract];
    // using the saved `dataKey`, get the variable we're interested in
    const beneficiary = Subasta.beneficiary[this.state.dataBeneficiario];
    const highestBidder = Subasta.highestBidder[this.state.dataHighestBidder];
    const highestBid = Subasta.highestBid[this.state.dataHighestBid];
    this.isEnded(Subasta);
    if (!this.dateFinal) {
      const timeSubasta = Subasta.biddingTime[this.state.dataTime];
      const dateInicial = Subasta.auctionStart[this.state.dataAuctionStart];
      if (dateInicial) {
        const milisegundos = (parseInt(dateInicial.value) + parseInt(timeSubasta.value)) * 1000;
        this.dateFinal = new Date(milisegundos);
      }
    }

    return (
      <div className='contentInfo'>

        <div className="wide center">
          <OfertaForm drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} nameContract={this.props.nameContract} />
        </div>
        <div className="wide infoSubastaActual">
          <h3>Informacion de la subasta</h3>
          <label>Nombre: {this.props.nameContract}</label>
          <label>Descripción: {this.props.description}</label>
          <label>Fecha de cierre: {this.dateFinal && this.dateFinal.toString()}</label>
          <label>beneficiario:  {beneficiary && beneficiary.value}</label>
          <label>Mejor Postor:  {highestBidder && highestBidder.value}</label>
          <label>Valor mas alto:  {highestBid && highestBid.value}</label>
        </div>
      </div>

    );
  }
}

export default ReadSubasta;