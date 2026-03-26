from flask import Flask, render_template, send_file, request, session, redirect, url_for, flash
from jinja2 import FileSystemLoader
import os
import json
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import requests

# load_dotenv()
app = Flask(__name__)
# app.secret_key = os.environ.get('SECRET_KEY', 'kittu_portfolio_secret')
# UPLOAD_FOLDER = os.path.join('static', 'uploads', 'blog')
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# POSTS_FILE = 'posts.json'


# def load_posts():
#     if not os.path.exists(POSTS_FILE):
#         return []
#     with open(POSTS_FILE, 'r', encoding='utf-8') as f:
#         try:
#             return json.load(f)
#         except:
#             return []

# def save_posts(posts):
#     with open(POSTS_FILE, 'w', encoding='utf-8') as f:
#         json.dump(posts, f, indent=4)

# def post_to_linkedin(content, title=None):
#     access_token = os.environ.get('LINKEDIN_ACCESS_TOKEN', '')
#     author_urn = os.environ.get('LINKEDIN_AUTHOR_URN', '')
    
#     if not access_token or not author_urn:
#         print("LinkedIn credentials not found. Skipping LinkedIn sync.")
#         return False

#     url = "https://api.linkedin.com/v2/ugcPosts"
#     headers = {
#         "Authorization": f"Bearer {access_token}",
#         "Content-Type": "application/json",
#         "X-Restli-Protocol-Version": "2.0.0"
#     }

#     text = content
#     if title:
#         text = f"{title}\n\n{content}"

#     full_urn = author_urn if author_urn.startswith("urn:li:person:") else f"urn:li:person:{author_urn}"
#     payload = {
#         "author": full_urn,
#         "lifecycleState": "PUBLISHED",
#         "specificContent": {
#             "com.linkedin.ugc.ShareContent": {
#                 "shareCommentary": {
#                     "text": text
#                 },
#                 "shareMediaCategory": "NONE"
#             }
#         },
#         "visibility": {
#             "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
#         }
#     }

#     try:
#         response = requests.post(url, headers=headers, json=payload)
#         response.raise_for_status()
#         print("Successfully posted to LinkedIn")
#         return True
#     except requests.exceptions.RequestException as e:
#         print(f"Error posting to LinkedIn: {e}")
#         if e.response is not None:
#             print(f"LinkedIn API Response: {e.response.text}")
#         return False

# def fetch_from_linkedin():
#     access_token = os.environ.get('LINKEDIN_ACCESS_TOKEN', '')
#     author_urn = os.environ.get('LINKEDIN_AUTHOR_URN', '')
    
#     if not access_token or not author_urn:
#         return False, "LinkedIn credentials not found."

#     import urllib.parse
#     full_urn = author_urn if author_urn.startswith("urn:li:person:") else f"urn:li:person:{author_urn}"
#     encoded_urn = urllib.parse.quote(full_urn)
#     url = f"https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List({encoded_urn})"
#     headers = {
#         "Authorization": f"Bearer {access_token}",
#         "X-Restli-Protocol-Version": "2.0.0"
#     }
    
#     try:
#         response = requests.get(url, headers=headers)
#         response.raise_for_status()
#         data = response.json()
        
#         posts = load_posts()
#         existing_contents: list[str] = [str(p.get('content', '')) for p in posts]
#         added_count: int = 0
        
#         for element in data.get('elements', []):
#             content_obj = element.get('specificContent', {}).get('com.linkedin.ugc.ShareContent', {})
#             text = content_obj.get('shareCommentary', {}).get('text', '')
            
#             if text and text not in existing_contents:
#                 created_at = element.get('created', {}).get('time', int(datetime.utcnow().timestamp() * 1000))
#                 dt = datetime.utcfromtimestamp(created_at / 1000.0)
                
#                 new_post = {
#                     "id": str(uuid.uuid4()),
#                     "type": "normal",
#                     "title": None,
#                     "content": text,
#                     "media": [],
#                     "timestamp": dt.isoformat(),
#                     "source": "linkedin"
#                 }
#                 posts.append(new_post)
#                 existing_contents.append(text)
#                 added_count += 1  # type: ignore
                
