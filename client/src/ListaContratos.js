import React from "react";

//Crear subastas
class ListaContratos extends React.Component {

  contractoAsignado = null;
  setCotract = (contrato) => {
    this.contractoAsignado = contrato;
    alert("aqui llega")
    this.props.asignacion(contrato);
  }
  getContratos = () => {
    const { contratos } = this.props;
    let items = []
    Object.keys(contratos).forEach(contrato => {
      //Nuevo componente lista de contrato
      items.push(<h3 onClick={()=>this.setCotract(contratos[contrato])} key={contrato}>{contrato}</h3>);
    });

    return items;
  }

  render() {

    return (
      <div className="listContract">
        {

          this.getContratos()
        }
      </div>
    )
  }
}

export default ListaContratos;