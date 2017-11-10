# zcash installation instructions

Based on [this guide](https://dennis.gesker.com/2016/11/04/zcash-on-ubuntu-debian/).

```
sudo apt-get install -y apt-transport-https
wget -qO tmp https://apt.z.cash/zcash.asc
sudo apt-key add tmp
rm tmp
echo "deb [arch=amd64] https://apt.z.cash/ jessie main" | sudo tee /etc/apt/sources.list.d/zcash.list
sudo apt-get update && sudo apt-get install zcash

zcash-fetch-params
mkdir -p ~/.zcash

# zcash Testnet
echo "addnode=testnet.z.cash" >~/.zcash/zcash.conf
echo "rpcuser=yourUsername" >>~/.zcash/zcash.conf
echo "rpcpassword=yourPassword" >>~/.zcash/zcash.conf
echo "equihashsolver=tromp" >> ~/.zcash/zcash.conf
echo "testnet=1"

# Zcash Mainnet
#echo "addnode=mainnet.z.cash" >~/.zcash/zcash.conf
#echo "rpcuser=yourUsername" >>~/.zcash/zcash.conf
#echo "rpcpassword=yourPassword" >>~/.zcash/zcash.conf
#echo "equihashsolver=tromp" >> ~/.zcash/zcash.conf

# Zcash Testnet with mining set to all cores.
#echo "addnode=testnet.z.cash" >~/.zcash/zcash.conf
#echo "rpcuser=yourUsername" >>~/.zcash/zcash.conf
#echo "rpcpassword=yourPassword" >>~/.zcash/zcash.conf
#echo "equihashsolver=tromp" >> ~/.zcash/zcash.conf
#echo "testnet=1"
#echo "gen=1"
#echo "genproclimit=-1"

# Add optional lines here to turn on mining
```