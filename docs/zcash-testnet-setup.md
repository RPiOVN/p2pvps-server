# Creating a Zcash Testnet Remote Server

Steps to setting up a zcash-enable OpenBazaar server running on testnet:

* To start with, you should probably [create 2GB of swap space](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04).

1. Get OB server installed by following [these installation instructions](https://github.com/OpenBazaar/openbazaar-go/blob/master/docs/install-linux.md).
It's assumed that you are running a Ubuntu Linux server. 

2. After verifying that your OpenBazaar server is up and running, shut it down.
Delete the `.openBazaar2.0` directory in your home folder (`~`).
We're going to be setting up zcash and it's good hygiene that bitcoin and zcash intermingle as little as possible.

3. Go back to your directory where the source code for OpenBazaar server lives.
For this example it's `~/openBazaarServer/src/github.com/OpenBazaar/openbazaar-go`.
From here on out, I'll call this the **source code directory**.

4. Ensure you have the latest code by issuing `git pull`. Switch to the `zcash` branch with the
command `git checkout zcash`. For good measure, do another `git pull` to ensure everything is
up to date. Finally, merge this branch with any of the latest updates to hit `master`, with the
command `git merge master`. Now you've got the best of both worlds: the zcash branch with the latest
updates from the master branch.

You may get some prompts after running `git merge master`. The system may need you to register
your email and name with Git. It may also push you into the `nano` text editor. Just hit `Ctrl-X`
and then `y` to exit and continue.

5. Initialize your `~/.openBazaar2.0-testnet` directory by running the command `go run openbazaard.go init -t`.

6. Set up an SSL certificate for your server following the directions in 
[this document](https://github.com/OpenBazaar/openbazaar-go/blob/master/docs/ssl.md).
Since we are doing testnet, use the `.openBazaar2.0-testnet` directory. The `config` file
that you need to edit lives in this directory.

7. Install the `OpenBazaar.crt` certification on the computer you'll be using to run the
client. On Windows 10, I used FileZilla to download the file to my computer. Double clicking on the
.crt file and clicking on *Install Certificate...* will bring up the Certificate Import Wizard.

8. Click Next to continue through the first prompt. Either option will work. In *Certificate Store*, 
choose *Place all certificates in the following store* and browse to *Trusted Root Certification
Authorities*. Clock *OK*, then *Next*, then *Finish*. Click through any additional prompts. 

You have now imported your self-signed cert, so your computer can have an encrypted conversation with
your server.

9. Install zcash onto your server. I've found [this guide](https://dennis.gesker.com/2016/11/04/zcash-on-ubuntu-debian/)
to be pretty clear. Beware the `“` character in their examples. It's not the same as double quote (`"`).
Of course, be sure to read through [the official user guide](https://github.com/zcash/zcash/wiki/1.0-User-Guide).
Adjust the directions above with the commands recorded in [this document](zcash-testnet-setup.md).

10. Start zcash daemon by running the command `zcashd -testnet daemon`.

11. Wait a few seconds to a few minutes. Test to make sure the zcash server is running correctly by running
the command `zcash-cli getinfo`.

12. Create a new wallet with the command `zcash-cli z_getnewaddress`. This will generate a zcash *private*
address (starts with a z). You won't use this to transfer money. Instead you'll use the *transparent*
address, which can be viewed with `zcash-cli listreceivedbyaddress 0 true`. That is the address you would
share for receiving coins. OpenBazaar will also generate its own transparent address.

13. Enable remote access to the server by following the steps [the security doc](https://github.com/OpenBazaar/openbazaar-go/blob/d65a3f5ba438dbb80e39df43a2cce31d0399d637/docs/security.md).
Again, the `config` file you need to edit is in the `~/openBazaar2.0-testnet/` directory.
Skip the first part about encrypting the database.

  * In the `JSON-API` section, change the `Authenticated` property to `true`.
  * In the `Address` section, update the `Gateway` property.
  
14. Edit the `Wallet` section of the `config` file to reflect the use of zcash like this:
```
  "Wallet": {
    "Binary": "/usr/bin/zcashd",
    "FeeAPI": "https://btc.fees.openbazaar.org",
    "HighFeeDefault": 160,
    "LowFeeDefault": 20,
    "MaxFee": 2000,
    "MediumFeeDefault": 60,
    "RPCPassword": "yourPassword",
    "RPCUser": "yourUsername",
    "TrustedPeer": "",
    "Type": "zcashd"
  }
```
  
15. Next, generate a username and password by navigating to the source code directory. Generate
a username and password with `go run openbazaard.go setapicreds -t`. This will automatically save the
username and password hash in the `JSON-API` section of the config file.

16. Run Open Bazaar and connect it to the zcash testnet with the command `go run openbazaard.go start -t &`

If OpenBazaar server exits as soon as it starts, check the logs in `~/openBazaar2.0-testnet/logs/ob.log`
for clues as to the cause of the problem.







