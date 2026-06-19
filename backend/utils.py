def _brl(n):
    s = f"{n:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
    return f"R$ {s}"


def _push_feed(dados, tipo, txt):
    seq = dados['seq']
    dados['feed'].insert(0, {'id': seq['feed'], 'tipo': tipo, 'txt': txt, 'quando': 'agora'})
    seq['feed'] += 1
    dados['feed'] = dados['feed'][:12]
