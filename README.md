This tasks were completed with the usage of vanilla JS, except for the utility libraries being used in the first task for establishing connection to Redis and generating random data.

# Redis messenger

In the redis-messenger dir, you can run:

### `npm start`

Runs the script for the main entry point:
`"start": "node app.js"`

## Results of testing the program:

So, suppose we run 3 instances of the program.

![First instance](https://i.gyazo.com/f75b2a84b1216b1df97df5d0205cadc9.png) 

This will be our first instance which is converted to generator as we have no other generators in the queue.  

![Second instance](https://i.gyazo.com/e375fc4e19e79fd15b864a5691a5ce03.png)

![Third instance](https://i.gyazo.com/2d53a04599db064c73da89ef46301ad3.png)

These are our second and third instances (listeners now as we have an active generator).  
Therefore, we destroy our currently active messenger instance to check if the result is similar to what we expect it to be.

![Destroyed instance](https://i.gyazo.com/28273883e4ec0de89cb036041538862a.png) 

One of our listeners instantly becomes a generator.  
![Generator instance](https://i.gyazo.com/fdbca5e6799518a8537149cbb3559d09.png)
While the other one continues to listen.  
![Listener instance](https://i.gyazo.com/dbdb98fa3849b1962bbb863fc64f5c01.png)

If we destroy our current generator now, the last listener will become a generator _(as it is clearly seen because the received messages are different compared to previous screenshots)_.  

![Lastly standing generator](https://i.gyazo.com/6bd48b1e3bbc685b8b396db900b9a921.png)

All the required information transfer is done via `Redis` so no other third-party software\library is being used.

# Spiral matrix

The algorithm is pretty simple. I used something that looks like data caching and prevented the function from being **long executed** by splitting each step into one single execution, looping it over and over until we catch `TypeError` since no specified index would be found.  
I declared a starting move limit which increases by 2 on each iteration. The moves are being increased too, hence when we reach the move limit for a certain direction, the direction changes.  
When the move limit is reached for all of the directions, move counter resets and move limit is increased by 2.

And, of course, the execution result:

![Execution result](https://i.gyazo.com/1da6ccbfb64ea042f3719687c0ad9d0e.png)