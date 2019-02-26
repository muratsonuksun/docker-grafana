# About

This [Grafana](https://grafana.com/) container image comes with the [Balluff](https://www.balluff.com) company style set included in the image.
It's based on the [default Grafana container image](https://github.com/grafana/grafana/blob/master/Dockerfile).

## References

- [Default Grafana container image](https://github.com/grafana/grafana/blob/master/Dockerfile)
- [Grafana website](https://grafana.com)

## Container usage

You can use this container as described in the [official Grafana docker documentation](https://hub.docker.com/r/grafana/grafana) like

```sh
docker run --name balluff_grafana -d -p 3000:3000 balluff/grafana
```

## Work with Grafana

After starting the container you can connect to the Dashboards via `http://localhost:3000` there `localhost` is available if the container runs on your local machine.
Otherwise you need to replace `localhost` with your server's IP address.

You can login with
Username: `balluff`
Password: `MlHae9NM`

![Grafana login](https://raw.githubusercontent.com/Balluff/docker-grafana/master/screens/grafana_login.png)

After the succesful login you can add data sources and additional content to the Grafana container.

![Grafana Home Dasboard](https://raw.githubusercontent.com/Balluff/docker-grafana/master/screens/grafana_home_dashboard.png)

## Change password

If you want to change the password you can use the `chgpwd.sh` script. By default the given directory structure is used to generate a new password and write it directly to the `defaults.ini`.
After that you can mount bind the file to the container and overwrite the default ones.

```sh
# Change the directory
cd x86_64

# Make the script executable
chmod +x chgpwd.sh

# Run it
sh chgpwd.sh

# Mount bind the defaults.ini inside the container on docker run
docker run --name grafana_test -d -v ${PWD}/conf/defaults.ini:/usr/share/grafana/conf/defaults.ini -p 3000:3000 balluff/grafana
```