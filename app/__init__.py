# Tambourine Cheese Cat Rhino :: Emma Buller, Christopher Liu, Tami Takada, Owen Yaggy
# SoftDev pd0
# P02 -- Interactive Map of Stuy
# 2022-03-22t

"""
App and Routes

Handles Flask routing for the app.
"""

from os import urandom

from flask import Flask, render_template, redirect, session, url_for, request
import database

app = Flask(__name__)
app.secret_key = urandom(32)

@app.route("/")
def index():
    return render_template("base.html", page_desc="Welcome to Moran's Maps", map=True)

@app.route("/editor", methods=["GET", "POST"])
def editor():
    # GET request: display the floor editor
    if request.method == "GET":
        floor = request.args.get("floor")
        rooms = [] # this will be the existing rooms
        image_src = "" # the source of the background image

        return render_template("editor.html", rooms=rooms, image_src=image_src)

    # POST request: handle editing a room or creating a new room
    else:
        print(request.form)
        return ""


@app.route("/about")
def about():
    return render_template("about.html")


if __name__ == "__main__":
    database.db_setup()
    app.debug = True
    app.run()
