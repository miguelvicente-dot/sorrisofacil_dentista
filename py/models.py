class Paciente:
    """Representa uma pessoa atendida pela clínica."""

    def __init__(self, nome, telefone, email="", cpf="", data_nascimento="", endereco="", id=None):
        self.id = id
        self.nome = nome
        self.telefone = telefone
        self.email = email
        self.cpf = cpf
        self.data_nascimento = data_nascimento
        self.endereco = endereco

    def para_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "telefone": self.telefone,
            "email": self.email,
            "cpf": self.cpf,
            "data_nascimento": self.data_nascimento,
            "endereco": self.endereco
        }


class Consulta:
    """Representa uma consulta marcada para um paciente."""

    def __init__(self, paciente_id, data, horario, procedimento, observacoes="", status="Agendada", id=None):
        self.id = id
        self.paciente_id = paciente_id
        self.data = data
        self.horario = horario
        self.procedimento = procedimento
        self.observacoes = observacoes
        self.status = status

    def para_dict(self):
        return {
            "id": self.id,
            "paciente_id": self.paciente_id,
            "data": self.data,
            "horario": self.horario,
            "procedimento": self.procedimento,
            "observacoes": self.observacoes,
            "status": self.status
        }
