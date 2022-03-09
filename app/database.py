import sqlite3

def get_db():
    return sqlite3.connect("database.db")

def db_setup():
    db = get_db()
    c = db.cursor()

    command = "CREATE TABLE IF NOT EXISTS rooms (floor INTEGER KEY, room_number INTEGER PRIMARY KEY, room_name TEXT NOT NULL, coordinates TEXT NOT NULL, room_info TEXT);"
    c.execute(command)

    db.commit()
    db.close()

def add_room(floor, room_number, room_name, coordinates, room_info=""):
    db = get_db()
    c = db.cursor()

    command = "INSERT INTO rooms (floor, room_number, room_name, coordinates, room_info) VALUES (?, ?, ?, ?, ?)"
    c.execute(command, (floor, room_number, room_name, coordinates, room_info))
           
    db.commit()
    db.close()

def get_room(room_number):
    db = get_db()
    c = db.cursor()

    command = "SELECT * FROM rooms WHERE room_number = ?"
    room = c.execute(command, (room_number,)).fetchone()

    db.close()

    return room

def set_room_info(room_number, info):
    db = get_db()
    c = db.cursor()

    command = "UPDATE rooms SET room_info = ? WHERE room_number = ?"
    c.execute(command, (info, room_number))

    db.commit()
    db.close()
    
def add_to_room_info(room_number, new_info):
	current_info = get_room(room_number)[4]
	if len(current_info) > 0:
		revised_info = current_info[:-1]
		revised_info += f", {new_info[1:]}"
		set_room_info(room_number, revised_info)
	else:
		set_room_info(room_number, new_info)
