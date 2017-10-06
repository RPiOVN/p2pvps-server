# Server Specification Overview
This document contains the specifications for the **Server** software. The Server software is defined by the following
high-level features:

* Database API
* Website and Content Management System (CMS)
* SSH Tunnel Server
* HTTP/S Forwarding
* Bitcoin Transactions
* Testing

The sections below detail the specifications for each of these features:

## Database API
Each device registered into the marketplace gets a two database models, called `devicePublicModel` and `devicePrivateModel`.
Most data about a device is assumed to be public. Specifically private things like the SSH port, username, password, and
user account of the renter is kept in the private DB model. Security checks are done to ensure only admins,
device owners, or active device renters can access the private model.

The preferred method of updating data in the database is to use the REST API. 

## Website and Content Management System (CMS)
Content will be managed with [ConnextCMS](http://connextcms.com), an extension for [KeystoneJS](http://keystonejs.com). 
This covers the scope of blog posts, the home page, about page, and other web pages.
*The Marketplace* will be a single-page app (SPA) using Vue.js, which is outside the scope of this document.

## SSH Tunnel Server
The SSH tunnel server will run inside its own Docker container. It is necessary to give user-level shell access
in order to generate the reverse tunnel to the client devices. Keeping the SSH server isolated to it's own
Docker container reduces the threat of giving out shell access.

It may be possible to allow reverse SSH connections without granding shell access to the server. Exploring this 
option needs to be a high priority.

## HTTP/S Forwarding
The server is also responsible for establishing a subdomain (like **abc**.p2pvps.com) and proxying connections
from port 80 (HTTP) or port 442 (HTTPS) to the rented device. The easiest way to do this is by leveraging
a [LocalTunnel Server](https://github.com/localtunnel/server). 

While the project is still in its infancy, we can use the [localtunnel.me](http://localtunnel.me) server, but
we'll eventually need to set up our own server. The LocalTunnel server software expects to have the server to
itself, without any competition for ports. Putting it inside a Docker container has proven problematic.

## Bitcoin Transactions
This area has yet to be explored. But a library or node application or REST API service needs to be established
to facilitate the use of crypto currency. Bitcoin is fine unless the confirmation of transactions posses a problem
to establishing rentals in a timely fashion. If it does, then a different cryptocurrency will be used. It would be
ideal to support multiple cryptocurrencies. It may even be a good idea to spin up a dedicated cloud server just to
deal with the cryptocurrency applications, and hopefully Dockerize each cryptocurrency and keep them separate from
one another.

## Testing
Testing of server code will use the same test-suite as the Marketplace. Namely the test configuration set up
by the original [vue-template/webpack repository](https://github.com/vuejs-templates/webpack).
Namely, Mocha will be used for unit tests and Karma will be used for end-to-end testing. We badly need
a contributor to help us setup and maintain a suite of testing scripts and set up Continuous Integration testing.

