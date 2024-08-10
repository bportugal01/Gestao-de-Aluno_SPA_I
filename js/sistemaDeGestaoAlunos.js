// sistemaDeGestaoAlunos.js
import { Aluno } from './aluno.js';

export class SistemaDeGestaoAlunos {
    constructor() {
        this.alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        this.indiceEditando = null;
        this.mainContent = document.getElementById('main-content');
        
        this.inicializar();
    }

    inicializar() {
        window.addEventListener('hashchange', () => this.lidarMudancaRota());
        this.lidarMudancaRota();
    }

    renderizarPaginaInicial() {
        this.mainContent.innerHTML = `
            <h2>Bem-vindo ao Sistema de Gestão de Alunos</h2>
            <p>Gerencie seus alunos de forma eficiente com esta SPA.</p>
        `;
    }

    renderizarPaginaCadastrar() {
        this.mainContent.innerHTML = `
            <section>
                <h2>${this.indiceEditando === null ? 'Adicionar Novo Aluno' : 'Editar Aluno'}</h2>
                <form id="form-aluno">
                    <input type="text" id="nome-aluno" placeholder="Nome Completo" required>
                    <input type="date" id="data-nascimento" placeholder="Data de Nascimento" required>
                    <input type="email" id="email-aluno" placeholder="Email" required>
                    <button type="submit">${this.indiceEditando === null ? 'Adicionar Aluno' : 'Atualizar Aluno'}</button>
                </form>
            </section>
        `;
        this.preencherFormulario();
        this.anexarEventoFormulario();
    }

    preencherFormulario() {
        if (this.indiceEditando !== null) {
            const aluno = this.alunos[this.indiceEditando];
            document.getElementById('nome-aluno').value = aluno.nome;
            document.getElementById('data-nascimento').value = aluno.dataNascimento;
            document.getElementById('email-aluno').value = aluno.email;
        } else {
            document.getElementById('nome-aluno').value = '';
            document.getElementById('data-nascimento').value = '';
            document.getElementById('email-aluno').value = '';
        }
    }

    renderizarPaginaConsultar() {
        this.mainContent.innerHTML = `
            <section>
                <h2>Consultar Alunos</h2>
                <table id="tabela-alunos">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Data de Nascimento</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="lista-alunos">
                        <!-- Dados dos alunos serão inseridos aqui -->
                    </tbody>
                </table>
            </section>
        `;
        this.renderizarListaAlunos();
    }

    renderizarListaAlunos() {
        const tabelaAlunos = document.getElementById('lista-alunos');
        tabelaAlunos.innerHTML = '';

        if (this.alunos.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 4; // Ocupa todas as colunas da tabela
            td.textContent = 'Não possui registro';
            td.style.textAlign = 'center'; // Centraliza o texto
            tr.appendChild(td);
            tabelaAlunos.appendChild(tr);
        } else {
            this.alunos.forEach((aluno, index) => {
                const tr = document.createElement('tr');

                const tdNome = document.createElement('td');
                tdNome.textContent = aluno.nome;
                tr.appendChild(tdNome);

                const tdEmail = document.createElement('td');
                tdEmail.textContent = aluno.email;
                tr.appendChild(tdEmail);

                const tdDataNascimento = document.createElement('td');
                tdDataNascimento.textContent = aluno.dataNascimento;
                tr.appendChild(tdDataNascimento);

                const tdAcoes = document.createElement('td');
                const botaoEditar = document.createElement('button');
                botaoEditar.textContent = 'Editar';
                botaoEditar.className = 'editar';
                botaoEditar.addEventListener('click', () => {
                    this.indiceEditando = index;
                    this.atualizarRota('cadastrar');
                });

                const botaoDeletar = document.createElement('button');
                botaoDeletar.textContent = 'Deletar';
                botaoDeletar.className = 'deletar';
                botaoDeletar.addEventListener('click', () => {
                    this.alunos.splice(index, 1);
                    this.atualizarLocalStorage();
                    this.renderizarListaAlunos();
                });

                tdAcoes.appendChild(botaoEditar);
                tdAcoes.appendChild(botaoDeletar);
                tr.appendChild(tdAcoes);

                tabelaAlunos.appendChild(tr);
            });
        }
    }

    anexarEventoFormulario() {
        const formularioAluno = document.getElementById('form-aluno');
        formularioAluno.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nomeAluno = document.getElementById('nome-aluno').value.trim();
            const dataNascimento = document.getElementById('data-nascimento').value;
            const emailAluno = document.getElementById('email-aluno').value.trim();
            
            if (this.indiceEditando === null) {
                this.alunos.push(new Aluno(nomeAluno, dataNascimento, emailAluno));
            } else {
                this.alunos[this.indiceEditando] = new Aluno(nomeAluno, dataNascimento, emailAluno);
                this.indiceEditando = null;
            }
            this.atualizarLocalStorage();
            this.atualizarRota('consultar');
        });
    }

    atualizarLocalStorage() {
        localStorage.setItem('alunos', JSON.stringify(this.alunos));
    }

    lidarMudancaRota() {
        const rota = window.location.hash.substring(1);
        switch (rota) {
            case 'cadastrar':
                this.renderizarPaginaCadastrar();
                break;
            case 'consultar':
                this.renderizarPaginaConsultar();
                break;
            case 'inicio':
            default:
                this.renderizarPaginaInicial();
                break;
        }
    }

    atualizarRota(rota) {
        window.location.hash = rota;
    }
}
