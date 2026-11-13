from flask import Flask, render_template
from database import inicializar_banco
from routes import registrar_rotas

app = Flask(__name__)

# Cria as tabelas automaticamente quando o sistema inicia.
inicializar_banco()
registrar_rotas(app)

@app.route("/")
def inicio():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
