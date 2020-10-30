
from app import create_app

app = create_app()

@app.route("/test") 
def home_view(): 
        return "<h1>Welcome to Geeks for Geeks</h1>"


if __name__ == '__main__':
    app.run(debug=True)
