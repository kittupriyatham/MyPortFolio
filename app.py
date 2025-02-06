from flask import Flask, render_template, send_file, url_for, request
import os


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
    resume_path = './static/pdfs/potlurikrishnapriyatham.pdf'
    if request.args.get('download'):
        filename = request.args.get('filename')  # Get filename from query parameter
        # filename = None
        if not filename:
            return "Filename not provided for download", 400
        try:
            return send_file(
                resume_path,
                as_attachment=True,
                download_name=filename
            )
        except Exception as e:
            return f"Error sending file: {e}", 500
    else:
        return render_template(
            'resume.html',
            download_f=True,
            download_url='resume'
            # download_url=url_for('resume_fun', download=False, filename='potlurikrishnapriyatham.pdf')
        )
    # if not os.path.exists(resume_path):
    #     return "File not found", 404  # Or handle the error gracefully
    # try:
    #     return render_template('resume.html')
    # except Exception as e:
    #     return f"Error sending file: {e}", 500
    # return render_template('resume.html')#, send_file('./potlurikrishnapriyatham.pdf', as_attachment=True)


@app.route('/video-resume')
def video_resume():
    return render_template('video-resume.html')


@app.route('/achievements')
def achievements():
    return render_template('achievements.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/projects')
def projects():
    return render_template('projects.html')


@app.route('/projects/creo')
def creo():
    return render_template('creo.html')


@app.route('/projects/array')
def array():
    return render_template('arraymanipulation.html')


if __name__ == '__main__':
    app.run(debug=True)
    # app.run()
