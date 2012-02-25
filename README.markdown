Game of Life
============

The Project
-----------

So first of all, I have a little disclaimer: This is not actually an implementation of the 3D version of the game of life! This is actually a 3D implementation of the 2D version of the game of life. That distinction can (and has been) confusing :) so here's what I mean:

* Game of Life 3D: [http://www.ibiblio.org/e-notes/Life/Game.htm](http://www.ibiblio.org/e-notes/Life/Game.htm)
* Game of Life 2D: [http://www.bitstorm.org/gameoflife/](http://www.bitstorm.org/gameoflife/)
* Game of Life 2D - in a 3D world: [http://cl.ly/2x0e35041g2Y2J0z2S2i](http://cl.ly/2x0e35041g2Y2J0z2S2i)

The reason I didn't go for the full-on 3D version is that, mostly, I like the original version better! its simplicity and aesthetics are quite beautiful. Moreover, the 3D generalization needs a lot of juice to run, and I'd rather avoid lawsuits due to CPUs catching on fire...

So, you may ask, "why choose the game of life in the first place?". That's an excellent question, thanks! Basically I wanted a website so people can reach me, read a little about me and what I like and dislike, but I also wanted it to be somewhat of an art project, and try to be creative in a fun way. The website is also about my life, technology, software, simplicity and creativity. I took all those keywords and rolled with it.

Ultimately, I started coding it for fun, and rolled out an initial version that was kind of cool, albeit a little crude. Then I discovered [Three.js](http://mrdoob.github.com/three.js/) and I just **had to** add that to my site. It was the missing piece.

The Stack
---------

I already talked a little bit about Three.js and how it's a cupful of WIN. But what I'm really using beneath that, is WebGL, which is a nice alternative to canvas, and it uses your GPU to render stuff, so it takes the load away from your CPU, and has more power to process video.

The only other dependency is jQuery, which I really don't use much, so I might just get rid of that.

The backend is almost nonexistent here, since I don't need much.. but I am using Ruby 1.9.3 with the Cuba framework (which is really just a couple dozens lines on top of Rack), and it's even faster than sinatra! (if you are a rails developer I definitely recommend [you check it out](http://cuba.is))

It's worth mentioning that I am mostly a backend developer. I don't have to deal much with UI in my work, but this project is 99% frontend code.

Optimization driven development (odd, yeah)
-------------------------------------------

Coming up with the algo for the game of life was pretty simple. It has only 3 or 4 rules after all.

That being said, when I created my initial version it was slow as hell! I had to learn much about optimizing javascript, using the google closure compiler in advanced mode and taking advantage of new features like web workers! but most importantly, I needed to improve the original algo and lower it's complexity.

The first optimization I made was to lower the grid I was using, from some silly number like 1000 x 1000 cubes, to 200 x 200. I also added frame buffering for the initial 2D version (that is, drawing first on a hidden canvas and then copying it to the foreground). I also used dirty rectangles, which basically means to not draw things that were already drawn again, and also cached whatever I could. Precompute calculations beforehand, instead of doing them during the animation, etc etc etc.

It wasn't all easy to do, or even useful! one nasty surprise I had was that after adding web workers to calculate which cubes needed to live or die next, everything was suddenly slower! it turned out that was because the synchronization time between the worker and the main js was taking longer than what I was trying to calculate, so I had to calculate several generations at a time, to make the sync time irrelevant.

All in all, this project proved challenging each step of the way, and I'm sure I still have a gazillion optimizations and heuristics I could add. It was also a great learning experience.
