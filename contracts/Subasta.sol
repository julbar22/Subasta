pragma solidity >=0.4.25 <0.7.0;

contract Subasta {
    // Parámetros de la subasta. Los tiempos son
    // o timestamps estilo unix (segundos desde 1970-01-01)
    // o periodos de tiempo en segundos.
    address payable public beneficiary;
    uint256 public auctionStart;
    uint256 public biddingTime;

    // Estado actual de la subasta.
    address payable public highestBidder;
    uint256 public highestBid;

    // Fijado como true al final, no permite ningún cambio.
    bool public ended;

    // Eventos que serán emitidos al realizar algún cambio
    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    // Lo siguiente es lo que se conoce como un comentario natspec,
    // se identifican por las tres barras inclinadas.
    // Se mostrarán cuando se pregunte al usuario
    // si quiere confirmar la transacción.

    /// Crea una subasta sencilla con un periodo de pujas
    /// de `_biddingTime` segundos. El beneficiario de
    /// las pujas es la dirección `_beneficiary`.

    constructor(uint256 _biddingTime, address payable _beneficiary) public {
        beneficiary = _beneficiary;
        auctionStart = now;
        biddingTime = _biddingTime;
    }

    /// Puja en la subasta con el valor enviado
    /// en la misma transacción.
    /// El valor pujado sólo será devuelto
    /// si la puja no es ganadora.
    function bid() public payable {
        // No hacen falta argumentos, toda
        // la información necesaria es parte de
        // la transacción. La palabra payable
        // es necesaria para que la función pueda recibir Ether.

        // Revierte la llamada si el periodo
        // de pujas ha finalizado.
        require(now <= (auctionStart + biddingTime), "La subasta ha expirado");

        // Si la puja no es la más alta,
        // envía el dinero de vuelta.
        require(msg.value > highestBid, "La subasta debe ser mayor");

        if (highestBid != 0) {
            // Devolver el dinero usado
            highestBidder.send(highestBid);
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    /// Finaliza la subasta y envía la puja más alta al beneficiario.
    function auctionEnd() public {
        // Es una buena práctica estructurar las funciones que interactúan
        // con otros contratos (i.e. llaman a funciones o envían ether)
        // en tres fases:
        // 1. comprobación de las condiciones
        // 2. ejecución de las acciones (pudiendo cambiar las condiciones)
        // 3. interacción con otros contratos
        // Si estas fases se entremezclasen, otros contratos podrían
        // volver a llamar a este contrato y modificar el estado
        // o hacer que algunas partes (pago de ether) se ejecute multiples veces.
        // Si se llama a funciones internas que interactúan con otros contratos,
        // deben considerarse como interacciones con contratos externos.

        // 1. Condiciones
        require(now >= (auctionStart + biddingTime)); // la subasta aún no ha acabado
        require(!ended); // esta función ya ha sido llamada

        // 2. Ejecución
        ended = true;
        beneficiary.send(highestBid);
        emit AuctionEnded(highestBidder, highestBid);

    }
}
