import { useEffect, useState } from 'react';
import { atualizarPessoa, criarPessoa, deletarPessoa, fetchPessoas } from '../services/api';

function PessoaList() {
    const [pessoas, setPessoas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editPessoa, setEditPessoa] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function carregarPessoas() {
            setLoading(true);
            try {
                const data = await fetchPessoas();
                setPessoas(data);
            } catch (error) {
                alert('Erro ao carregar pessoas');
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        carregarPessoas();
    }, []);

    function abrirFormulario(pessoa = null) {
        setEditPessoa(pessoa);
        setShowForm(true);
    }

    function fecharFormulario() {
        setEditPessoa(null);
        setShowForm(false);
    }

    async function salvarPessoa(pessoa) {
        try {
            if (pessoa.id) {
                const atualizado = await atualizarPessoa(pessoa.id, pessoa);
                setPessoas(pessoas.map(p => (p.id === atualizado.id ? atualizado : p)));
            } else {
                const criado = await criarPessoa(pessoa);
                setPessoas([...pessoas, criado]);
            }
            fecharFormulario();
        } catch (error) {
            alert('Erro ao salvar pessoa');
            console.error(error);
        }
    }

    async function handleDelete(id) {
        try {
            await deletarPessoa(id);
            setPessoas(pessoas.filter(p => p.id !== id));
        } catch (error) {
            alert('Erro ao deletar pessoa');
            console.error(error);
        }
    }

    return (
        <div className="app-container">
            <h2>Cadastro de Pessoas</h2>

            <button className="btn btn-primary mb-3" onClick={() => abrirFormulario()}>
                Nova Pessoa
            </button>

            {loading ? (
                <p>Carregando pessoas...</p>
            ) : (
                <>
                    {showForm && (
                        <PessoaForm pessoa={editPessoa} onSalvar={salvarPessoa} onCancelar={fecharFormulario} />
                    )}

                    <table className="table-custom-dark">
                        <thead>
                            <tr>
                                <th>ID</th><th>Nome</th><th>E-mail</th><th>Idade</th><th>Nascimento</th><th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pessoas.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.nome}</td>
                                    <td>{p.email}</td>
                                    <td>{p.idade}</td>
                                    <td>{p.dataNascimento}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => abrirFormulario(p)}>Editar</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Deletar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

function PessoaForm({ pessoa, onSalvar, onCancelar }) {
    const [nome, setNome] = useState(pessoa?.nome || '');
    const [email, setEmail] = useState(pessoa?.email || '');
    const [idade, setIdade] = useState(pessoa?.idade || '');

    useEffect(() => {
        setNome(pessoa?.nome || '');
        setEmail(pessoa?.email || '');
        setIdade(pessoa?.idade || '');
    }, [pessoa]);

    function handleSubmit(e) {
        e.preventDefault();
        onSalvar({ ...pessoa, nome, email, idade: Number(idade) });
    }

    return (
        <form onSubmit={handleSubmit} className="mt-3">
            <div className="mb-2">
                <label>Nome:</label>
                <input className="form-control" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
            <div className="mb-2">
                <label>E-mail:</label>
                <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="mb-2">
                <label>Idade:</label>
                <input className="form-control" type="number" value={idade} onChange={e => setIdade(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-success me-2">Salvar</button>
            <button type="button" className="btn btn-secondary" onClick={onCancelar}>Cancelar</button>
        </form>
    );
}

export default PessoaList;
