function cardAvistamento(avistamento){
return( 
<article className="cardAvistamento">  
    <h3>{avistamento.id}. {avistamento.titulo}</h3>
    <h4>{avistamento.Local}</h4>
    <h5>Data: {avistamento.data}</h5>
    <h5>Ultima atualização: {avistamento.atualizadoEm}</h5>                                                        {/* Talvez não seja relevante a ultima atualização? Só quando foi avistado*/}
    <p>{avistamento.descricao}</p>
    <h6>Criado em: {avistamento.criadoEm}</h6>
</article>
)}


function cardAlien(alien){
return( 
<article className="cardAlien">  
    <h3>{alien.id}. {alien.nome}</h3>
    <h4>Planeta: {alien.Planeta}</h4>
    <h4>Especie: {alien.Especie}</h4>
    <h6>Data: {alien.data}</h6>
    <p>{alien.Especiedescricao}</p>
    <h6>Criado em: {alien.criadoEm}</h6>

</article>
)}


function cardPlaneta(planeta){
return( 
<article className="cardPlaneta">  
    <h3>{planeta.id}. {planeta.nome}</h3>
    <h4>Galaxia: {planeta.galaxia}</h4>
    <h4>Clima: {planeta.clima}</h4>
    <h6>{planeta.habitavel? "Habitavel": "Nao-habitavel"}</h6>
    <p>{planeta.descricao}</p>
    <h6>Criado em: {planeta.criadoEm}</h6>
</article>
)}


function cardEvidencia(evidencia){
return( 
<article className="cardEvidencia">  
    <h3>ID avistamento: {evidencia.avistamentoID}. {evidencia.tipo}</h3>
    <h6>{evidencia.confiavel? "Fontes certificadas!": "Fontes não confiaveis..."}</h6>
    <p>⚠ Clique por sua propria conta e risco: {evidencia.url}</p>
    <p>{evidencia.descricao}</p>
    <h6>Criado em: {evidencia.criadoEm}</h6>
</article>
)}


export default cardAvistamento
export default cardAlien
export default cardPlaneta
export default cardEvidencia