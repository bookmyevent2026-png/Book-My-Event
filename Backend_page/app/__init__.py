from flask import Flask
import os
from app.auth.routes import auth_bp
#from admin.routes import admin_bp
#from user.routes import user_bp
from app.super_admin.routes import super_admin_bp
from  app.auth.otp_routes import otp_bp
from  app.users.booking_routes import user_bp
from app.exhibitor.exhibitor_routers import exhibitor_bp
from app.super_user.superuser_routers import superuser_bp
from app.chatbot import chatbot_bp


from werkzeug.middleware.proxy_fix import ProxyFix

def create_app():
    basedir = os.path.abspath(os.path.dirname(__file__))
    app = Flask(__name__, static_url_path='/uploads', static_folder=os.path.join(basedir, 'uploads'))
    
    # ✅ Support HTTPS and Proxy Headers (Essential for server image links)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
    
    app.config['SECRET_KEY'] = '123'
    app.register_blueprint(auth_bp, url_prefix="/auth")
    #app.register_blueprint(admin_bp, url_prefix="/admin")
    #app.register_blueprint(user_bp, url_prefix="/user")
    app.register_blueprint(super_admin_bp, url_prefix="/superadmin")
    app.register_blueprint(superuser_bp, url_prefix="/superuser")
    app.register_blueprint(otp_bp, url_prefix="/otp")
    app.register_blueprint(user_bp, url_prefix="/user")
    app.register_blueprint(exhibitor_bp, url_prefix="/exhibitor")
    app.register_blueprint(chatbot_bp, url_prefix="/chatbot")

    return app