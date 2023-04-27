from googlesearch import search
import requests
from pyhelpers.ops import is_downloadable

pieces = [
          "Partita No. 2, Chaconne - J.S. Bach",
          "Rondo Alla Turca - Wolfang Amadeus Mozart",
          "Hungarian Rhapsody No. 2 - Franz Liszt",
          "Academic Festival Overture - Johannes Brahms",
          "Violin Concerto No. 1 in G minor - Max Bruch",
          "Piano Concerto No. 1 - Pyotr Ilyich Tchaikovsky",
          "Violin Concerto in D Major - Pyotr Ilyich Tchaikovsky",
          "Symphony No. 4 in F minor - Pyotr Ilyich Tchaikovsky",
          "Symphony No. 5 in E minor - Pyotr Ilyich Tchaikovsky",
          "Symphony No. 6 in B minor - Pyotr Ilyich Tchaikovsky",
          "1812 Overture - Pyotr Ilyich Tchaikovsky",
          "Capriccio Espangol - Nikolai Rimsky-Korsakov",
          "Flight of the Bumblebee - Nikolai Rimsky-Korsakov",
          "Navarra - Pablo de Sarasate",
          "Zigeunerweisen - Pablo de Sarasate",
          "Zapateado - Pablo de Sarasate",
          "Maple Leaf Rag - Scott Joplin",
          "Piano Concerto No. 2 - Sergei Rachmaninoff",
          "Prelude in G minor - Sergei Rachmaninoff",
          "Symphony No. 2 in E minor - Sergei Rachmaninoff",
          "Symphonic Dances - Sergei Rachmaninoff"]

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
