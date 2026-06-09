import pickle
import os
import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'garagem.pkl')


def _hoje():
    return datetime.date.today().isoformat()


def _add_dias(n):
    return (datetime.date.today() + datetime.timedelta(days=n)).isoformat()


def _dados_iniciais():
    return {
        'produtos': [
            {'id': 'P-001', 'nome': 'Banner Lona 440g',          'categoria': 'Banner',      'emoji': '🚩', 'preco': 65.0,   'unidade': 'm²'},
            {'id': 'P-002', 'nome': 'Cartão de Visita 4x4',      'categoria': 'Cartão',      'emoji': '🪪', 'preco': 0.38,   'unidade': 'un'},
            {'id': 'P-003', 'nome': 'Lona Front Light',          'categoria': 'Lona',        'emoji': '🎏', 'preco': 89.0,   'unidade': 'm²'},
            {'id': 'P-004', 'nome': 'Adesivo Vinil Brilho',      'categoria': 'Adesivo',     'emoji': '🏷️', 'preco': 78.0,   'unidade': 'm²'},
            {'id': 'P-005', 'nome': 'Tinta Eco-Solvente CMYK',   'categoria': 'Tinta',       'emoji': '🛢️', 'preco': 320.0,  'unidade': 'L'},
            {'id': 'P-006', 'nome': 'Panfleto A5 Couché',        'categoria': 'Panfleto',    'emoji': '📄', 'preco': 0.22,   'unidade': 'un'},
            {'id': 'P-007', 'nome': 'Wind Banner 3m + Base',     'categoria': 'Wind Banner', 'emoji': '🪁', 'preco': 540.0,  'unidade': 'un'},
            {'id': 'P-008', 'nome': 'Plotagem de Veículo Completa','categoria':'Plotagem',   'emoji': '🚗', 'preco': 2400.0, 'unidade': 'veíc.'},
            {'id': 'P-009', 'nome': 'Fachada ACM + Letra Caixa', 'categoria': 'Fachada',     'emoji': '🏢', 'preco': 1850.0, 'unidade': 'm²'},
            {'id': 'P-010', 'nome': 'Adesivo Recorte Eletrônico','categoria': 'Adesivo',     'emoji': '✂️', 'preco': 95.0,   'unidade': 'm²'},
            {'id': 'P-011', 'nome': 'Banner Mesh Perfurado',     'categoria': 'Banner',      'emoji': '🕸️', 'preco': 72.0,   'unidade': 'm²'},
            {'id': 'P-012', 'nome': 'Cartão Fidelidade Verniz',  'categoria': 'Cartão',      'emoji': '💛', 'preco': 0.65,   'unidade': 'un'},
        ],
        'clientes': [
            {'id': 'C-001', 'nome': 'Padaria Pão Quente',          'tipo': 'PJ', 'documento': '12.345.678/0001-90', 'telefone': '(41) 3082-1100', 'status': 'Ativo'},
            {'id': 'C-002', 'nome': 'Marcos Andrade',               'tipo': 'PF', 'documento': '045.872.119-30',   'telefone': '(41) 99812-4421','status': 'Ativo'},
            {'id': 'C-003', 'nome': 'Auto Center Veloz',            'tipo': 'PJ', 'documento': '98.765.432/0001-12','telefone': '(41) 3344-7788', 'status': 'Ativo'},
            {'id': 'C-004', 'nome': 'Academia Corpo & Foco',        'tipo': 'PJ', 'documento': '23.456.789/0001-55','telefone': '(41) 3211-9090', 'status': 'Ativo'},
            {'id': 'C-005', 'nome': 'Juliana Prado',                'tipo': 'PF', 'documento': '112.998.345-77',   'telefone': '(41) 99654-2200','status': 'Inativo'},
            {'id': 'C-006', 'nome': 'Restaurante Sabor da Serra',   'tipo': 'PJ', 'documento': '34.567.890/0001-21','telefone': '(41) 3567-4545', 'status': 'Ativo'},
            {'id': 'C-007', 'nome': 'Rafael Tonin',                 'tipo': 'PF', 'documento': '078.554.221-09',   'telefone': '(41) 99201-7766','status': 'Ativo'},
            {'id': 'C-008', 'nome': 'Mercado Bom Preço',            'tipo': 'PJ', 'documento': '45.678.901/0001-33','telefone': '(41) 3122-3344', 'status': 'Ativo'},
        ],
        'pedidos': [
            {'id': 'PD-1042', 'clienteId': 'C-001', 'itens': [{'produtoId': 'P-001', 'qtd': 6}],                                        'prazo': _add_dias(4),  'status': 'novo',      'criado': _add_dias(-1)},
            {'id': 'PD-1041', 'clienteId': 'C-003', 'itens': [{'produtoId': 'P-008', 'qtd': 1}],                                        'prazo': _add_dias(12), 'status': 'aguardando','criado': _add_dias(-2)},
            {'id': 'PD-1040', 'clienteId': 'C-004', 'itens': [{'produtoId': 'P-007', 'qtd': 3}, {'produtoId': 'P-002', 'qtd': 1000}],  'prazo': _add_dias(6),  'status': 'aprovado',  'criado': _add_dias(-3)},
            {'id': 'PD-1039', 'clienteId': 'C-006', 'itens': [{'produtoId': 'P-009', 'qtd': 8}],                                        'prazo': _add_dias(18), 'status': 'producao',  'criado': _add_dias(-5)},
            {'id': 'PD-1038', 'clienteId': 'C-008', 'itens': [{'produtoId': 'P-006', 'qtd': 5000}],                                     'prazo': _add_dias(-1), 'status': 'concluido', 'criado': _add_dias(-9)},
            {'id': 'PD-1037', 'clienteId': 'C-002', 'itens': [{'produtoId': 'P-004', 'qtd': 12}],                                       'prazo': _add_dias(3),  'status': 'novo',      'criado': _add_dias(-1)},
            {'id': 'PD-1036', 'clienteId': 'C-007', 'itens': [{'produtoId': 'P-011', 'qtd': 20}],                                       'prazo': _add_dias(2),  'status': 'recusado',  'criado': _add_dias(-6)},
        ],
        'orcamentos': [
            {'id': 'OR-0521', 'pedidoId': 'PD-1040', 'clienteId': 'C-004', 'total': 2000.0,  'validade': _add_dias(8),  'status': 'aprovado', 'criado': _add_dias(-3)},
            {'id': 'OR-0520', 'pedidoId': 'PD-1039', 'clienteId': 'C-006', 'total': 14800.0, 'validade': _add_dias(10), 'status': 'aprovado', 'criado': _add_dias(-5)},
            {'id': 'OR-0519', 'pedidoId': 'PD-1041', 'clienteId': 'C-003', 'total': 2400.0,  'validade': _add_dias(14), 'status': 'enviado',  'criado': _add_dias(-2)},
            {'id': 'OR-0518', 'pedidoId': 'PD-1038', 'clienteId': 'C-008', 'total': 1100.0,  'validade': _add_dias(-4), 'status': 'aprovado', 'criado': _add_dias(-9)},
        ],
        'ordens': [
            {'id': 'OS-0312', 'orcamentoId': 'OR-0520', 'pedidoId': 'PD-1039', 'clienteId': 'C-006', 'descricao': 'Fachada ACM + Letra Caixa — 8m²',           'progresso': 60,  'status': 'producao', 'criado': _add_dias(-5)},
            {'id': 'OS-0311', 'orcamentoId': 'OR-0521', 'pedidoId': 'PD-1040', 'clienteId': 'C-004', 'descricao': '3x Wind Banner 3m + 1000 Cartões de Visita', 'progresso': 25,  'status': 'producao', 'criado': _add_dias(-3)},
            {'id': 'OS-0310', 'orcamentoId': 'OR-0518', 'pedidoId': 'PD-1038', 'clienteId': 'C-008', 'descricao': '5000 Panfletos A5 Couché',                   'progresso': 100, 'status': 'entregue', 'criado': _add_dias(-9)},
        ],
        'feed': [
            {'id': 1, 'tipo': 'os',      'txt': 'OS-0312 avançou para 60%',                          'quando': 'há 12 min'},
            {'id': 2, 'tipo': 'orc',     'txt': 'Orçamento OR-0519 enviado p/ Auto Center Veloz',    'quando': 'há 1 h'},
            {'id': 3, 'tipo': 'pedido',  'txt': 'Novo pedido PD-1042 — Padaria Pão Quente',          'quando': 'há 2 h'},
            {'id': 4, 'tipo': 'orc',     'txt': 'OR-0521 aprovado → OS-0311 gerada',                 'quando': 'há 5 h'},
            {'id': 5, 'tipo': 'cliente', 'txt': 'Cliente Rafael Tonin cadastrado',                   'quando': 'ontem'},
            {'id': 6, 'tipo': 'os',      'txt': 'OS-0310 entregue ao Mercado Bom Preço',             'quando': 'ontem'},
        ],
        'seq': {'pd': 1043, 'or': 522, 'os': 313, 'feed': 100, 'prod': 13, 'cli': 9},
    }


def carregar():
    if os.path.exists(DB_PATH):
        with open(DB_PATH, 'rb') as f:
            return pickle.load(f)
    dados = _dados_iniciais()
    salvar(dados)
    return dados


def salvar(dados):
    with open(DB_PATH, 'wb') as f:
        pickle.dump(dados, f)
