// pages/Home.jsx - Versão adaptada para API sem endpoints individuais
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import FormPlaneta from "../components/forms/FormPlaneta";
import FormAlien from "../components/forms/FormAlien";
import FormAvistamento from "../components/forms/FormAvistamento";

const ENTIDADES = {
  PLANETA: {
    nome: "Planeta",
    nomePlural: "Planetas",
    url: "/planetas",
    formComponent: FormPlaneta,
    formPropsName: "formPlaneta",
    setFormPropsName: "setFormPlaneta",
    estadoInicial: {
      nome: "",
      galaxia: "",
      clima: "",
      habitavel: false,
      descricao: "",
    },
    // Função para encontrar um item por ID na lista
    encontrarPorId: (lista, id) => lista.find(item => item.id === id)
  },
  ALIEN: {
    nome: "Alien",
    nomePlural: "Aliens",
    url: "/aliens",
    formComponent: FormAlien,
    formPropsName: "formAlien",
    setFormPropsName: "setFormAlien",
    estadoInicial: {
      nome: "",
      especie: "",
      planeta: "",
      periculosidade: 1,
      descricao: "",
    },
    encontrarPorId: (lista, id) => lista.find(item => item.id === id)
  },
  AVISTAMENTO: {
    nome: "Avistamento",
    nomePlural: "Avistamentos",
    url: "/avistamentos",
    formComponent: FormAvistamento,
    formPropsName: "formAvistamento",
    setFormPropsName: "setFormAvistamento",
    estadoInicial: {
      titulo: "",
      local: "",
      descricao: "",
      data: "",
      nivelMedo: 1
    },
    encontrarPorId: (lista, id) => lista.find(item => item.id === id)
  }
};

