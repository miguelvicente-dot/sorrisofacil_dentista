import sqlite3

NOME_BANCO = "clinica.db"

def conectar():
    """Abre uma conexão com o banco de dados."""
    conexao = sqlite3.connect(NOME_BANCO)
    conexao.row_factory = sqlite3.Row
    conexao.execute("PRAGMA foreign_keys = ON")
    return conexao

def inicializar_banco():
    """Cria as tabelas caso elas ainda não existam."""
    with conectar() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS pacientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                telefone TEXT NOT NULL,
                email TEXT,
                cpf TEXT UNIQUE,
                data_nascimento TEXT,
                endereco TEXT
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS consultas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                paciente_id INTEGER NOT NULL,
                data TEXT NOT NULL,
                horario TEXT NOT NULL,
                procedimento TEXT NOT NULL,
                observacoes TEXT,
                status TEXT NOT NULL DEFAULT 'Agendada',
                FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
                    ON DELETE CASCADE
            )
        """)
