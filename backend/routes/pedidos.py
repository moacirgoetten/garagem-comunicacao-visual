import datetime
from flask import Blueprint, jsonify, request
import db
from utils import _push_feed, _brl

pedidos_bp = Blueprint('pedidos', __name__)


@pedidos_bp.route('/api/pedidos', methods=['POST'])
def criar_pedido():
    dados = db.carregar()
    body = request.json
    seq = dados['seq']

    pedido_id = f"PD-{seq['pd']}"
    seq['pd'] += 1

    pedido = {
        'id':        pedido_id,
        'clienteId': body['clienteId'],
        'itens':     body['itens'],
        'prazo':     body['prazo'],
        'status':    'novo',
        'criado':    datetime.date.today().isoformat(),
    }
    dados['pedidos'].insert(0, pedido)

    cli = next((c for c in dados['clientes'] if c['id'] == body['clienteId']), None)
    nome_cli = cli['nome'] if cli else ''
    _push_feed(dados, 'pedido', f"Novo pedido {pedido_id} — {nome_cli}")
    db.salvar(dados)
    return jsonify(pedido), 201


@pedidos_bp.route('/api/pedidos/<pedido_id>/orcamento', methods=['POST'])
def gerar_orcamento(pedido_id):
    dados = db.carregar()
    seq = dados['seq']

    pedido = next((p for p in dados['pedidos'] if p['id'] == pedido_id), None)
    if not pedido:
        return jsonify({'erro': 'Pedido não encontrado'}), 404

    total = sum(
        next((pr['preco'] for pr in dados['produtos'] if pr['id'] == it['produtoId']), 0) * it['qtd']
        for it in pedido['itens']
    )

    hoje = datetime.date.today()
    orc_id = f"OR-{seq['or']:04d}"
    seq['or'] += 1

    orcamento = {
        'id':        orc_id,
        'pedidoId':  pedido_id,
        'clienteId': pedido['clienteId'],
        'total':     total,
        'validade':  (hoje + datetime.timedelta(days=10)).isoformat(),
        'status':    'gerado',
        'criado':    hoje.isoformat(),
    }
    dados['orcamentos'].insert(0, orcamento)

    for p in dados['pedidos']:
        if p['id'] == pedido_id:
            p['status'] = 'aguardando'
            break

    _push_feed(dados, 'orc', f"Orçamento {orc_id} gerado ({_brl(total)})")
    db.salvar(dados)
    return jsonify(orcamento), 201
