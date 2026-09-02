import bcrypt

from database.mongodb import users_collection


def find_user_by_email(email):

    return users_collection.find_one({
        "email": email
    })


def create_user(user):

    result = users_collection.insert_one(user)

    return str(result.inserted_id)


def hash_password(password):

    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


def check_password(password, hashed_password):

    return bcrypt.checkpw(
        password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )