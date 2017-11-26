# Overview
This document contains a high-level technical overview of the P2P VPS suit of software. The suit consists of a
set of server and client software. 

The client software is targeted for Raspberry Pi's minicomputers, but can be operated on
any device that is capable of running Docker. The focus of the client software is to:
* Create a basic Linux environment with a command line interface (CLI).
* Establish a reverse SSH connection with the server, to provide the CLI to the renter.
* Establish a LocalTunnel connection to the server so the device can server webpages, accessible from the general internet.

The server software is targeted for cloud VPS servers like Digital Ocean, Vultr, AWS, etc running Ubuntu Linux. The focus of
the server software is to:
* Register incoming connections from client devices.
* Create listing on the OpenBazaar network to allow Client devices to be rented.
* Manage OpenBazaar listings and ensure rented devices fulfill the terms of their rental contracts.
* Establish connection with other servers.


A simple diagram of a P2P VPS Marketplace:

![Simple server client diagram](images/simple-diagram.jpg?raw=true "Simple server client diagram")

## Definitions
* *Client* or *Device* is an IoT device or other computer capable of running Docker and executing the [client software](https://github.com/RPiOVN/p2pvps-client)
* *Server* is an internet connected computer capable of running the software in this repository.
* *Device Owners* are the owners of the Client devices.
* *Renters* are users who rent the Client device from the Device Owners.

## Client Overview
The purpose of the client side software is to create a virtual private server (**VPS**) environment similar to those hosted
by cloud companies like Digital Ocean or AWS. This is achieved on an IoT device by running a Linux command line inside
a Docker container. Small, indexpensive, distributed hardware like Raspberry Pi minicomputers now posses the
computational power to host such an environment.

This setup has the following advantages:

* By running the environment in a virtual system like Docker, the device can be easily reset to a known state
when the *renter* is done using it.

* By using reverse SSH to connect to a central server, the *renters* can be provided with a command line interface to the device while
by-passing network firewalls. However, this creates network risks that device *owners* need to be aware of.

* Renting out the computing power of the hardware allows hardware *owners* to profit from their hardware and internet connection, while promoting a decentralized internet.

* Creating distributed, semi-anonymouse VPS micro-servers, hosted in peoples homes, has interesting legal ramifications and moves the internet towards
a more reliable, distributed, and censorless architecture.

The client software is composed of the following high-level features. Each feature needs a manager, so if you are
interested in contributing, [please let us know](http://p2pvps.org):

* Governor
* Docker container with SSH
* Persistant Storage
  * Encryption
* Deployment Packages (pre-configured scripts for setting up apps like webservers, file sharing, etc.)
* Testing

See more details in the [Client Specification](client-specification.md).

## Server Overview
The primary purpose of the server software is to orchastrate the network of devices and facilitate financial 
transations via OpenBazaar. 
Its secondary purpose is to connect with other servers, in order to establish a peer-to-peer (P2P) marketplace, 
with no central point of failure. These goals are achieved by splitting the server into two software stacks:
*The Marketplace* and the *The Server*.

*The Marketplace* is a Vue.js web application that allows renters and owners to manage devices and transactions.
It is composed of the following high-level User Interfaces/Features:

* Owned Device Management
* Testing

See more details in the [Marketplace Specification](marketplace-specification.md).

*The Server* is the collection of files necessary to create the website (content), the database models, and the REST APIs
needed for the Client software and the Marketplace software to communicate and coordinate. It is composed of the following
high level features:

* Database API
* Website and Content Management System (CMS)
* SSH Tunnel Server
* LocalTunnel HTTP/S Forwarding
* OpenBazaar Transactions
* Listing Manager
* Testing

See more details in the [Server Specification](server-specification.md).

# High Level System Overview
The sections below give additional details on how the system-as-a-whole works. Lower level specifications will
be captured in the respective specification document for [Client](client-specification.md), 
[Server](server-specification.md), and [Marketplace](marketplace-specification.md).

## Network Orchestration
A client device registers with a server by making a REST API call and passing a server-generated key (GUID). 
Upon recieving a valid registration call, the server opens new ports, generates login details, and returns this 
information to the client. 
The client then launches a Docker container with a minimal Linux environment. The container makes a
reverse SSH connection to forward its local SSH port to the server's new port, tunneling through any firewalls, and creating 
a command line interface accessible to the renter.

The Server operates a minimal SSH server running inside a Docker container and another [LocalTunnel server](https://github.com/localtunnel/server) 
running inside it's own Docker container.
This SSH shell allows connection to the client device via SSH.
The LocalTunnel server also forwards port 80 (http) and port 443 (https) from the client device. A subdomain is created
on the server allowing access to these three ports. This allows renters to connect to the command line on the 
client device and also
serve web pages and web apps from a human-readable URL.

## Financial Transactions
Transactions between Owners and Renters will take place over the [OpenBazaar](http://openbazaar.org/) 
(**OB**) network.
This requires that the buyer and seller each have a local installation of OpenBazaar capable of
sending a receiving cryptocurrency. Cryptocurrencies have the
advantage of allowing server owners to create semi-anonymous markets. It also allows P2P VPS servers to
connect Owners and Renters without having any liability with regard to finanical transactions.

Owners will fill out a form to register their device, be given a key, and
then install the software on the client hardware along with the key. Rental of devices will be billed by the hour.
When a device is registered, its hardware (memory, CPU, hard-drive space) will be verified. 
Owners can then place the device for rent on the P2P VPS marketplace, or simply reserve it for personal use.
The device owner can set the hourly rate they are willing to rent the device for on the marketplace.

A renter agrees to the rental contract by purchase the contract on the OpenBazaar network for 
a fixed length of time.
The device is then taken off the P2P VPS OpenBazaar store. 
A random username and password generated for the device will be emailed to the renter at that time.
As long as the device is connect to the internet, the device will be dedicated for the renters use.
Once the length of the contract expires, the client device is reset and placed back on the marketplace.
In the future, a feature will be developed to allow renters to extend the length of their contract.
If the client device goes offline and can not fulfill the terms of the contract, an OpenBazaar dispute
is activated and a moderator can pro-rate and refund part of the transaction to the renter.

This workflow diagram illustrates how transactions initiated and managed:
![Transaction Worflow](images/workflow.jpg?raw=true "Transaction Worflow")


## Federated Servers
Server software will be able to establish connections with other servers at the desire of the server administrator. 
This API will allow P2P VPS servers to link to one another. The link will appear on their website as a designated
place. A link to the servers OpenBazaar store will also appear on their OpenBazaar store page.
By creating a federation of marketplaces, the overall network has no single point of failure. 

![Federated network of servers](images/federated-diagram.jpg?raw=true "Federated network of servers")



## Client Server Handshaking
Below are a series of steps specifiying how the Server and Client (Raspberry Pi or other IoT device) will initiate a
connection to the Server in order to allow global internet connections to the Client behind any arbitrary firewalls and network devices.

1. The device Owner logs into their account on the Server to register the Client device. They recieve a hash the Client
uses to identify itself to the Server.

2. The Owner copies the hash into a .json file on the Client and starts the Client software.

3. The Client software makes a REST API call to the Server. It passes in the hash and the Server responds with
a computer-generated username, password, and a port number. The port number is used to establish an reverse SSH
tunnel to the Client device. A subdomain is also set up on the server using [LocalTunnel](https://github.com/localtunnel/server) 
to forward ports 80 (http) and 443 (https) from the Client device to the new subdomain on the Server.

4. When a Renter rents the device, they are emailed the username and password for the device.

5. When the rental contract end, the ports and subdomains are released by the server. 
The Client software destroys the Docker container the Renter was using and wipes any peristant storage.
The Client re-registers itself back into the marketplace by repeating the process from Step 3.

*Note:* It is not possible to make a reverse SSH call without giving the Client shell access to the Server. By restricting
the connection to a minimal Ubuntu Docker image, the server can be better protected against malicious users.
One area of improvement is to research a way of establishing an SSH server capable of doing
reverse tunneling without giving command line access.