#         if added_count > 0:
#             save_posts(posts)
            
#         return True, f"Synced {added_count} posts from LinkedIn."
#     except requests.exceptions.RequestException as e:
#         print(f"Error fetching from LinkedIn: {e}")
#         error_msg = str(e)
#         if hasattr(e, 'response') and e.response is not None:
#             error_msg = f"API Error: {e.response.status_code}"
#             print(f"LinkedIn API Response: {e.response.text}")
#         return False, f"Failed to pull posts: {error_msg}"



@app.route('/')
@app.route('/home')
def home():
    return render_template("index.html")


# @app.route('/blog', methods=['GET', 'POST'])
# def blog():
#     if request.method == 'POST':
#         action = request.form.get('action')
#         if action == 'login':
#             admin_user = os.environ.get('BLOG_ADMIN_USERNAME', 'admin')
#             admin_pass = os.environ.get('BLOG_ADMIN_PASSWORD', 'KittuBlog@2026!')
            
#             # Print to local console so we can debug value mismatches cleanly
#             print(f"DEBUG LOGIN | Entered: {request.form.get('username')}/{request.form.get('password')} | Expected: {admin_user}/{admin_pass}")
            
#             if request.form.get('username') == admin_user and request.form.get('password') == admin_pass:
#                 session['logged_in'] = True
#             else:
#                 flash('Invalid Username or Password! Check your python console for what it compared against.', 'error')
#             return redirect(url_for('blog'))
#         elif action == 'logout':
#             session.pop('logged_in', None)
#             return redirect(url_for('blog'))

#     posts = load_posts()
#     # Sort posts by newest first (descending timestamp)
#     posts.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
#     return render_template('blog.html', posts=posts, logged_in=session.get('logged_in', False))

# @app.route('/blog/create', methods=['POST'])
# def blog_create():
#     if not session.get('logged_in'):
#         return redirect(url_for('blog'))
    
#     post_type = request.form.get('post_type', 'normal')
#     content = request.form.get('content', '')
#     title = request.form.get('title', '')
    
#     media_paths = []
#     files = request.files.getlist('media')
#     for file in files:
#         if file and file.filename:
#             unique_id: str = str(uuid.uuid4().hex)
#             filename = secure_filename(f"{unique_id[:8]}_{file.filename}")
#             filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#             file.save(filepath)
#             media_paths.append(f"../{filepath.replace(os.sep, '/')}")
            
#     post = {
#         "id": str(uuid.uuid4()),
#         "type": post_type,
#         "title": title if post_type == 'article' else None,
#         "content": content,
#         "media": media_paths,
#         "timestamp": datetime.utcnow().isoformat()
#     }
    
#     posts = load_posts()
#     posts.append(post)
#     save_posts(posts)
    
#     if request.form.get('sync_linkedin') == 'true':
#         post_to_linkedin(content, title if post_type == 'article' else None)
    
#     return redirect(url_for('blog'))

# @app.route('/blog/sync_linkedin', methods=['POST'])
# def sync_linkedin_route():
#     if not session.get('logged_in'):
#         return redirect(url_for('blog'))
        
#     success, message = fetch_from_linkedin()
#     if success:
#         flash(message, 'success')
#     else:
#         flash(message, 'error')
        
#     return redirect(url_for('blog'))


@app.route('/about')
def about():
    return render_template("about.html")


@app.route('/skills')
def skills():
    return render_template("skills.html")


@app.route('/resume')
def resume():
    # resume_path = './static/pdfs/potlurikrishnapriyatham.pdf'
    # if request.args.get('download'):
    #     filename = request.args.get('filename')  # Get filename from query parameter
    #     # filename = None
    #     if not filename:
    #         return "Filename not provided for download", 400
    #     try:
    #         return send_file(
    #             resume_path,
    #             as_attachment=True,
    #             download_name=filename
    #         )
    #     except Exception as e:
    #         return f"Error sending file: {e}", 500
    # else:
    return render_template(
        'resume.html',
        download_f=True,
        download_url='resume'
        # download_url=url_for('resume_fun', download=False, filename='potlurikrishnapriyatham.pdf')
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
