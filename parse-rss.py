import re
import html
import time
import requests
import csv
import xml.etree.ElementTree as ET
#for Python 2.7
import io
import shutil


# helper functions: unescape_non_xml_named_entities and escape_bare_ampersands
# for fixing non-XML encoding

def unescape_non_xml_named_entities(s: str) -> str:
    named = re.compile(r"&([A-Za-z][A-Za-z0-9]+);")
    def repl(m):
        name = m.group(1)
        return m.group(0) if name in ("lt","gt","amp","quot","apos") else html.unescape(m.group(0))
    return named.sub(repl, s)


def escape_bare_ampersands(s: str) -> str:
    """
    Replace '&' that are NOT starting a valid entity with '&amp;'.
    This preserves things like &lt;, &amp;, &#160;, &#xA0; etc.
    """
    return re.sub(
        r"&(?!(?:[A-Za-z][A-Za-z0-9]*|#\d+|#x[0-9A-Fa-f]+);)",
        "&amp;",
        s
    )

############################
# main program starts here #
############################
# #Get the rss feed from the url and write to file
url = ('https://listserv.acm.org/SCRIPTS/WA-ACMLPX.CGI?RSS&L=MOD-DBWORLD&v=2.0&LIMIT=256')

headers = {
    "User-Agent": "DBworldFetcher/1.0",
    "DBworld": "sigmod"
}

feed = requests.get(url, headers=headers, allow_redirects=True)

filename = 'dbworldfeed.xml'
with io.open(filename, 'wb') as f:
    f.write(feed.content)

# #Parse the rss feed
# Byron: old code, not used any more
#tree = ET.parse(filename)
#root = tree.getroot()

with io.open(filename, "r", encoding="utf-8") as f:
    content = f.read()

parser = ET.XMLParser()

# deal with non-XML encoding
content = unescape_non_xml_named_entities(content)
content = escape_bare_ampersands(content)

root = ET.fromstring(content, parser=parser)


# #Iterate through the feed and collect the data from each item
feed_posts = []
for item in root.findall('./channel/item'):
    item_elements = {}
    for child in item:
        item_elements[child.tag] = child.text
    feed_posts.append(item_elements)

# #Create browse.html and write the data into it
# Use utf-8 (due to Python 2.7 on Cpanel) to write the data
#with io.open('browse.html', 'w', encoding="utf-8") as browse:
with io.open('/home/sigmod/dbworld/www/html/browse.html', 'w', encoding="utf-8") as browse:
    browse.write(u"<HTML>\n<HEAD>\n<META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html;charset=UTF-8\">\n" +
                 "<TITLE>DBWorld: Recent Messages</TITLE>\n" +
                 "<link href='http://fonts.googleapis.com/css?family=Michroma' rel='stylesheet' type='text/css'>\n" +
                 "<link rel='stylesheet' href='/dbworld/css/dbworld.css'>\n" +
                 "<link rel='stylesheet' href='/dbworld/css/table.css'>\n" +
                 "</HEAD>\n<BODY>\n<TABLE BORDER=1>\n<THEAD>\n<TR>\n<TH>Sent</TH>\n<TH>From</TH>\n" +
                 "<TH>Subject</TH>\n</TR>\n</THEAD>")
    for item in feed_posts:
        browse.write(u"<TBODY>\n<TR VALIGN=TOP>\n")
        if type(item['pubDate']) == str:
            browse.write(u"<TD>" + item['pubDate'] + "</TD>\n")
        else:
            browse.write(u"<TD></TD>\n")
        if type(item['author']) == str:
            browse.write(u"<TD>" + str(item['author']) + "</TD>\n")
        else:
            browse.write(u"<TD>" + item['author'] + "</TD>\n")
        if type(item['title']) == str:
            browse.write(u"<TD><A HREF=" + item['link'] + ">" + str(item['title']) + "</A> </TD>")
        else:
            browse.write(u"<TD><A HREF=" + item['link'] + ">" + item['title'] + "</A> </TD>")
        browse.write(u"</TR></TBODY>\n")
    browse.write(u"</TABLE>\n</BODY>\n</HTML>")

