from flask import Flask
import os

def create_app():
    # Configura caminhos absolutos corretamente
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    app = Flask(__name__,
               template_folder=os.path.join(base_dir, 'templates'),
               static_folder=os.path.join(base_dir, 'static'))
    
    app.config.update(
        SECRET_KEY='sua_chave_secreta_aqui',
        SESSION_COOKIE_SECURE=True,
        PERMANENT_SESSION_LIFETIME=3600
    )
    
    from .routes import init_routes
    init_routes(app)
    
    return app