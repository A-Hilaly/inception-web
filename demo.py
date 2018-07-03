import os

from flask import (
    Flask, 
    redirect, 
    url_for, 
    render_template, 
    request, 
    session,
    make_response, 
    jsonify,
)

from inception import (
    create_graph, 
    download_and_extract, 
    run_inference_on_image,
)
from shutil import copyfile
from werkzeug.utils import secure_filename

# Constants
UPLOAD_FOLDER = './static/images'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

# Flask app
app = Flask(__name__, static_url_path='/static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

progInterface = [
    {"ID": 1, "Str": "one"},
    {"ID": 2, "Str": "two"},
    {"ID": 3, "Str": "3"},
    {"ID": 4, "Str": "4"},
    {"ID": 5, "Str": "5"},
]

def uploadedImage(image):
    return os.path.join(UPLOAD_FOLDER, image)

def sendJSON(obj):
    return make_response(jsonify(obj))

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/run_inference/<image>', methods=["POST", "GET"])
def api_run_inference(image):
    try:
        # Create graph
        create_graph()
        result = run_inference_on_image(uploadedImage(image), 5)
        return sendJSON({
            "success" : True,
            "response" : result,
        }), 200
    except:
        return sendJSON({
            "success" : False,
            "error_code" : 500,
        }), 200

@app.route('/upload_image', methods=["post"])
def form_upload_image():
    if 'file' not in request.files:
        return redirect('upload')

    file = request.files['file']
    if file.filename == '':
        return redirect('upload')

    if file and allowed_file(file.filename):
        if request.form['name']:
            s = secure_filename(file.filename).split('.')
            filename = request.form['name'] + '.' + s[1]
        else:
            filename = secure_filename(file.filename)
        file.save(os.path.join(uploadedImage(filename)))
        return redirect('upload')

@app.route('/delete_image/<image>', methods=["post"])
def delete_image(image):
    if image == '' or not os.path.exists(uploadedImage(image)) :
        return sendJSON({
            "success" : False,
            "error": "file not found",
        });
    os.remove(uploadedImage(image))
    return sendJSON({
        "success" : True,
    })

@app.route('/upload')
def upload():
    return render_template("upload.html")

@app.route('/demo')
def demo():
    ls=[]
    for file in os.listdir(UPLOAD_FOLDER):
        r={
            "Name" : file,
            "Namebase" : file.split('.')[0],
        }
        ls.append(r)
    
    return render_template("demo.html", uploads=ls, proginterface=progInterface)

if __name__ == "__main__":
    # Download inception model
    download_and_extract()
    # Run server
    app.run(port=8002, debug=True)