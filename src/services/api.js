const URL = 'http://localhost:8080/api';

export async function fetchPessoas() {
    try {
        const response = await fetch(`${URL}/pessoas`);
        if (!response.ok) throw new Error('Erro ao buscar pessoas');
        return await response.json();
    } catch (error) {
        console.error('fetchPessoas:', error);
        return [];
    }
}

export async function criarPessoa(pessoa) {
    try {
        const response = await fetch(`${URL}/pessoas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pessoa)
        });
        if (!response.ok) throw new Error('Erro ao criar pessoa');
        return await response.json();
    } catch (error) {
        console.error('criarPessoa:', error);
        throw error;
    }
}

export async function atualizarPessoa(id, pessoa) {
    try {
        const response = await fetch(`${URL}/pessoas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pessoa)
        });
        if (!response.ok) throw new Error('Erro ao atualizar pessoa');
        return await response.json();
    } catch (error) {
        console.error('atualizarPessoa:', error);
        throw error;
    }
}

export async function deletarPessoa(id) {
    try {
        const response = await fetch(`${URL}/pessoas/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Erro ao deletar pessoa');
        return true;
    } catch (error) {
        console.error('deletarPessoa:', error);
        throw error;
    }
}