from flask import Blueprint, jsonify
import db

dados_bp = Blueprint('dados', __name__)


@dados_bp.route('/api/dados')
def get_dados():
    dados = db.carregar()
    return jsonify({
        'produtos':   dados['produtos'],
        'clientes':   dados['clientes'],
        'pedidos':    dados['pedidos'],
        'orcamentos': dados['orcamentos'],
        'ordens':     dados['ordens'],
        'feed':       dados['feed'],
    })
