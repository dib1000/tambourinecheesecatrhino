# Tambourine Cheese Cat Rhino :: Emma Buller, Christopher Liu, Tami Takada, Owen Yaggy
# SoftDev pd0
# P02 -- Interactive Map of Stuy
# 2022-03-23

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
    return render_template("map.html")


@app.route("/editor", methods=["GET", "POST"])
def editor():
    # GET request: display the floor editor
    if request.method == "GET":
        floor = request.args.get("floor")
        rooms = database.get_all_rooms_on_floor(floor)
        image_src = url_for(
            "static", filename=f"img/{floor}.png"
        )  # the source of the background image

        return render_template(
            "editor.html",
            title="Floor Editor",
            page_desc="Floor Editor",
            map=True,
            rooms=rooms,
            image_src=image_src,
        )
    else:
        if len(request.form.get("roomId")) == 0:
            database.add_room(
                int(request.form.get("roomNumber")[0]),
                request.form.get("roomNumber"),
                request.form.get("roomName"),
                request.form.get("roomCoords"),
            )
        else:
            database.update_room(
                int(request.form.get("roomId")),
                int(request.form.get("roomNumber")[0]),
                request.form.get("roomNumber"),
                request.form.get("roomName"),
                request.form.get("roomCoords"),
            )

        return redirect("editor")


@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/login")
def login():
    return render_template("login.html")


if __name__ == "__main__":
    database.db_setup()
    app.debug = True
    app.run()
