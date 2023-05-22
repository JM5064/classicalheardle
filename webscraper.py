from googlesearch import search
import requests
from pyhelpers.ops import is_downloadable
import json

pieces = []

# Opening JSON file
with open('pieces.json') as json_file:
    data = json.load(json_file)['composers']
    for i in range(len(data)):
        works = data[i]['works']
        composer = data[i]['name']
        for j in range(len(works)):
            work_name = works[j]['title']
            if works[j]['popular'] == '1':
                if work_name[len(work_name) - 1:] == ' ':
                    pieces.append(work_name + '- ' + composer)
                else:
                    pieces.append(work_name + ' - ' + composer)

for i in range(len(pieces)):
    print(pieces[i])

for i in range(len(pieces)):
    piece = pieces[i]
    query = "imslp " + piece

    links = list(search(query, num_results=1))
    link = links[0]
    # for j in links:
    #     print(j)
    #     print('\n')

    r = requests.get(link)
    data = str(r.content)

    index = data.find('mp3"')
    rec_link = 'https://imslp.org/' + data[data.rfind('"', 0, index) + 1:index + 3]

    if is_downloadable(rec_link):
        r = requests.get(rec_link, allow_redirects=True)
        open('recordings/' + str(i) + '. ' + piece + '.mp3', 'wb').write(r.content)
        print('Success: ' + piece)
    else:
        print('Failed: ' + piece)
    # webbrowser.open(rec_link)

if is_downloadable('https://api.openopus.org/work/dump.json'):
    r = requests.get('https://api.openopus.org/work/dump.json', allow_redirects=True)
    open('pieces.txt', 'wb').write(r.content)
    print('Success')
else:
    print('Failed')
