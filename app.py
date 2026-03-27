from flask import Flask, render_template, send_file, request, session, redirect, url_for, flash
from jinja2 import FileSystemLoader
import os
import json
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import requests

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
        download_url='resume'
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


@app.route('/projects/creo')
def creo():
    return render_template('creo.html')


@app.route('/projects/array')
def array():
    return render_template('arraymanipulation.html')


if __name__ == '__main__':
    app.run(debug=True)
