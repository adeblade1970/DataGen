from flask import Blueprint, request, jsonify
import random
import json
import os

quiz_bp = Blueprint('quiz', __name__)

# Questions data
questions = [
    {
        "question": "What is a key disadvantage of RPA regarding changes in applications?",
        "options": [
            "It easily adapts to UI changes.",
            "It cannot dynamically respond to changes.",
            "It learns from changes over time.",
            "It automatically updates its scripts."
        ],
        "answer": "It cannot dynamically respond to changes."
    },
    {
        "question": "What kind of data does RPA work best with?",
        "options": [
            "Unstructured data.",
            "Semi-structured data.",
            "Structured data.",
            "Any type of data."
        ],
        "answer": "Structured data."
    },
    {
        "question": "What is a potential risk of Leapwork as an RPA tool, according to the document?",
        "options": [
            "Its extremely low cost.",
            "Its inability to automate across technologies.",
            "Potential for vendor lock-in.",
            "Its extensive debugging functionality."
        ],
        "answer": "Potential for vendor lock-in."
    },
    {
        "question": "Which of the following is a benefit of Leapwork as a low-code RPA tool?",
        "options": [
            "High learning curve.",
            "Limited cross-platform compatibility.",
            "No-code, visual platform.",
            "Increased maintenance efforts."
        ],
        "answer": "No-code, visual platform."
    },
    {
        "question": "When is RPA most effective?",
        "options": [
            "For processes requiring human judgment.",
            "For unstable and frequently changing processes.",
            "For repetitive and high-volume tasks.",
            "For processes with low transaction volume."
        ],
        "answer": "For repetitive and high-volume tasks."
    },
    {
        "question": "When should RPA generally be avoided?",
        "options": [
            "When processes are rule-based.",
            "When tasks are error-prone.",
            "When processes require human judgment or intuition.",
            "When there is a clear ROI."
        ],
        "answer": "When processes require human judgment or intuition."
    },
    {
        "question": "What is 'process debt' in the context of RPA?",
        "options": [
            "Automating efficient processes.",
            "Automating broken or inefficient processes.",
            "Reducing maintenance overhead.",
            "Improving process quality."
        ],
        "answer": "Automating broken or inefficient processes."
    },
    {
        "question": "What is a common concern among employees regarding RPA implementation?",
        "options": [
            "Increased job satisfaction.",
            "Job displacement.",
            "Better training opportunities.",
            "More strategic work."
        ],
        "answer": "Job displacement."
    },
    {
        "question": "Leapwork's visual platform makes it accessible to whom?",
        "options": [
            "Only developers.",
            "Only IT professionals.",
            "Business users, QA professionals, and developers.",
            "Only business users."
        ],
        "answer": "Business users, QA professionals, and developers."
    },
    {
        "question": "What kind of processes are NOT suitable for pure RPA if they heavily rely on it?",
        "options": [
            "Processes with structured data.",
            "Processes with unstructured data.",
            "Processes with clear ROI.",
            "Processes with peak demands."
        ],
        "answer": "Processes with unstructured data."
    },
    {
        "question": "What is a major scalability challenge with RPA?",
        "options": [
            "Easy management of thousands of bots.",
            "Managing thousands of individual RPA bots can become complex.",
            "Automatic scaling capabilities.",
            "No maintenance overhead."
        ],
        "answer": "Managing thousands of individual RPA bots can become complex."
    },
    {
        "question": "What type of interface does Leapwork use?",
        "options": [
            "Command-line interface.",
            "Text-based coding interface.",
            "Visual, flowchart-based interface.",
            "Database query interface."
        ],
        "answer": "Visual, flowchart-based interface."
    },
    {
        "question": "What is a key benefit of Leapwork's reusable components?",
        "options": [
            "Increases development time.",
            "Dramatically accelerates development of new automations.",
            "Makes processes more complex.",
            "Reduces consistency across processes."
        ],
        "answer": "Dramatically accelerates development of new automations."
    },
    {
        "question": "Which type of processes should be avoided for RPA implementation?",
        "options": [
            "Stable and mature processes.",
            "Rule-based processes.",
            "Broken or inefficient processes.",
            "High-volume processes."
        ],
        "answer": "Broken or inefficient processes."
    },
    {
        "question": "What is a characteristic of traditional RPA tools regarding intelligence?",
        "options": [
            "They possess advanced AI capabilities.",
            "They can learn from experience.",
            "They are not inherently intelligent.",
            "They make complex decisions automatically."
        ],
        "answer": "They are not inherently intelligent."
    }
]

# File to store passcode counter
COUNTER_FILE = os.path.join(os.path.dirname(__file__), '..', 'database', 'passcode_counter.txt')

def get_passcode_counter():
    try:
        with open(COUNTER_FILE, 'r') as f:
            return int(f.read().strip())
    except (FileNotFoundError, ValueError):
        return 0

def increment_passcode_counter():
    counter = get_passcode_counter() + 1
    with open(COUNTER_FILE, 'w') as f:
        f.write(str(counter))
    return counter

@quiz_bp.route('/get_questions', methods=['GET'])
def get_questions():
    # Select 7 random questions
    selected_questions = random.sample(questions, 7)
    # Remove the correct answers from the response
    quiz_questions = []
    for i, q in enumerate(selected_questions):
        quiz_questions.append({
            'id': i,
            'question': q['question'],
            'options': q['options']
        })
    return jsonify(quiz_questions)

@quiz_bp.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    data = request.get_json()
    user_answers = data.get('answers', {})
    
    # Get the same 7 random questions (we need to store them in session or regenerate)
    # For simplicity, we'll regenerate and check against all questions
    score = 0
    total_questions = 7
    
    # Check answers
    for question_id, user_answer in user_answers.items():
        # Find the question by matching the question text
        for q in questions:
            if q['question'] == user_answer.get('question'):
                if q['answer'] == user_answer.get('answer'):
                    score += 1
                break
    
    passed = score >= 5
    passcode = None
    
    if passed:
        counter = increment_passcode_counter()
        passcode = f"LW{counter:03d}P"
    
    return jsonify({
        'score': score,
        'total': total_questions,
        'passed': passed,
        'passcode': passcode,
        'pass_mark': 5
    })

