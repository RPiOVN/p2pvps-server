# Creating a Zcash Testnet Remote Server

Steps to setting up a zcash-enable OpenBazaar server running on testnet:
	1. Get OB server installed by following [these installation instructions](https://github.com/OpenBazaar/openbazaar-go/blob/master/docs/install-linux.md).
  It's assumed that you are running a Ubuntu Linux server.
  
  2. Initialize your `~/.openBazaar2.0-testnet` directory by running the command `go run openbazaard.go init -t`.
  
	2. Edit the config file to reflect the use of zcash


