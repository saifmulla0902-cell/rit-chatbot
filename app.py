from flask import Flask, render_template, request, jsonify
from chatbot_engine import ChatbotEngine
import os

app = Flask(__name__)
engine = ChatbotEngine()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    module = data.get('module', 'general')
    response = engine.get_response(user_message, module)
    return jsonify({'response': response})

@app.route('/api/add_faq', methods=['POST'])
def add_faq():
    data = request.get_json()
    question = data.get('question', '')
    answer = data.get('answer', '')
    if question and answer:
        engine.add_faq(question, answer)
        return jsonify({'status': 'success', 'message': 'FAQ added!'})
    return jsonify({'status': 'error', 'message': 'Both fields required.'})

@app.route('/api/add_notice', methods=['POST'])
def add_notice():
    data = request.get_json()
    notice = data.get('notice', '')
    if notice:
        engine.add_notice(notice)
        return jsonify({'status': 'success', 'message': 'Notice posted!'})
    return jsonify({'status': 'error', 'message': 'Notice text required.'})

@app.route('/api/get_faqs')
def get_faqs():
    return jsonify({'faqs': engine.get_faqs()})

@app.route('/api/get_notices')
def get_notices():
    return jsonify({'notices': engine.get_notices()})

@app.route('/api/delete_faq', methods=['POST'])
def delete_faq():
    data = request.get_json()
    engine.delete_faq(data.get('index', -1))
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)