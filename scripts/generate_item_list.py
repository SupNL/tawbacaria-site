import os, json, datetime

data = None
with open(os.path.join('src', 'assets', 'products.json'), 'r', encoding='utf-8') as fp:
    data = json.loads(fp.read())

date = datetime.datetime.now()

str_date = f'{str(date.year)}-{str(date.month).zfill(2)}-{str(date.day).zfill(2)}'

with open(os.path.join('script_output', f'{str_date}.txt'), 'w', encoding='utf-8') as fp:
    for category, items in data.items():
        fp.write(category + '\n')
        for item in items:
            prefix = ''
            if not item['in_stock']:
                prefix = '🚫🚫 '
            elif item['is_highlight']:
                prefix = '⭐⭐ '
            fp.write('\t' + prefix + item['label'] + '\n')
            fp.write('\t' + prefix + item['code'] + '\n\n')
