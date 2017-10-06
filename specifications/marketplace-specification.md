# Marketplace Specification Overview
This document contains the specifications for the **Marketplace** software. The Marketplace software is defined by the following
high-level features:

* Owned Device Management
* Rented Device Management
* Marketplace
* Payment
* Testing

The sections below detail the specifications for each of these features:

## Owned Device Management
![Owned Devices](images/owned-devices-mockup.JPG?raw=true "Owned Devices Mock Up")

A mockup of the owned devices view is displayed above. 

## Rented Device Management
![Rented Devices](images/rental-mockup.JPG?raw=true "Rented Devices Mock Up")

A mockup of the rented devices view is displayed above. 

## Marketplace
![Marketplace Mockup](images/marketplace-mockup.JPG?raw=true "Marketplace Mock Up")

A mockup of the Marketplace view is displayed above. 

## Payment
The payment user interface will work in conjunction with the cryptocurrency specifications captured in
the [Server specifications](server-specification.md). Once more progress has been made on that specification,
then a user interface mock up can be created.

## Testing
Testing of server code will use the same test-suite provided by the 
[vue-template/webpack repository](https://github.com/vuejs-templates/webpack), which this project was generated
from. Namely, Mocha will be used for unit tests and Karma will be used for end-to-end testing. We badly need
a contributor to help us setup and maintain a suite of testing scripts and set up Continuous Integration testing.
