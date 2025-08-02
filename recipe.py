from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the Flask-CORS library
import requests

app = Flask(__name__)
CORS(app)  # Apply CORS to the entire Flask application

# If you only want to allow certain origins, you can specify them like this:
# CORS(app, origins=["http://127.0.0.1:5500"])


# API key for Spoonacular
api_key = "ae7bc690ee424e17800999e4693a4b97"

def fetch_recipe_ids_by_ingredients(ingredients):
    url = f"https://api.spoonacular.com/recipes/findByIngredients?ingredients={','.join(ingredients)}&apiKey={api_key}&number=7"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            recipes = response.json()
            recipe_ids = [recipe["id"] for recipe in recipes]
            return recipe_ids
        else:
            print("Error fetching recipe IDs:", response.text)
            return []
    except Exception as e:
        print("Error fetching recipe IDs:", str(e))
        return []

def fetch_recipe_information(recipe_ids):
    url = f"https://api.spoonacular.com/recipes/informationBulk?ids={','.join(map(str, recipe_ids))}&apiKey={api_key}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            recipe_info = response.json()
            return recipe_info
        else:
            print("Error fetching recipe information:", response.text)
            return []
    except Exception as e:
        print("Error fetching recipe information:", str(e))
        return []

@app.route('/get_recipes', methods=['POST'])
def get_recipes():
    #get the request data from the frontend
    data = request.get_json()

    if not data or 'ingredients' not in data:
        return jsonify({"error": "No ingredients provided"}), 400
    
    ingredients = [ing.strip() for ing in data['ingredients'].split(",")]
    recipe_ids = fetch_recipe_ids_by_ingredients(ingredients)
    
    if not recipe_ids:
        return jsonify({"error": "No recipes found for the provided ingredients"}), 404
    
    recipes_info = fetch_recipe_information(recipe_ids)
    if not recipes_info:
        return jsonify({"error": "Error fetching recipe information"}), 500
    

    #send the response data to the frontend
    return jsonify(recipes_info)

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
