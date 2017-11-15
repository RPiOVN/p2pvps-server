# Server Specification Overview
This document contains the specifications for the **Server** software. The Server software is defined by the following
high-level features:

* Database API
* Website and Content Management System (CMS)
* SSH Tunnel Server
* HTTP/S Forwarding
* OpenBazaar Transactions
* Testing

The sections below detail the specifications for each of these features:

## Database API
Each device registered into the marketplace gets a two database models, called `devicePublicModel` and `devicePrivateModel`.
Most data about a device is assumed to be public. Specifically, private things like the SSH port, username, password, and
user account of the renter is kept in the private DB model. Security checks are done to ensure only admins,
device owners, or active device renters can access the private model.

* Updating data in the database should only be done through REST API calls. Complex database models and complex manipulation
of those models tends to lead to bugs. Keeping functions small, modular, and testible via REST API calls prevents
hard-to-find bugs.

* REST APIs for this server are based on KeystoneJS API calls used by [ConnextCMS](https://github.com/skagitpublishing/connextCMS) 
and based on 
[this gist by Jed Watson](https://gist.github.com/JedWatson/9741171#file-routes-index-js-L24). 
They include the following
basic CRUD commands. All API calls outside this standard will be listed separately.
  * `/list` - list all items in the collection.
  * `/create` - create a new item in the database.
  * `/:id` - return details of the database item based on its GUID.
  * `/:id/update` - update a specific item in the database.
  * `/:id/delete` - remove a specific item from the database.
  
* The following APIs have been created for the server:
  * `/api/devicePublicData/*` - used to work with public data for a Client device.
  * `/api/devicePublicData/register` - used by Client devices to register themselves with the server.
  * `/api/devicePublicData/listById/:id` - used to list all devices associated with a user account (GUID); both as renter or owner.
  
  
  * `/api/devicePrivateData/*` - used to work with private data for a Client device. This data is only accessible to admins,
  device owners, or device renters. `/list` endpoint not implemented for this API.
  * `/api/devicePrivateData/listById/:id` - used to list all devices associated with a user account (GUID); both as renter or owner.
  
  * `/api/portControl/*` - used by the Client device to coordinate available SSH ports on the server.

## Website and Content Management System (CMS)
Content will be managed with [ConnextCMS](http://connextcms.com), an extension for [KeystoneJS](http://keystonejs.com). 
This covers the scope of blog posts, the home page, about page, and other web pages.
*The Marketplace* will be a single-page app (SPA) using Vue.js, which is outside the scope of this document.

## SSH Tunnel Server
The SSH tunnel server will run inside its own Docker container. It is necessary to give user-level shell access
in order to generate the reverse tunnel to the client devices. Keeping the SSH server isolated to it's own
Docker container reduces the threat of giving out shell access.

**It may be possible to allow reverse SSH connections without granding shell access to the server. Exploring this 
option needs to be a high priority.**

## HTTP/S Forwarding
The server is also responsible for establishing a subdomain (like **abc**.p2pvps.com) and proxying connections
from port 80 (HTTP) or port 442 (HTTPS) to the rented device. The easiest way to do this is by leveraging
a [LocalTunnel Server](https://github.com/localtunnel/server). 

While the project is still in its infancy, we can use the [localtunnel.me](http://localtunnel.me) server, but
we'll eventually need to set up our own server. The LocalTunnel server software expects to have the server to
itself, without any competition for ports. Putting it inside a Docker container has proven problematic.

## OpenBazaar Transactions
[OpenBazaar](http://openbazaar.org) (**OB**) will be leverages to handle the transactions between Owners and Renters.
When an Owner submits their device to the P2P VPS Marketplace, the Server will be responsible for generating
a contract on the OpenBazaar network. Renters then purchase the contract using their own OpenBazaar software. At that point, the login and password
for the device is emailed to them. 

The server will run an OpenBazaar server, (hopefully) contained in it's own Docker container. 

OB contracts are managed using the `obContract` database model. This model has the following properties:

* `id`: The unique MongoDB UUID for each record.
* `ListingUri`: The OB URI need to retrieve the specific listing in the OB client
* `Price`: The price is USD
* `Experation`: When the contract will expire if not purchased.
* `Title`: Title used in the listing
* `Description`: Description used in the listing
* `imageHash`: An IPFS hash link to an image on the OB network.
* `Owner`: The GUID of the device owner. This is a MongoDB relationship.
* `Renter`: The GUID of the device renter.
* `listingState`: The state of the listing. This is a string with these following possible states:
  * `Not Listed`: (default) not listed on the OB marketplace
  * `Listed`: listed on the OB marketplace
  * `Sold`: off the market, login into sent to the renter
  * `Released`: off the market, device needs reset and relisting.
  * `Expired`: the listing has expired on the OB market and needs to be relisted.

In addition to the API endpoints listed in [Database API](#database-api), for managing the
`obContract` model, the following API endpoints are used for managing OpenBazaar contracts.
These API endpoints can only be executed by server admins or device owners:

* `createMarketListing/:id` - Creates a new OB market listing for the device.
* `removeMarketListing/:id` - Remove the listing from the OB marketplace.
* `updateListing/:id` - Updates the OB listing with data from the `obContract` model associated with the listing.

## Testing
Testing of server code will use the same test-suite as the Marketplace. Namely the test configuration set up
by the original [vue-template/webpack repository](https://github.com/vuejs-templates/webpack).
Namely, Mocha will be used for unit tests and Karma will be used for end-to-end testing. We badly need
a contributor to help us setup and maintain a suite of testing scripts and set up Continuous Integration testing.

