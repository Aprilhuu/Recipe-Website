
from app import create_app
import os

app = create_app()

@app.route("/test") 
def home_view(): 
        return "<h1>Welcome to Geeks for Geeks</h1>"
  
@app.route("/deployment") 
def d_view(): 
        return "<h1>Deployment</h1>"


if __name__ == '__main__':

    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0')
