Now THAT’s a title. It’s a bit like saying "How I invented bit shifting" or, for the less technical people reading this "**How I invented restaurants**". This is a tale of how a beginner’s ignorance meets serendipity to reinvent the wheel without even knowing it. 

This story is far from unique - maybe you had a similar experience - you solve a problem in a very specific way, you feel like you’ve achieved a breakthrough or invented a very clever concept. You go tell everyone about it, only to be met with "**Yeah, that’s just \<thing\>**, everyone knows about that". 

This is exactly what happened to me around **2018** when I started studying programming. I learnt much later what REST APIs were and that's why I want to reflect on this story and tell it.

# Context

In my first post-highschool year (us frenchmen would say "Etudes supérieures"), we had to create a web-app as our final project. Important detail, this curriculum was **not** a regular computer science or technical one: it was titled Multimedia and Internet Technologies (for fellow French readers we call it MMI). 

This curriculum is not really a web dev one, but kind of ; not really a graphic design one, but kind of ; not really a film-making one, but kind of (you get the idea). It was a **generalistic pathway** to many specializations under the umbrella term "Multimedia". 

This meant that a large majority of people were not there to learn programming, were not particularly tech-savvy and wouldn't pursue programming afterwards (although tech and programming constituted about **half** of the curriculum).

# The project

At the end of the year came the time of final project. We would work on small teams over the course of a few months to deliver some kind of **multimedia project**. That year, we had to make a web app for a song lyrics guessing game. I was the only one who could program in the team, so I was tasked with implementing the game's core logic.

Bear in mind this was my **first year** of actual programming. I did dabble a bit before that but it was the first time I learnt whole tech stacks and had to ship real things, it was just not "guess the number" project at home anymore. 

Concepts were introduced very fast, **sometimes too briefly**, not necessarily in an order that made sense. The relationship between different topics we learnt in different classes were not obvious. For many students including myself, we did PHP with the PHP professor to do PHP things, which are different from what we did in JS with the JS professor etc. Frontend meant doing JS, backend meant doing PHP and technicalities such as how HTTP communication works were just things to remember for a good grade.

