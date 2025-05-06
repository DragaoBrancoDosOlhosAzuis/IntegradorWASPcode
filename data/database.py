from tinydb import TinyDB

# Configuração inicial do banco de dados
def init_db():
    db = TinyDB('db.json')
    return {
        'livros': db.table('livros'),
        'usuarios': db.table('usuarios'),
        'emprestimos': db.table('emprestimos')
    }