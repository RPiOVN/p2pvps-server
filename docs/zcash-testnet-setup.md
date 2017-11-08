# Creating a Zcash Testnet Remote Server

Steps to setting up a zcash-enable OpenBazaar server running on testnet:
	1. Get OB server installed by following [these installation instructions](https://github.com/OpenBazaar/openbazaar-go/blob/master/docs/install-linux.md).
  It's assumed that you are running a Ubuntu Linux server. 
  
  2. After verifying that you OpenBazaar server is up and running, shut it down.
  Delete the `.openBazaar2.0` directory in your home folder (`~`).
  We're going to be setting up zcash and it's good hygene that bitcoin and zcash intermingle as little as possible.
  
  3. Go back to your `$GOPATH` directory where the source code for OpenBazaar server lives.
  For this example it's `~/openBazaarServer/src/github.com/OpenBazaar/openbazaar-go`. 
  
  4. Ensure you have the latest code by issuing `git pull`. Switch to the `zcash` branch with the
  command `git checkout zcash`. For good measure, do another `git pull` to ensure everything is
  up to date. Finally, merge this branch with any of the latest updates to hit `master`, with the
  command `git merge master`. Now you've got the best of both worlds: the zcash branch with the latest
  updates from the master branch.
  
  You may get some prompts after running `git merge master`. The system may need you to register
  your email and name with Git. It may also push you into the `nano` text editor. Just hit `Ctrl-X`
  and then `y` to exit and continue.
  
  5. Initialize your `~/.openBazaar2.0-testnet` directory by running the command `go run openbazaard.go init -t`.
  
	* Edit the config file to reflect the use of zcash


