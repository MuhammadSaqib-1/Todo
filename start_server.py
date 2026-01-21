import os
import sys
import subprocess

# Get the current directory (which should be the project root)
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, 'backend')

# Load environment variables from .env file in backend
env = os.environ.copy()
backend_env_file = os.path.join(backend_dir, '.env')
if os.path.exists(backend_env_file):
    # Read and add environment variables from .env file
    with open(backend_env_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                env[key.strip()] = value.strip()

# Set the Python path environment variable to include the project root and backend
python_path = f"{current_dir}{os.pathsep}{backend_dir}"
if 'PYTHONPATH' in env:
    python_path = f"{env['PYTHONPATH']}{os.pathsep}{python_path}"
env['PYTHONPATH'] = python_path

# Run the uvicorn server from the backend directory
result = subprocess.run([
    sys.executable, '-m', 'uvicorn',
    'main:app',
    '--host', '0.0.0.0',
    '--port', '8000',
    '--reload'
], cwd=backend_dir, env=env)