The only way we were taught to handle user input and compare it against data stored in a database was strictly : 
1. Add an HTML form on a page redirecting to another page with a GET/POST request
2. On that page, use PHP’s `$_GET` and `$_POST` to retrieve user input
3. Query the database using questionable methods (write the SQL query in a variable and use [addslashes](https://www.php.net/manual/en/function.addslashes.php) to avoid SQL injections, yes I was taught this)
4. Conditionally render the page so the user gets feedback

**And that’s it**. Nobody had any concept of what GET/POST meant, you used GET if you didn't care that the requests parameters are displayed in the URL, you used POST if you didn't want that. Nobody really understood why we had to use PHP to query the database. We kinda knew that JSON was a thing, but we had no idea that a web page could serve JSON. 

# AJAX to the rescue

The project's pitch was very simple : the player gets 5 seconds of music, part of the lyrics are hidden and they have to fill in the blanks with a time constraint. Do it 10 times and you get a score. We wanted the user to input a word, hit enter, and the game fills the blanks which are correctly guessed. We also wanted the page to **not refresh in between songs** (so the user couldn’t refresh the page to reset timers, keep track of the score etc.)

This last part was the hard problem to solve. It is a **technical wonder** to be able to communicate with the backend without refreshing a web page, only possible by the biggest tech giants - at least that’s what we thought. So I started researching.

I discovered [AJAX](https://developer.mozilla.org/fr/docs/Glossary/AJAX) and by tinkering around for too long because I had no idea what I was doing, I discovered that I could get the content of another web page without leaving the current one. **BINGO**.

# Revolutionizing web dev

I wrote a `gen.php` page that would display regular text. This page was accessible to the public but was meant to be queried from JS using **AJAX**, what a revolutionary idea. 

When going to `mysite.com/gen.php`, the script would find a random song from the database with info such as : title, author, deezer url and lyrics. It would then remove random words from the lyrics and replace them with placeholders, so the client would receive something like:
```
Ground _______ to Major ___ (___, nine, eight, seven, six)  
Commencing _________, _______ on (five, four, _____, two)  
```

Wait, "the client would receive" what does that even mean? I can’t just [send structured data to the user](https://datatracker.ietf.org/doc/html/rfc4627.html) only HTML! When querying the URL with AJAX, I did get the page's content in a string, so I came up with a format I could easily deconstruct: 
```
Space Oddity / David Bowie / some_id_for_deezer / Ground _______ to Major ___ (___, nine, eight, seven, six)\nCommencing _________, _______ on (five, four, _____, two)
```

And then in the response callback to my XMLHttpRequest I would do something like
```js
xhr.onload = function () { 
	if (xhr.status >= 200 && xhr.status < 300) {
		var result = xhr.responseText.split("/");
		songName = result[0];
		songAuthor = result[1];
		deezerId = result[2];
		lyrics = result[3];
		startGame();
	}
```

Really clever hack right? And so that groundbreaking tech was the backbone of that small project, and it worked honestly quite well.

# What’s a REST and why does it have a PI?

So what did I "invent" in that student project? It’s a concept called **RESTful APIs** first described in the same year I was born (2000).

Roughly, what we call an **API** is *some way for my code to interact with apps that aren’t my code*. 

Imagine you’re on the Microsoft Windows operating system (very unlikely but let’s imagine) and you want to create a **new window for your app**. The OS is named Windows because its primary job is to manage… windows. You ask it to create one for you using the [Windows API](https://fr.wikipedia.org/wiki/Windows_API) that Microsoft kindly gives you access to.

To give you an idea, here is what it looks like (this is not a real example)
```cpp
// We use the windows api provided by Microsoft
#include <windows.h>

int main() {
	// The API gives us the CreateWindowEx function which will spawn a window
    HWND my_window = CreateWindowEx(/* Things go here */);
}
```

Cool story bro, but what does it have to do with web stuff and **RESTing**?

Originally, **the Web** was conceived as a way to access **documents** on other computers and only that. When you ask a web server what's at some URL, that server just sends you that file (an image, text, video whatever). We invented special document formats such as HTML so that the program you use can display the document in a fancier way, but **it's just a text document**. 

This means that once the server has sent the document there is **no way** to update its content without a full reload. No dynamic cool web apps like Discord, Spotify or Club Penguin.

RESTful architecture is just a set of rules describing how to serve content that is not intended for direct human use. You can use any format, the most popular one is [JSON](https://fr.wikipedia.org/wiki/JavaScript_Object_Notation#:~:text=JSON%20sert%20%C3%A0%20faire%20communiquer,transmettre%20par%20le%20protocole%20HTTP.). The base URL of such an API is called an "**endpoint**".

For example, this allows JS code running in the user’s browser to ask the server for data without reloading the page! And because we use JSON, we don’t need to parse the result, it becomes a [Plain old JS Object](https://fr.wikipedia.org/wiki/Plain_old_Java_object).

# Same project, after a good REST

**Wait! That’s what we did above!** But in a better way.

Instead of a `gen.php` page that gives off text, we have a `/api` "page" (the endpoint) as the **API's "base URL"**.

Then to retreive a random song, we go to `/api/random-song`. Instead of rendering a regular web page like you're reading right now, you literally see the following content and nothing else: 
```json
{
	"title": "Space Oddity",
	"author": "David Bowie",
	"deezer_id": "something",
	"lyrics": [
		"Ground _______ to Major ___ (___, nine, eight, seven, six)",
		"Commencing _________, _______ on (five, four, _____, two)"
	]
}
```

*Wtf is a deezer_id?[^1]*

This makes it really easy to retrieve the data on the browser (note that xhr is kinda old there are better ways to do it today)
```js
xhr.onload = function () { 
	if (xhr.status >= 200 && xhr.status < 300) {
		var song = xhr.response;
		// And that's it! For example print the songs name like
		console.log(song.name);
		startGame();
	}
```

Not only is this neat, it saves a lot of headaches that I didn't mention (for example, what if one of the fields contains slashes?).

# Too Long Didn’t REST

**Wanna see what it looks like?** You can actually preview what an API endpoint gives off in your browser. If until here you were lost in the technical details, this is the part that’ll make it click. 

Let’s say I’m making a game or an app about Pokémons and I need info about the Pokémon called **Ditto**.

[Click here to view a regular web page about Ditto](https://bulbapedia.bulbagarden.net/wiki/Ditto_(Pok%C3%A9mon))
[Click here to view info about Ditto from a REST API](https://pokeapi.co/api/v2/pokemon/ditto) *(you can click the "collapse all" button on top to make it easier to read)*

Note that on the second link your browser is **tricking** you. It shows you these nice buttons and colors and presentation. These are just commodities the browser renders when a web page gives off JSON data so it’s easier to read for humans. If you go on top to the "**Raw Data**" tab you will see the actual string of text your browser received.

# What’s the point?

This means that if you want to make any kind of app that needs to look for data remotely, you can just get it from the API endpoint! 

For example when making a game, if you want to display **news**, create an API endpoint, in the game query that endpoint, display the text as you wish. You can now update players about news without reuploading your game!

Wanna see it in action? Type in the name of any **Pokémon** (e.g. Ditto, Magikarp, Pikachu, Eevee, Mewtwo…) and click the button, it will give you info about it.

<input value="Ditto" type="text" id="pkmnName" placeholder="Enter Pokémon name" />

<div id="pkmnLog">
Enter a Pokémon’s (English) name to start…
</div>

<button id="pkmnSubmit">Show me!</button>
<script src="/static/pkmn.js"></script>

# Takeaways?

**Do reinvent the wheel** contrary to what's usually advised. That's a great path to learn and understand why things are the way they are. Don't just write code how it's supposed to be written "because that's how it works". 

Instead, try and **solve problems by yourself**. I've had a long journey since then, and learnt countless things I couldn't even have imagined making back then. Projects where I struggled and gave up because they were too hard would today be afternoon projects. 

Yet, I wanted to share this anecdote that glimpses into my thought process when solving problems. **Being a programmer is not about writing code that works**, it's about having that problem-solving mindset.

**Finding workarounds is the greatest skill**. Because by doing so, you're not just copy/pasting some code from docs, you're using your knowledge of how things work and using it to achieve what you have in mind. Making things work with such hacks truly proves that you understand the underlying machinery.

**Hacks are the very foundation of all software and tech.** From reinventing REST with a crude PHP script to the geniuses who invented the very foundations that make any computer possible - it's all just a series of clever hacks built on top of each other. 

Your computer can only represent zeroes and ones. Smart people spent time finding a hack to represent all integer numbers using these zeroes and ones. Then they found hacks to represent [decimal numbers](https://standards.ieee.org/ieee/754/6210/) and doing math on them. This allowed other people to find hacks to [run interpreted C++](https://www.youtube.com/watch?v=cFtymODJEjs) and… **THEY DID WHAT?**

# Footnotes

[^1] **Deezer** is a French Spotify competitor. We were advised by professors to use their free 5 seconds song preview API which was perfect for our lyrics guessing game without the need for expensive subsidies.