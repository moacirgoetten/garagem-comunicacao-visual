from flask import Blueprint, jsonify, request
import db
from utils import _push_feed

clientes_bp = Blueprint('clientes', __name__)


@clientes_bp.route('/api/clientes', methods=['POST'])
def criar_cliente():
    dados = db.carregar()
    body = request.json
    seq = dados['seq']

    cliente_id = f"C-{seq['cli']:03d}"
    seq['cli'] += 1

    cliente = {
        'id':        cliente_id,
        'nome':      body['nome'],
        'tipo':      body['tipo'],
        'documento': body['documento'],
        'telefone':  body.get('telefone', ''),
        'status':    'Ativo',
    }
    dados['clientes'].insert(0, cliente)

    _push_feed(dados, 'cliente', f"Cliente {cliente['nome']} cadastrado")
    db.salvar(dados)
    return jsonify(cliente), 201
