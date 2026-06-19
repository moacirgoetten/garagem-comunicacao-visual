from flask import Flask
from flask_cors import CORS

from routes.dados import dados_bp
from routes.produtos import produtos_bp
from routes.clientes import clientes_bp
from routes.pedidos import pedidos_bp
from routes.orcamentos import orcamentos_bp
from routes.ordens import ordens_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(dados_bp)
app.register_blueprint(produtos_bp)
app.register_blueprint(clientes_bp)
app.register_blueprint(pedidos_bp)
app.register_blueprint(orcamentos_bp)
app.register_blueprint(ordens_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
