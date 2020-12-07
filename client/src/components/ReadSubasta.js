import React from "react";
import OfertaForm from "./OfertaForm"

class ReadSubasta extends React.Component {

  state = {
    dataTime: null,
    dataBeneficiario: null,
    dataHighestBidder: null,
    dataHighestBid: null,
    dataAuctionStart: null

  };

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Subasta;
    // let drizzle know we want to watch the `myString` method
    const dataTime = contract.methods["biddingTime"].cacheCall();
    const dataBeneficiario = contract.methods["beneficiary"].cacheCall();
    const dataHighestBidder = contract.methods["highestBidder"].cacheCall();
    const dataHighestBid = contract.methods["highestBid"].cacheCall();
    const dataAuctionStart = contract.methods["auctionStart"].cacheCall();
    this.setState({ dataTime, dataBeneficiario, dataHighestBidder, dataHighestBid, dataAuctionStart });

  }

  render() {
    // get the contract state from drizzleState
    const { Subasta } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    let dateFinal = null;
    const timeSubasta = Subasta.biddingTime[this.state.dataTime];
    const dateInicial = Subasta.auctionStart[this.state.dataAuctionStart];
    const beneficiary = Subasta.beneficiary[this.state.dataBeneficiario];
    const highestBidder = Subasta.highestBidder[this.state.dataHighestBidder];
    const highestBid = Subasta.highestBid[this.state.dataHighestBid];
    if (dateInicial) {
      const milisegundos = (parseInt(dateInicial.value) + parseInt(timeSubasta.value)) * 1000;
      dateFinal = new Date(milisegundos);
    }

    return (
      <div>
        <div className="infoSubastaActual">
          <h3>Informacion de la subasta</h3>
          <label>Fecha de cierre: {dateFinal && dateFinal.toString()}</label>
          <label>beneficiario:  {beneficiary && beneficiary.value}</label>
          <label>Mejor Postor:  {highestBidder && highestBidder.value}</label>
          <label>Valor mas alto:  {highestBid && highestBid.value}</label>
        </div>
        <div>
          <OfertaForm drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
        </div>
      </div>

    );
  }
}

export default ReadSubasta;