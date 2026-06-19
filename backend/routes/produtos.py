from flask import Blueprint, jsonify, request
import db
from utils import _push_feed

produtos_bp = Blueprint('produtos', __name__)


@produtos_bp.route('/api/produtos', methods=['POST'])
def criar_produto():
    dados = db.carregar()
    body = request.json
    seq = dados['seq']

    produto_id = f"P-{seq['prod']:03d}"
    seq['prod'] += 1

    produto = {
        'id':        produto_id,
        'nome':      body['nome'],
        'categoria': body['categoria'],
        'emoji':     body.get('emoji', '📦'),
        'preco':     float(body['preco']),
        'unidade':   body['unidade'],
    }
    dados['produtos'].insert(0, produto)

    _push_feed(dados, 'produto', f"Produto \"{produto['nome']}\" cadastrado")
    db.salvar(dados)
    return jsonify(produto), 201
