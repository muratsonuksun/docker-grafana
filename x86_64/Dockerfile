# Using grafanas base image
FROM grafana/grafana:5.4.3

LABEL Maintainer "Andreas Elser"
LABEL Version "1.0"
LABEL Vendor "Balluff"
LABEL Name "Grafana container"
LABEL Architecture "x86_64"

# Adding the Balluff defaults to the image
ADD usr/share/grafana/public /usr/share/grafana/public
ADD usr/share/grafana/conf/defaults.ini /usr/share/grafana/conf/defaults.ini

# Using the ENTRYPOINT of the base image so no
# extra ENTRYPOINT or CMD is set