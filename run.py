from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    # Por defecto False en producción. En local será True si existe en .env
    is_debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(debug=is_debug)