function Home() {
  const { estaAutenticado, nomeUsuario } = useAuth();
  const [mensagemGlobal, setMensagemGlobal] = useState("");
  const [entidadeAtiva, setEntidadeAtiva] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalRemoverAberto, setModalRemoverAberto] = useState(false);
  const [entidadeEditando, setEntidadeEditando] = useState(null);
  
  // Estados para armazenar as listas completas de cada entidade
  const [listaPlanetas, setListaPlanetas] = useState([]);
  const [listaAliens, setListaAliens] = useState([]);
  const [listaAvistamentos, setListaAvistamentos] = useState([]);
  
  // Estados separados para cada tipo de formulário
  const [formPlaneta, setFormPlaneta] = useState(ENTIDADES.PLANETA.estadoInicial);
  const [formAlien, setFormAlien] = useState(ENTIDADES.ALIEN.estadoInicial);
  const [formAvistamento, setFormAvistamento] = useState(ENTIDADES.AVISTAMENTO.estadoInicial);
  
  const [mensagemEdicao, setMensagemEdicao] = useState("");
  const [mensagemRemocao, setMensagemRemocao] = useState("");
  const [mensagemCadastro, setMensagemCadastro] = useState("");

  // Função para carregar todas as listas ao iniciar
  useEffect(() => {
    if (estaAutenticado) {
      carregarTodasListas();
    }
  }, [estaAutenticado]);

  async function carregarTodasListas() {
    await Promise.all([
      carregarLista('PLANETA'),
      carregarLista('ALIEN'),
      carregarLista('AVISTAMENTO')
    ]);
  }

  async function carregarLista(entidade) {
    const config = ENTIDADES[entidade];
    try {
      const resposta = await api.get(config.url);
      switch(entidade) {
        case 'PLANETA':
          setListaPlanetas(resposta.data);
          break;
        case 'ALIEN':
          setListaAliens(resposta.data);
          break;
        case 'AVISTAMENTO':
          setListaAvistamentos(resposta.data);
          break;
      }
    } catch (error) {
      console.error(`Erro ao carregar ${config.nomePlural}:`, error);
    }
  }

  function getLista(entidade) {
    switch(entidade) {
      case 'PLANETA': return listaPlanetas;
      case 'ALIEN': return listaAliens;
      case 'AVISTAMENTO': return listaAvistamentos;
      default: return [];
    }
  }

  function setLista(entidade, novaLista) {
    switch(entidade) {
      case 'PLANETA':
        setListaPlanetas(novaLista);
        break;
      case 'ALIEN':
        setListaAliens(novaLista);
        break;
      case 'AVISTAMENTO':
        setListaAvistamentos(novaLista);
        break;
    }
  }

  function getFormState(entidade) {
    switch(entidade) {
      case 'PLANETA': return { form: formPlaneta, setForm: setFormPlaneta };
      case 'ALIEN': return { form: formAlien, setForm: setFormAlien };
      case 'AVISTAMENTO': return { form: formAvistamento, setForm: setFormAvistamento };
      default: return { form: {}, setForm: () => {} };
    }
  }

  function limparFormulario() {
    if (entidadeAtiva) {
      const { setForm } = getFormState(entidadeAtiva);
      setForm({ ...ENTIDADES[entidadeAtiva].estadoInicial });
    }
    setEntidadeEditando(null);
  }

  function fecharModal() {
    setModalAberto(false);
    setModalEdicaoAberto(false);
    setModalRemoverAberto(false);
    limparFormulario();
    setMensagemEdicao("");
    setMensagemRemocao("");
    setMensagemCadastro("");
  }

  function abrirModalCadastro(entidade) {
    setEntidadeAtiva(entidade);
    const { setForm } = getFormState(entidade);
    setForm({ ...ENTIDADES[entidade].estadoInicial });
    setMensagemCadastro("");
    setModalAberto(true);
  }

  function abrirModalEdicao(entidade) {
    setEntidadeAtiva(entidade);
    setMensagemEdicao("");
    setModalEdicaoAberto(true);
  }

  function abrirModalRemover(entidade) {
    setEntidadeAtiva(entidade);
    setMensagemRemocao("");
    setModalRemoverAberto(true);
  }

  // Busca a entidade na lista local
  function buscarEntidadeNaLista(id, entidade, setMensagemLocal) {
    const config = ENTIDADES[entidade];
    const lista = getLista(entidade);
    const entidadeEncontrada = config.encontrarPorId(lista, id);
    
    if (!entidadeEncontrada) {
      setMensagemLocal(`❌ ${config.nome} com ID ${id} não foi encontrado(a) na lista.`);
      return null;
    }
    
    return entidadeEncontrada;
  }

  async function handleEditarEntidade(event) {
    event.preventDefault();
    
    const idInput = document.getElementById(`${entidadeAtiva}-id-editar`);
    const id = parseInt(idInput.value);
    const config = ENTIDADES[entidadeAtiva];
    
    if (!id || isNaN(id)) {
      setMensagemEdicao("❌ Por favor, informe um ID válido.");
      return;
    }

    setMensagemEdicao(`🔍 Buscando ${config.nome} na lista...`);
    
    // Busca na lista local
    const entidadeExistente = buscarEntidadeNaLista(id, entidadeAtiva, setMensagemEdicao);
    
    if (!entidadeExistente) {
      return;
    }

    setEntidadeEditando(entidadeExistente);
    
    // Preenche o formulário correto com os dados existentes
    const { setForm } = getFormState(entidadeAtiva);
    const novoForm = {};
    Object.keys(config.estadoInicial).forEach(key => {
      novoForm[key] = entidadeExistente[key] !== undefined ? entidadeExistente[key] : config.estadoInicial[key];
    });
    setForm(novoForm);
    
    setMensagemEdicao(`✅ ${config.nome} encontrado(a)! Redirecionando...`);
    
    setTimeout(() => {
      setModalEdicaoAberto(false);
      setMensagemCadastro("");
      setModalAberto(true);
    }, 1000);
  }

  async function handleRemoverEntidade(event) {
    event.preventDefault();
    
    const idInput = document.getElementById(`${entidadeAtiva}-id-remover`);
    const id = parseInt(idInput.value);
    const config = ENTIDADES[entidadeAtiva];
    
    if (!id || isNaN(id)) {
      setMensagemRemocao("❌ Por favor, informe um ID válido.");
      return;
    }

    setMensagemRemocao(`🔍 Verificando ${config.nome} na lista...`);
    
    // Busca na lista local
    const entidadeExistente = buscarEntidadeNaLista(id, entidadeAtiva, setMensagemRemocao);
    
    if (!entidadeExistente) {
      return;
    }

    const nomeExibicao = entidadeExistente.nome || entidadeExistente.titulo || `ID ${id}`;
    
    if (!window.confirm(`Tem certeza que deseja deletar ${config.nome} "${nomeExibicao}" (ID: ${id})?`)) {
      setMensagemRemocao("");
      return;
    }

    setMensagemRemocao(`🗑️ Removendo ${config.nome} da lista local...`);
    
    // Remove da lista local
    const listaAtual = getLista(entidadeAtiva);
    const novaLista = listaAtual.filter(item => item.id !== id);
    setLista(entidadeAtiva, novaLista);
    
    setMensagemRemocao(`✅ ${config.nome} "${nomeExibicao}" removido(a) da lista com sucesso!`);
    setTimeout(() => {
      fecharModal();
      setMensagemGlobal(`✅ ${config.nome} removido(a) da lista com sucesso!`);
      setTimeout(() => setMensagemGlobal(""), 3000);
    }, 1500);
  }

  async function cadastrarEntidade(event) {
    event.preventDefault();
    const config = ENTIDADES[entidadeAtiva];
    const { form } = getFormState(entidadeAtiva);
    setMensagemCadastro("📤 Enviando...");

    try {
      const resposta = await api.post(config.url, form);
      limparFormulario();
      
      // Adiciona o novo item à lista local
      const listaAtual = getLista(entidadeAtiva);
      setLista(entidadeAtiva, [...listaAtual, resposta.data]);
      
      const nomeEntidade = resposta.data.nome || resposta.data.titulo || "entidade";
      setMensagemCadastro(`✅ ${config.nome} "${nomeEntidade}" cadastrado(a) com sucesso! (ID: ${resposta.data.id})`);
      setTimeout(() => {
        fecharModal();
        setMensagemGlobal(`✅ ${config.nome} cadastrado(a) com sucesso!`);
        setTimeout(() => setMensagemGlobal(""), 3000);
      }, 1500);
    } catch (error) {
      console.error(`Erro ao cadastrar ${config.nome}:`, error);
      setMensagemCadastro(`❌ Erro ao cadastrar ${config.nome}. Verifique os dados e tente novamente.`);
    }
  }

  async function salvarEdicaoEntidade(event) {
    event.preventDefault();
    const config = ENTIDADES[entidadeAtiva];
    const { form } = getFormState(entidadeAtiva);
    setMensagemCadastro("💾 Salvando alterações...");

    if (!entidadeEditando) {
      setMensagemCadastro(`❌ Erro: Nenhum(a) ${config.nome} selecionado(a) para edição.`);
      return;
    }

    try {
      // Tenta fazer PUT na API (se disponível)
      const resposta = await api.put(`${config.url}/${entidadeEditando.id}`, form);
      
      // Atualiza na lista local
      const listaAtual = getLista(entidadeAtiva);
      const novaLista = listaAtual.map(item => 
        item.id === entidadeEditando.id ? resposta.data : item
      );
      setLista(entidadeAtiva, novaLista);
      
      limparFormulario();
      const nomeEntidade = resposta.data.nome || resposta.data.titulo || "entidade";
      setMensagemCadastro(`✅ ${config.nome} "${nomeEntidade}" editado(a) com sucesso!`);
      setTimeout(() => {
        fecharModal();
        setMensagemGlobal(`✅ ${config.nome} editado(a) com sucesso!`);
        setTimeout(() => setMensagemGlobal(""), 3000);
      }, 1500);
    } catch (error) {
      console.error(`Erro ao editar ${config.nome}:`, error);
      
      // Se o PUT falhar, ainda assim atualiza localmente
      setMensagemCadastro(`⚠️ Atualizando localmente, mas erro na API.`);
      
      // Atualiza localmente mesmo com erro na API
      const listaAtual = getLista(entidadeAtiva);
      const novaLista = listaAtual.map(item => 
        item.id === entidadeEditando.id ? { ...item, ...form } : item
      );
      setLista(entidadeAtiva, novaLista);
      
      setTimeout(() => {
        fecharModal();
        setMensagemGlobal(`⚠️ ${config.nome} atualizado localmente, mas houve erro na API.`);
        setTimeout(() => setMensagemGlobal(""), 3000);
      }, 1500);
    }
  }

  const getCurrentFormComponent = () => {
    if (!entidadeAtiva) return null;
    return ENTIDADES[entidadeAtiva].formComponent;
  };

  const getCurrentFormProps = () => {
    if (!entidadeAtiva) return {};
    const { form, setForm } = getFormState(entidadeAtiva);
    const config = ENTIDADES[entidadeAtiva];
    
    return {
      [config.formPropsName]: form,
      [config.setFormPropsName]: setForm
    };
  };

  const FormComponent = getCurrentFormComponent();
  const formProps = getCurrentFormProps();

  return (
    <section className="home-container">
      <h1>Bem-vindo à Home</h1>
      
      {nomeUsuario && <p className="usuario-logado">Olá, {nomeUsuario}!</p>}

      {mensagemGlobal && <div className="mensagem-global">{mensagemGlobal}</div>}

      {estaAutenticado && (
        <div className="admin-section">
          <h2>🗺️ Gerenciamento do Catálogo</h2>
          <p className="admin-descricao">
            Utilize os botões abaixo para gerenciar planetas, aliens e avistamentos.
          </p>

          {/* Informação sobre quantos itens em cada lista */}
          <div className="info-listas">
            <p>📊 Planetas: {listaPlanetas.length} | 👽 Aliens: {listaAliens.length} | 🛸 Avistamentos: {listaAvistamentos.length}</p>
            <button onClick={carregarTodasListas} className="btn-recargar">🔄 Recarregar Listas</button>
          </div>

          <div className="entidade-section">
            <h3>🪐 Planetas</h3>
            <div className="botoes-gerenciamento">
              <button className="btn-adicionar" onClick={() => abrirModalCadastro('PLANETA')} type="button">➕ Adicionar</button>
              <button className="btn-editar" onClick={() => abrirModalEdicao('PLANETA')} type="button">✏️ Editar</button>
              <button className="btn-remover" onClick={() => abrirModalRemover('PLANETA')} type="button">🗑️ Remover</button>
            </div>
          </div>

          <div className="entidade-section">
            <h3>👽 Aliens</h3>
            <div className="botoes-gerenciamento">
              <button className="btn-adicionar" onClick={() => abrirModalCadastro('ALIEN')} type="button">➕ Adicionar</button>
              <button className="btn-editar" onClick={() => abrirModalEdicao('ALIEN')} type="button">✏️ Editar</button>
              <button className="btn-remover" onClick={() => abrirModalRemover('ALIEN')} type="button">🗑️ Remover</button>
            </div>
          </div>

          <div className="entidade-section">
            <h3>🛸 Avistamentos</h3>
            <div className="botoes-gerenciamento">
              <button className="btn-adicionar" onClick={() => abrirModalCadastro('AVISTAMENTO')} type="button">➕ Adicionar</button>
              <button className="btn-editar" onClick={() => abrirModalEdicao('AVISTAMENTO')} type="button">✏️ Editar</button>
              <button className="btn-remover" onClick={() => abrirModalRemover('AVISTAMENTO')} type="button">🗑️ Remover</button>
            </div>
          </div>

          {/* Modal de cadastro/edição */}
          {modalAberto && FormComponent && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>{entidadeEditando ? `Editar ${ENTIDADES[entidadeAtiva].nome}` : `Cadastrar ${ENTIDADES[entidadeAtiva].nome}`}</h2>
                
                {mensagemCadastro && (
                  <div className={`mensagem-modal ${mensagemCadastro.includes('✅') ? 'success' : mensagemCadastro.includes('⚠️') ? 'warning' : 'error'}`}>
                    {mensagemCadastro}
                  </div>
                )}
                
                <FormComponent
                  cadastrarPlaneta={entidadeEditando ? salvarEdicaoEntidade : cadastrarEntidade}
                  fecharModal={fecharModal}
                  {...formProps}
                />
              </div>
            </div>
          )}

          {/* Modal para informar ID da edição */}
          {modalEdicaoAberto && (
            <div className="modal-overlay">
              <div className="modal-content modal-pequeno">
                <h2>✏️ Editar {ENTIDADES[entidadeAtiva]?.nome}</h2>
                
                {mensagemEdicao && (
                  <div className={`mensagem-modal ${mensagemEdicao.includes('✅') ? 'success' : mensagemEdicao.includes('❌') ? 'error' : 'info'}`}>
                    {mensagemEdicao}
                  </div>
                )}
                
                <form onSubmit={handleEditarEntidade}>
                  <div className="form-group">
                    <label htmlFor={`${entidadeAtiva}-id-editar`}>
                      ID do {ENTIDADES[entidadeAtiva]?.nome}:
                    </label>
                    <input
                      type="number"
                      id={`${entidadeAtiva}-id-editar`}
                      name="id"
                      placeholder={`Digite o ID do ${ENTIDADES[entidadeAtiva]?.nome}`}
                      required
                      min="1"
                      step="1"
                    />
                    <small>Digite o número do ID que deseja editar</small>
                  </div>
                  <div className="modal-botoes">
                    <button type="submit" className="btn-confirmar">
                      Buscar {ENTIDADES[entidadeAtiva]?.nome}
                    </button>
                    <button type="button" onClick={fecharModal} className="btn-cancelar">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal para informar ID da remoção */}
          {modalRemoverAberto && (
            <div className="modal-overlay">
              <div className="modal-content modal-pequeno">
                <h2>🗑️ Remover {ENTIDADES[entidadeAtiva]?.nome}</h2>
                
                {mensagemRemocao && (
                  <div className={`mensagem-modal ${mensagemRemocao.includes('✅') ? 'success' : mensagemRemocao.includes('❌') ? 'error' : 'info'}`}>
                    {mensagemRemocao}
                  </div>
                )}
                
                <form onSubmit={handleRemoverEntidade}>
                  <div className="form-group">
                    <label htmlFor={`${entidadeAtiva}-id-remover`}>
                      ID do {ENTIDADES[entidadeAtiva]?.nome}:
                    </label>
                    <input
                      type="number"
                      id={`${entidadeAtiva}-id-remover`}
                      name="id"
                      placeholder={`Digite o ID do ${ENTIDADES[entidadeAtiva]?.nome}`}
                      required
                      min="1"
                      step="1"
                    />
                    <small>Digite o número do ID que deseja remover</small>
                  </div>
                  <div className="modal-botoes">
                    <button type="submit" className="btn-confirmar">
                      Confirmar Remoção
                    </button>
                    <button type="button" onClick={fecharModal} className="btn-cancelar">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {!estaAutenticado && (
        <div className="public-content">
          <h2>🌌 Explore o Universo Alienígena</h2>
          <p>
            Faça login para acessar recursos exclusivos de gerenciamento!
          </p>
          <div className="login-prompt">
            <a href="/login" className="btn-login">Fazer Login</a>
            <a href="/cadastro" className="btn-cadastro">Cadastrar-se</a>
          </div>
        </div>
      )}

      <style jsx>{`
        .info-listas {
          background-color: #e3f2fd;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .btn-recargar {
          background-color: #ff9800;
          color: white;
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .btn-recargar:hover {
          background-color: #f57c00;
        }
        
        .entidade-section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        
        .entidade-section h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #333;
        }
        
        .botoes-gerenciamento {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .btn-adicionar {
          background-color: #4CAF50;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .btn-editar {
          background-color: #2196F3;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .btn-remover {
          background-color: #f44336;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .btn-adicionar:hover { background-color: #45a049; }
        .btn-editar:hover { background-color: #0b7dda; }
        .btn-remover:hover { background-color: #da190b; }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .modal-pequeno {
          max-width: 400px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .form-group input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .form-group small {
          display: block;
          margin-top: 5px;
          color: #666;
          font-size: 12px;
        }
        
        .modal-botoes {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }
        
        .btn-confirmar {
          background-color: #4CAF50;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .btn-cancelar {
          background-color: #f44336;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .mensagem-global {
          margin-top: 20px;
          padding: 10px;
          border-radius: 4px;
          background-color: #e3f2fd;
          color: #1976d2;
          text-align: center;
          animation: fadeOut 3s ease-in-out forwards;
        }
        
        .mensagem-modal {
          margin-bottom: 15px;
          padding: 10px;
          border-radius: 4px;
          text-align: center;
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .mensagem-modal.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .mensagem-modal.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .mensagem-modal.warning {
          background-color: #fff3cd;
          color: #856404;
          border: 1px solid #ffeeba;
        }
        
        .mensagem-modal.info {
          background-color: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }
        
        .admin-section {
          margin-top: 20px;
        }
        
        .public-content {
          text-align: center;
          margin-top: 50px;
        }
        
        .login-prompt {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 20px;
        }
        
        .btn-login, .btn-cadastro {
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
        }
        
        .btn-login {
          background-color: #4CAF50;
          color: white;
        }
        
        .btn-cadastro {
          background-color: #2196F3;
          color: white;
        }
      `}</style>
    </section>
  );
}

export default Home;