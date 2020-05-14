# pipact-deploy
Automated deployment for PiPACT project. 

## Hardware Support
* Raspberry Pi 3
* Raspberry Pi 3B+

## Manual Steps
1. Write [Raspian Buster Lite](https://www.raspberrypi.org/downloads/raspbian/) imaged to SD card
1. Boot Pi and connect to internet via Wi-Fi or Ethernet
1. Enable ssh
    1. `$ sudo raspi-config`
    1. Select **5 - Interfacing Options**
    1. Select **P2 - SSH**
    1. Select **Yes**
    1. Select **Finish**
1. Set timezone using raspi-config
    1. `$ sudo raspi-config`
    1. Select **4 - Localisation Options**
    1. Select **I2 - Change Timezone**
    1. Select appropriate timezone
    1. Select **Finish**
1. Install ansible and git
    : `$ sudo apt install -y ansible git`
1. Clone web project
    1. Anticipate this can go away once we real github/npm
1. `$ cd pipact/deploy`
1. `$ ansible-galaxy install -r requirements.yml`
1. `$ ansible-playbook pipact.yml`



## Notes and References
* [Running Your Node.js App with Systemd - Part 1](https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/)
* During development it was useful to set 2 environment varibles:
    * `$ export ANSIBLE_CACHE_PLUGIN=jsonfile`
    * `$ export ANSIBLE_CACHE_PLUGIN_CONNECTION=/home/pi/cache.json`
* [How To Install and Configure NATS on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-nats-on-ubuntu-16-04)