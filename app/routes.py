from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from flask_login import login_user, logout_user, login_required, current_user
from flask_babel import _
from app.models import Task, User
from app import db

bp = Blueprint('main', __name__)

@bp.route('/')
@login_required
def index():
    # Only query tasks belonging to the current logged-in user
    tasks = Task.query.filter_by(user_id=current_user.id).order_by(Task.created_at.desc()).all()
    pending = [t for t in tasks if t.status == 'pending']
    in_progress = [t for t in tasks if t.status == 'in_progress']
    completed = [t for t in tasks if t.status == 'completed']
    return render_template('index.html', pending=pending, in_progress=in_progress, completed=completed)

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            login_user(user)
            return redirect(url_for('main.index'))
        else:
            flash(_('Invalid username or password'))
    return render_template('login.html')

@bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if User.query.filter_by(username=username).first():
            flash(_('Username already exists'))
        else:
            new_user = User(username=username)
            new_user.set_password(password)
            db.session.add(new_user)
            db.session.commit()
            flash(_('Registration successful! Please log in.'))
            return redirect(url_for('main.login'))
    return render_template('register.html')

@bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.login'))

@bp.route('/add', methods=['POST'])
@login_required
def add_task():
    title = request.form.get('title')
    description = request.form.get('description', '')
    if title:
        new_task = Task(title=title, description=description, owner=current_user)
        db.session.add(new_task)
        db.session.commit()
    return redirect(url_for('main.index'))

@bp.route('/update/<int:id>', methods=['POST'])
@login_required
def update_task(id):
    task = Task.query.filter_by(id=id, user_id=current_user.id).first_or_404()
    
    # Soporta tanto peticiones tradicionales como peticiones AJAX JSON (Drag & Drop)
    if request.is_json:
        new_status = request.json.get('status')
    else:
        new_status = request.form.get('status')
        
    if new_status in ['pending', 'in_progress', 'completed']:
        task.status = new_status
        db.session.commit()
        if request.is_json:
            return {'success': True}
            
    return redirect(url_for('main.index'))

@bp.route('/delete/<int:id>', methods=['POST'])
@login_required
def delete_task(id):
    task = Task.query.filter_by(id=id, user_id=current_user.id).first_or_404()
    db.session.delete(task)
    db.session.commit()
    return redirect(url_for('main.index'))

@bp.route('/set_lang/<lang>')
def set_lang(lang):
    if lang in ['es', 'en']:
        session['lang'] = lang
    return redirect(request.referrer or url_for('main.index'))
