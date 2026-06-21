from flask import Blueprint, jsonify, request
import db
from utils import _push_feed

clientes_bp = Blueprint('clientes', __name__)


@clientes_bp.route('/api/clientes/<cliente_id>', methods=['DELETE'])
def excluir_cliente(cliente_id):
    resultado = db.buscar_um('clientes', 'id', cliente_id)
    if not resultado:
        return jsonify({'erro': 'Cliente não encontrado'}), 404

    pedidos = db.buscar_um('pedidos', 'clienteId', cliente_id)
    if pedidos:
        return jsonify({'erro': 'Cliente possui pedidos e não pode ser excluído'}), 400

    db.excluir('clientes', cliente_id)
    return jsonify({'ok': True}), 200


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
