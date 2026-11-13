const API = "/api";
let pacientes = [];

function mostrarAviso(mensagem) {
    const aviso = document.getElementById("aviso");
    aviso.textContent = mensagem;
    aviso.classList.add("mostrar");
    setTimeout(() => aviso.classList.remove("mostrar"), 2800);
}

async function requisicao(url, opcoes = {}) {
    const resposta = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...opcoes
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || "Ocorreu um erro.");
    return dados;
}

async function carregarPacientes() {
    pacientes = await requisicao(`${API}/pacientes`);
    const busca = document.getElementById("buscaPaciente").value.toLowerCase();
    const filtrados = pacientes.filter(p => p.nome.toLowerCase().includes(busca));
    const corpo = document.getElementById("listaPacientes");
    corpo.innerHTML = filtrados.length ? filtrados.map(p => `
        <tr>
            <td><strong>${escapar(p.nome)}</strong></td>
            <td>${escapar(p.telefone)}</td>
            <td>${escapar(p.email || "-")}</td>
            <td><button class="acao" onclick="prepararEdicao(${p.id})">Editar</button>
                <button class="acao excluir" onclick="apagarPaciente(${p.id})">Excluir</button></td>
        </tr>`).join("") : '<tr><td colspan="4" class="vazio">Nenhum paciente encontrado.</td></tr>';
    document.getElementById("totalPacientes").textContent = pacientes.length;
    const select = document.getElementById("consultaPaciente");
    select.innerHTML = '<option value="">Selecione um paciente</option>' +
        pacientes.map(p => `<option value="${p.id}">${escapar(p.nome)}</option>`).join("");
}

async function carregarConsultas() {
    const consultas = await requisicao(`${API}/consultas`);
    const corpo = document.getElementById("listaConsultas");
    corpo.innerHTML = consultas.length ? consultas.map(c => `
        <tr><td>${escapar(c.paciente_nome)}</td><td>${formatarData(c.data)}</td>
        <td>${escapar(c.horario)}</td><td>${escapar(c.procedimento)}</td>
        <td><button class="acao excluir" onclick="apagarConsulta(${c.id})">Excluir</button></td></tr>
    `).join("") : '<tr><td colspan="5" class="vazio">Nenhuma consulta agendada.</td></tr>';
    document.getElementById("totalConsultas").textContent = consultas.length;
}

function escapar(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, c => ({
        "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[c]));
}
function formatarData(data) {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}
function limparFormularioPaciente() {
    document.getElementById("formPaciente").reset();
    document.getElementById("pacienteId").value = "";
    document.getElementById("botaoSalvar").textContent = "Cadastrar paciente";
}
function prepararEdicao(id) {
    const p = pacientes.find(item => item.id === id);
    if (!p) return;
    document.getElementById("pacienteId").value = p.id;
    document.getElementById("nome").value = p.nome;
    document.getElementById("telefone").value = p.telefone;
    document.getElementById("email").value = p.email;
    document.getElementById("cpf").value = p.cpf;
    document.getElementById("data_nascimento").value = p.data_nascimento;
    document.getElementById("endereco").value = p.endereco;
    document.getElementById("botaoSalvar").textContent = "Salvar alterações";
    document.getElementById("pacientes").scrollIntoView({behavior:"smooth"});
}
async function apagarPaciente(id) {
    if (!confirm("Deseja excluir este paciente? As consultas dele também serão excluídas.")) return;
    try {
        await requisicao(`${API}/pacientes/${id}`, {method:"DELETE"});
        mostrarAviso("Paciente excluído.");
        await atualizarTela();
    } catch (erro) { mostrarAviso(erro.message); }
}
async function apagarConsulta(id) {
    if (!confirm("Deseja excluir esta consulta?")) return;
    try {
        await requisicao(`${API}/consultas/${id}`, {method:"DELETE"});
        mostrarAviso("Consulta excluída.");
        await carregarConsultas();
    } catch (erro) { mostrarAviso(erro.message); }
}
async function atualizarTela() {
    await carregarPacientes();
    await carregarConsultas();
}

document.getElementById("formPaciente").addEventListener("submit", async evento => {
    evento.preventDefault();
    const id = document.getElementById("pacienteId").value;
    const paciente = {
        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        cpf: document.getElementById("cpf").value,
        data_nascimento: document.getElementById("data_nascimento").value,
        endereco: document.getElementById("endereco").value
    };
    try {
        await requisicao(id ? `${API}/pacientes/${id}` : `${API}/pacientes`, {
            method: id ? "PUT" : "POST", body: JSON.stringify(paciente)
        });
        mostrarAviso(id ? "Cadastro atualizado!" : "Paciente cadastrado!");
        limparFormularioPaciente();
        await atualizarTela();
    } catch (erro) { mostrarAviso(erro.message); }
});

document.getElementById("formConsulta").addEventListener("submit", async evento => {
    evento.preventDefault();
    const consulta = {
        paciente_id: document.getElementById("consultaPaciente").value,
        data: document.getElementById("consultaData").value,
        horario: document.getElementById("consultaHorario").value,
        procedimento: document.getElementById("procedimento").value,
        observacoes: document.getElementById("observacoes").value
    };
    try {
        await requisicao(`${API}/consultas`, {method:"POST", body:JSON.stringify(consulta)});
        mostrarAviso("Consulta agendada!");
        evento.target.reset();
        await carregarConsultas();
    } catch (erro) { mostrarAviso(erro.message); }
});

document.getElementById("cancelarEdicao").addEventListener("click", limparFormularioPaciente);
document.getElementById("buscaPaciente").addEventListener("input", () => {
    const busca = document.getElementById("buscaPaciente").value.toLowerCase();
    const filtrados = pacientes.filter(p => p.nome.toLowerCase().includes(busca));
    document.getElementById("listaPacientes").innerHTML = filtrados.length ? filtrados.map(p => `
        <tr><td><strong>${escapar(p.nome)}</strong></td><td>${escapar(p.telefone)}</td>
        <td>${escapar(p.email || "-")}</td><td><button class="acao" onclick="prepararEdicao(${p.id})">Editar</button>
        <button class="acao excluir" onclick="apagarPaciente(${p.id})">Excluir</button></td></tr>
    `).join("") : '<tr><td colspan="4" class="vazio">Nenhum paciente encontrado.</td></tr>';
});

atualizarTela().catch(erro => mostrarAviso("Erro ao carregar: " + erro.message));
