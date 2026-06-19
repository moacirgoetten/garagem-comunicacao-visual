from flask import Blueprint, jsonify, request
import db
from utils import _push_feed

ordens_bp = Blueprint('ordens', __name__)


@ordens_bp.route('/api/ordens/<os_id>/avancar', methods=['POST'])
def avancar_os(os_id):
    dados = db.carregar()
    body = request.json or {}
    delta = int(body.get('delta', 25))

    ordem = next((o for o in dados['ordens'] if o['id'] == os_id), None)
    if not ordem:
        return jsonify({'erro': 'OS não encontrada'}), 404

    ordem['progresso'] = max(0, min(100, ordem['progresso'] + delta))
    if ordem['progresso'] == 0:
        ordem['status'] = 'aguardando'
    elif ordem['progresso'] >= 100:
        ordem['status'] = 'concluida'
    else:
        ordem['status'] = 'producao'

    db.salvar(dados)
    return jsonify(ordem)


@ordens_bp.route('/api/ordens/<os_id>/entregar', methods=['POST'])
def entregar_os(os_id):
    dados = db.carregar()

    ordem = next((o for o in dados['ordens'] if o['id'] == os_id), None)
    if not ordem:
        return jsonify({'erro': 'OS não encontrada'}), 404

    ordem['progresso'] = 100
    ordem['status'] = 'entregue'

    for p in dados['pedidos']:
        if p['id'] == ordem['pedidoId']:
            p['status'] = 'concluido'
            break

    _push_feed(dados, 'os', f"{os_id} entregue")
    db.salvar(dados)
    return jsonify(ordem)
