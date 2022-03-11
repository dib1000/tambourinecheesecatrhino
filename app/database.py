import sqlite3
import random


def get_db():
    return sqlite3.connect("database.db")


def db_setup():
    db = get_db()
    c = db.cursor()

    command = "CREATE TABLE IF NOT EXISTS rooms (room_id INTEGER PRIMARY KEY, floor INTEGER KEY, room_number TEXT, room_name TEXT NOT NULL, coordinates TEXT NOT NULL, room_info TEXT);"
    c.execute(command)

    db.commit()
    db.close()


def generate_unique_id():
    db = get_db()
    c = db.cursor()

    room_id = 0
    rooms = True
    while rooms:
        room_id = random.randint(1000, 9999)
        command = "SELECT * FROM rooms WHERE room_id = ?"
        rooms = c.execute(command, (room_id,)).fetchone()

    db.close()
    return room_id


def add_room(floor, room_name, coordinates, room_number="", room_info=""):
    db = get_db()
    c = db.cursor()

    room_id = generate_unique_id()

    command = "INSERT INTO rooms (room_id, floor, room_number, room_name, coordinates, room_info) VALUES (?, ?, ?, ?, ?, ?)"
    c.execute(command, (room_id, floor, room_number, room_name, coordinates, room_info))

    db.commit()
    db.close()


def get_all_rooms_on_floor(floor):
    db = get_db()
    c = db.cursor()

    command = "SELECT * FROM rooms WHERE floor = ?"
    rooms = c.execute(command, (floor,)).fetchall()

    db.close()

    return rooms


def get_room(room_id):
    db = get_db()
    c = db.cursor()

    command = "SELECT * FROM rooms WHERE room_id = ?"
    room = c.execute(command, (room_id,)).fetchone()

    db.close()

    return room


def set_room_info(room_id, info):
    db = get_db()
    c = db.cursor()

    command = "UPDATE rooms SET room_info = ? WHERE room_id = ?"
    c.execute(command, (info, room_number))

    db.commit()
    db.close()


def add_to_room_info(room_id, new_info):
    current_info = get_room(room_id)[4]
    if len(current_info) > 0:
        revised_info = current_info[:-1]
        revised_info += f", {new_info[1:]}"
        set_room_info(room_id, revised_info)
    else:
        set_room_info(room_id, new_info)

def update_room(room_id, floor, room_number, room_name, coordinates, room_info=""):
    db = get_db()
    c = db.cursor()

    command = "UPDATE rooms SET floor = ?, room_number = ?, room_name = ?, coordinates = ?, room_info = ? WHERE room_id = ?"
    c.execute(command, (floor, room_number, room_name, coordinates, room_info, room_id))

    db.commit()
    db.close()


def delete_room(room_id):
    db = get_db()
    c = db.cursor()

    command = "DELETE FROM rooms WHERE room_id = ?"
    c.execute(command, (room_id,))

    db.commit()
    db.close()
