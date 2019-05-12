# Home Automation Server

This is the source code of our hardware mod for the Rollotron 1800 by Rademacher. It uses the GPIO pins of a Raspberry Pi Zero W and some sketchy soldering to access the hardware buttons. This makes it possible to control the shutter via a *beautiful* webinterface, enabling the user to stay in bed indefinitely.

### Prerequisites

None, everything that is required is installed by the ```initial_setup.sh``` script

### Installation

1. Install a [Raspbian Image](https://www.raspberrypi.org/downloads/) on the Pi Zero W.

2. Clone the project onto the Raspberry Pi.
    ```
    git clone https://github.com/VeraKowalczuk/home-automation-server
    ```

3. To install, switch to the newly created directory and run the setup script.

    ```
    cd home-automation-server
    sudo ./initial_setup.sh
    ```

4. Update your network specific details in ```config.yml```

5. Update your device specific details (mainly which pins the up/down buttons are soldered to) in ```local-config.yml```

6. After updating the configs, you want to restart the master and slave servers to make them load the new configs. This can be done by simply rebooting the Pi or running 
    ```
    sudo systemctl restart home-automation-server-master
    sudo systemctl restart home-automation-server-slave
    ```

### Updating

To update the project just use ```sudo ./update.sh``` from within the directory that was created by git during the initial clone

# Running the Server

The ```initial_setup.sh``` and ```update.sh``` script run the servers automatically after finishing.
To manually start / stop / restart the servers, use the **systemd** commands.

```
sudo systemctl {start|stop|restart} home-automation-server-master
sudo systemctl {start|stop|restart} home-automation-server-slave
```

The master and slave server are automatically set up to run when the Pi boots. This can be disabled by running
```
sudo systemctl disable home-automation-server-master
sudo systemctl disable home-automation-server-slave
```
**The update script re-enables automatic startup on boot. If you don't want this, create your own update script or disable it every time you update the project.**

# Accessing the UI

Simply connect to the Pi's IP using a browser of your choice (preferrably > IE 5).
If it fails to load the configuration, the master server did not respond correctly / at all. You could try rebooting the master server or the whole Pi.

# Issues

If you run into any issues while using this software, have a cool new feature suggestion or your Pi exploded after installing our project, please open an issue or create a pull request.

# Authors

* **Vera Kowalczuk** - *Frontend* - [VeraKowalczuk](https://github.com/VeraKowalczuk)

* **Johannes Kunz** - *Actually soldering the thing together* - [jfkunz](https://github.com/jfkunz)

* **Till Müller** - *Environment Setup, Frontend* - [TillMueller](https://github.com/TillMueller)

* **Adrian Steffan** - *Backend API* - [adriansteffan](https://github.com/adriansteffan)

