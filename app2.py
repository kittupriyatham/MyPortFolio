from flask import Flask, render_template, request
from MachineLearningCode import MachineLearningCode


class MachineLearningModelDeployment:
    # apps initializations
    app = Flask(__name__)

    MLC = MachineLearningCode()

    # routes definitions

    @app.route('/projects/')
    def home(self):
        MachineLearningModelDeployment.MLC.train()
        return render_template("MLMD_Index.html", Predicted_flower_name="Predicted flower name",
                               Accuracy_of_prediction="Accuracy of prediction")

    @app.route('/projects/', methods=['POST'])
    def predictandoutput(self):
        sl = request.form["slengthin"]
        sw = request.form["swidthin"]
        pl = request.form["plengthin"]
        pw = request.form["pwidthin"]
        Result = MachineLearningModelDeployment.MLC.predict(sl, sw, pl, pw)
        return render_template("MLMD_Index.html", Predicted_flower_name=Result[0][0], Accuracy_of_prediction=Result[1])

    @app.route('/projects/dashboard')
    def dashboard(self):
        return render_template("MLMD_Dashboard.html")

    @app.route('/projects/about')
    def about(self):
        return render_template("MLMD_About.html")


# app run

if __name__ == '__main__':
    o = MachineLearningModelDeployment()
    o.app.run(debug=True)
