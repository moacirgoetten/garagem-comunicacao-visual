import datetime
from flask import Blueprint, jsonify, request
import db
from utils import _push_feed

orcamentos_bp = Blueprint('orcamentos', __name__)


@orcamentos_bp.route('/api/orcamentos/<orc_id>/enviar', methods=['POST'])
def enviar_orcamento(orc_id):
    dados = db.carregar()

    orc = next((o for o in dados['orcamentos'] if o['id'] == orc_id), None)
    if not orc:
        return jsonify({'erro': 'Orçamento não encontrado'}), 404

    orc['status'] = 'enviado'
    _push_feed(dados, 'orc', f"Orçamento {orc_id} enviado ao cliente")
    db.salvar(dados)
    return jsonify({'ok': True})


@orcamentos_bp.route('/api/orcamentos/<orc_id>/recusar', methods=['POST'])
def recusar_orcamento(orc_id):
    dados = db.carregar()

    orc = next((o for o in dados['orcamentos'] if o['id'] == orc_id), None)
    if not orc:
        return jsonify({'erro': 'Orçamento não encontrado'}), 404

    orc['status'] = 'recusado'
    for p in dados['pedidos']:
        if p['id'] == orc['pedidoId']:
            p['status'] = 'recusado'
            break

    _push_feed(dados, 'orc', f"Orçamento {orc_id} recusado")
    db.salvar(dados)
    return jsonify({'ok': True})


@orcamentos_bp.route('/api/orcamentos/<orc_id>/aprovar', methods=['POST'])
def aprovar_orcamento(orc_id):
    dados = db.carregar()
    seq = dados['seq']

    orc = next((o for o in dados['orcamentos'] if o['id'] == orc_id), None)
    if not orc:
        return jsonify({'erro': 'Orçamento não encontrado'}), 404

    pedido = next((p for p in dados['pedidos'] if p['id'] == orc['pedidoId']), None)
    if pedido:
        partes = [
            f"{it['qtd']}× {next((pr['nome'] for pr in dados['produtos'] if pr['id'] == it['produtoId']), '')}"
            for it in pedido['itens']
        ]
        descricao = ' + '.join(filter(None, partes)) or 'Produção'
    else:
        descricao = 'Produção'

    os_id = f"OS-{seq['os']:04d}"
    seq['os'] += 1

    ordem = {
        'id':          os_id,
        'orcamentoId': orc_id,
        'pedidoId':    orc['pedidoId'],
        'clienteId':   orc['clienteId'],
        'descricao':   descricao,
        'progresso':   0,
        'status':      'aguardando',
        'criado':      datetime.date.today().isoformat(),
    }
    dados['ordens'].insert(0, ordem)

    orc['status'] = 'aprovado'
    for p in dados['pedidos']:
        if p['id'] == orc['pedidoId']:
            p['status'] = 'aprovado'
            break

    _push_feed(dados, 'orc', f"{orc_id} aprovado → {os_id} gerada")
    db.salvar(dados)
    return jsonify(ordem), 201
