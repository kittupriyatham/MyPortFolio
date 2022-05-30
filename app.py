from flask import Flask, render_template
from app2 import MachineLearningModelDeployment

o = MachineLearningModelDeployment()

app = Flask(__name__)


@app.route('/')
@app.route('/home')
def home():
    return render_template("index.html")


@app.route('/blog')
def blog():
    return render_template('blog.html')


@app.route('/about')
def about():
    return render_template("about.html")


@app.route('/skills')
def skills():
    return render_template("skills.html")


@app.route('/resume')
def resume():
    return render_template('resume.html')


@app.route('/achievements')
def achievements():
    return render_template('achieve.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/projects/MLMD')
def mlmd():
    return o.home()


@app.route('/projects/MLMD', methods=['POST'])
def predictandoutput():
    return o.predictandoutput()


@app.route('/projects/MLMD/dashboard')
def dashboard():
    return o.dashboard()


@app.route('/projects/MLMD/about')
def mlmd_about():
    return o.about()


@app.route('/projects/creo')
def creo():
    return render_template('creo.html')


@app.route('/projects/array')
def array():
    return render_template('arraymanipulation.html')


if __name__ == '__main__':
    app.run(debug=True)
