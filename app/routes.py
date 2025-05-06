from flask import Blueprint, render_template, redirect, url_for, request, flash, session
from functools import wraps

bp = Blueprint('main', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            flash('Por favor, faça login para acessar', 'error')
            return redirect(url_for('main.login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def init_routes(app):
    app.register_blueprint(bp)
    
    @app.before_request
    def require_login():
        exempt_endpoints = ['main.login', 'static']
        if not session.get('logged_in') and request.endpoint not in exempt_endpoints:
            return redirect(url_for('main.login'))

@bp.route('/')
def home():
    return redirect(url_for('main.login'))

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        senha = request.form.get('senha')
        
        # Verificação simples (em produção use banco de dados!)
        if email == 'admin@biblioteca.com' and senha == '123456':
            session['logged_in'] = True
            session['user'] = {'nome': 'Administrador', 'email': email}
            flash('Login realizado com sucesso!', 'success')
            
            # Redireciona para dashboard ou página solicitada
            next_page = request.args.get('next') or url_for('main.dashboard')
            return redirect(next_page)
        else:
            flash('E-mail ou senha incorretos', 'error')
    
    return render_template('usuarios/login.html')

@bp.route('/logout')
def logout():
    session.clear()
    flash('Você foi desconectado', 'info')
    return redirect(url_for('main.login'))

@bp.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@bp.route('/livros')
@login_required
def listar_livros():
    livros = [{'id': 1, 'titulo': 'Dom Casmurro'}, {'id': 2, 'titulo': '1984'}]
    return render_template('livros/lista.html', livros=livros)

@bp.route('/reservas/nova', methods=['GET', 'POST'])
@login_required
def nova_reserva():
    if request.method == 'POST':
        flash('Reserva criada com sucesso!', 'success')
        return redirect(url_for('main.listar_reservas'))
    return render_template('reservas/nova.html')