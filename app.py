from flask import Flask, render_template, send_file, url_for
import os

app = Flask(__name__)


@app.route('/')
@app.route('/home')
def home():
    return render_template("index.html")


@app.route('/about')
def about():
    return render_template("about.html")


@app.route('/skills')
def skills():
    return render_template("skills.html")


@app.route('/resume')
def resume():
    return render_template(
        'resume.html',
        download_f=True,
        download_url='resume',
        # resume=resume_fetcher.get_resume_url()
        resume = "../static/pdfs/Potluri_Krishna_Priyatham_Resume.pdf"
    )

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


@app.route('/projects/creo/download')
def download_creo_stl():
    stl_path = r"C:\Users\kittu\projects\MyPortFolio\static\stl files\revolverassembly.stl"
    if not os.path.isfile(stl_path):
        return f"STL file not found at: {stl_path}", 404
    response = send_file(
        stl_path,
        mimetype="application/octet-stream",
        as_attachment=True,
        download_name="revolverassembly.stl"
    )
    response.headers["Content-Type"] = "application/octet-stream"
    response.headers["Content-Disposition"] = "attachment; filename=\"revolverassembly.stl\""
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


@app.route('/projects/creo')
def creo():
    title = "3D Model of Revolver MG 31 DS"
    description = "An interactive 3D view of the Revolver MG 31 DS model."
    model_url = "https://cloud.glovius.com/embed/embedviewgl/1a2ff387-966d-4116-8a35-d249732ae529?canvasHeight=500&canvasWidth=1000"
    download_url = "/static/stl%20files/revolverassembly.stl"
    return render_template('creo.html', title=title, description=description, model_url=model_url, download_url=download_url)


@app.route('/projects/array')
def array():
    return render_template('arraymanipulation.html')


if __name__ == '__main__':
    host  = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', 5000))
    app.run(host=host, port=port, debug=True)
