# Tambourine Cheese Cat Rhino :: Emma Buller, Christopher Liu, Tami Takada, Owen Yaggy
# SoftDev pd0
# P02 -- Interactive Map of Stuy
# 2022-03-23

"""
App and Routes

Handles Flask routing for the app.
"""

import json
from os import urandom

from flask import Flask, render_template, redirect, session, url_for, request
import database
import werkzeug.security

app = Flask(__name__)
app.secret_key = urandom(32)


@app.route("/")
def index():
    return render_template("map.html")


@app.route("/editor", methods=["GET", "POST"])
def editor():
    # GET request: display the floor editor
    if not session.get('admin'):
        return redirect('admin')
    if request.method == "GET":
        floor = request.args.get("floor")
        rooms = database.get_all_rooms_on_floor(floor)
        roomData = json.dumps(rooms)
        image_src = url_for("static", filename=f"img/{floor}.png")

        return render_template(
            "editor.html",
            title="Floor Editor",
            page_desc="Floor Editor",
            map=True,
            roomData=roomData,
            image_src=image_src,
            floor=floor
        )
    else:
        if len(request.form.get('roomId')) == 0:
            database.add_room(
                int(request.form.get('floor')),
                request.form.get('roomName'),
                request.form.get('roomCoords'),
                room_number=request.form.get('roomNumber')
            )
        else:
            database.update_room(
                int(request.form.get('roomId')),
                int(request.form.get('floor')),
                request.form.get('roomName'),
                request.form.get('roomCoords'),
                room_number=request.form.get('roomNumber')
            )

        return redirect(url_for("editor", floor=request.form.get("floor")))


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/logout")
def logout():
    if session.get('admin'):
        session.pop('admin')
        return redirect('/')
    else:
        return redirect('/')


@app.route("/admin", methods=["GET", "POST"])
def admin():
    """Handles admin login page"""

    # Creates the hash of the admin password - does not need to be run every time
    key = "allpraisebrianmoran"
    key_hash = werkzeug.security.generate_password_hash(key)
    # TODO: just store the already generated key_hash
    # key_hash = "pbkdf2:sha256:260000$Yw9XjC6Y3VrAJRv1$9f64904c5bcd7adc04912286324e01d387da41d426e8a769f08ec57941f9b1d4"

    if request.method == "GET":
        if session.get('admin'):
            return redirect(url_for('editor'))
        else:
            return render_template('admin.html', error=False)
    if request.method == "POST":
        password = request.form['password']
        error = werkzeug.security.check_password_hash(key_hash, password)  # true if password correct
        if error == True:
            session['admin'] = True
            return redirect(url_for('editor', floor=1))
        return render_template("admin.html", error=not error)


if __name__ == "__main__":
    database.db_setup()
    app.debug = True
    app.run()
