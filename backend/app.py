import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import db

app = Flask(__name__)
CORS(app)


def _brl(n):
    s = f"{n:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
    return f"R$ {s}"


# ─── leitura geral ────────────────────────────────────────────────────────────

@app.route('/api/dados')
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


# ─── produtos ─────────────────────────────────────────────────────────────────

@app.route('/api/produtos', methods=['POST'])
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


# ─── clientes ─────────────────────────────────────────────────────────────────

@app.route('/api/clientes', methods=['POST'])
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


# ─── pedidos ──────────────────────────────────────────────────────────────────

@app.route('/api/pedidos', methods=['POST'])
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


# ─── integrador: pedido → orçamento ──────────────────────────────────────────

@app.route('/api/pedidos/<pedido_id>/orcamento', methods=['POST'])
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


# ─── orçamentos ───────────────────────────────────────────────────────────────

@app.route('/api/orcamentos/<orc_id>/enviar', methods=['POST'])
def enviar_orcamento(orc_id):
    dados = db.carregar()

    orc = next((o for o in dados['orcamentos'] if o['id'] == orc_id), None)
    if not orc:
        return jsonify({'erro': 'Orçamento não encontrado'}), 404

    orc['status'] = 'enviado'
    _push_feed(dados, 'orc', f"Orçamento {orc_id} enviado ao cliente")
    db.salvar(dados)
    return jsonify({'ok': True})


@app.route('/api/orcamentos/<orc_id>/recusar', methods=['POST'])
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


# ─── integrador: orçamento aprovado → ordem de serviço ───────────────────────

@app.route('/api/orcamentos/<orc_id>/aprovar', methods=['POST'])
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


# ─── ordens de serviço ────────────────────────────────────────────────────────

@app.route('/api/ordens/<os_id>/avancar', methods=['POST'])
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


@app.route('/api/ordens/<os_id>/entregar', methods=['POST'])
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


# ─── utilitário interno ───────────────────────────────────────────────────────

def _push_feed(dados, tipo, txt):
    seq = dados['seq']
    dados['feed'].insert(0, {'id': seq['feed'], 'tipo': tipo, 'txt': txt, 'quando': 'agora'})
    seq['feed'] += 1
    dados['feed'] = dados['feed'][:12]


if __name__ == '__main__':
    app.run(debug=True, port=5000)
