from googlesearch import search
import requests
from pyhelpers.ops import is_downloadable

pieces = [
          "Academic Festival Overture - Johannes Brahms"]

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
