from flask import Flask, request, jsonify
from flask_cors import CORS
from simulation import run_simulation

app = Flask(__name__)
CORS(app)

@app.route('/simulate', methods=['POST'])
def simulate():
    data = request.json
    result = run_simulation(data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
