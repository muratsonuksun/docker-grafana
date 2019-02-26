#!/bin/sh

config=conf/defaults.ini

# Validate if an other config path is set.
# If so use it
# https://www.cyberciti.biz/faq/unix-linux-bash-script-check-if-variable-is-empty/
if [ -z "$1" ]
then
    echo "No input path is given the default is used: $config"
else
    config=$1
fi

echo "Generate a new dashboard password... ";

# Auto generate a new password
# https://www.howtogeek.com/howto/30184/10-ways-to-generate-a-random-password-from-the-command-line/
(< /dev/urandom tr -dc A-Z-a-z-0-9 | head -c${1:-8};echo) >> pwd;
pattern="admin_password = admin";
replace="admin_password = $(cat pwd)";
sed -i "s/$pattern/$replace/" $config
echo "The new password is set: $(cat pwd)"
rm pwd