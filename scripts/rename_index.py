import random, string, os

def generate_random_string():
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(15))
    return random_string

# Generate a random string
random_string = generate_random_string()

file_content = ''
with open(os.path.join('docs', 'index.html'), mode='r') as fp:
    file_content = fp.read()

file_content = file_content.replace('.js', f'.js?{random_string}')

with open(os.path.join('docs', 'index.html'), mode='w') as fp:
    fp.write(file_content)