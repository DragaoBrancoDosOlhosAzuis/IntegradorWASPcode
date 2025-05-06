from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    print(f"Template folder exists: {os.path.exists(app.template_folder)}")
    print(f"Login template exists: {os.path.exists(os.path.join(app.template_folder, 'usuarios/login.html'))}")
    app.run(debug=True)