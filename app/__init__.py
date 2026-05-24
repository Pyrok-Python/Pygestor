from flask import Flask, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_babel import Babel
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'main.login'
babel = Babel()

def get_locale():
    # Retorna el idioma guardado en sesión, o inglés por defecto
    return session.get('lang', 'en')

def create_app():
    app = Flask(__name__)
    
    # Configuraciones
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default_fallback_key')
    basedir = os.path.abspath(os.path.dirname(__file__))
    
    # Soportar base de datos configurada por entorno (ideal para Docker/Prod)
    db_uri = os.environ.get('DATABASE_URL')
    if not db_uri:
        db_uri = 'sqlite:///' + os.path.join(basedir, '..', 'pygestor.db')
        
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Inicializar extensiones
    db.init_app(app)
    login_manager.init_app(app)
    babel.init_app(app, locale_selector=get_locale)
    
    # Importar y registrar las rutas
    from app import routes
    app.register_blueprint(routes.bp)
    
    # Crear la base de datos si no existe
    with app.app_context():
        db.create_all()
        
    return app
