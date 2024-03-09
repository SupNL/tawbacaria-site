import json, os

# Sample JSON data structure
product_categories = None
with open(os.path.join('src', 'assets', 'products.json'), 'r', encoding='utf-8') as fp:
    product_categories = json.loads(fp.read())

def check_unique_product_ids(categories):
    # Dictionary to keep track of the ids and their corresponding names and categories
    seen_ids = {}
    
    # Iterate over each category and product
    for category, products in categories.items():
        for product in products:
            product_id = product["image_url"]
            product_name = product["label"]

            if not product_id:
                continue
            
            # If the ID has already been seen, report the duplicate
            if product_id in seen_ids:
                print(f"Product {category}-{product_name} has the same ID as {seen_ids[product_id]['category']}-{seen_ids[product_id]['name']}")
            else:
                # If not, add it to the dictionary
                seen_ids[product_id] = {"category": category, "name": product_name}

# Run the check
check_unique_product_ids(product_categories)