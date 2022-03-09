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
    return render_template("polygon.html")
    
@app.route("/about")
def about():
    return render_template("about.html")

if __name__ == "__main__":
    database.db_setup()
    app.debug = True
    app.run()
