import os
import ssl
import platform

if platform.system() == 'Windows':
    _orig_ssl_ctx = ssl.create_default_context
    def _no_verify_ssl(*args, **kwargs):
        ctx = _orig_ssl_ctx(*args, **kwargs)
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        return ctx
    ssl.create_default_context = _no_verify_ssl

from supabase import create_client
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

_sb = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_KEY'])


def carregar():
    produtos   = _sb.table('produtos').select('*').order('created_at', desc=True).execute().data
    clientes   = _sb.table('clientes').select('*').order('created_at', desc=True).execute().data
    pedidos    = _sb.table('pedidos').select('*').order('created_at', desc=True).execute().data
    orcamentos = _sb.table('orcamentos').select('*').order('created_at', desc=True).execute().data
    ordens     = _sb.table('ordens').select('*').order('created_at', desc=True).execute().data
    feed       = _sb.table('feed').select('*').order('id', desc=True).limit(12).execute().data
    seq_rows   = _sb.table('seq').select('*').execute().data

    return {
        'produtos':   produtos,
        'clientes':   clientes,
        'pedidos':    pedidos,
        'orcamentos': orcamentos,
        'ordens':     ordens,
        'feed':       feed,
        'seq':        {row['chave']: row['valor'] for row in seq_rows},
    }


def salvar(dados):
    for tabela in ('produtos', 'clientes', 'pedidos', 'orcamentos', 'ordens'):
        if dados.get(tabela):
            _sb.table(tabela).upsert(dados[tabela]).execute()

    if dados.get('feed'):
        _sb.table('feed').upsert(dados['feed']).execute()

    _sb.table('seq').upsert(
        [{'chave': k, 'valor': v} for k, v in dados['seq'].items()]
    ).execute()
