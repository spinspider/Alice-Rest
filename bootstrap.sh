sudo apt-get install apache2-utils
current_date=`date +"%Y-%m-%d %T"`

createdAt=$current_date
updatedAt=$current_date
phone_no="9898989898"

first_name="Infyn"
last_name="Infyn"

user_id=$(uuidgen -r)
roles="SYS_ADMIN"	

echo Enter your mail_id: 
read mail_id 
echo Enter your password: 
read -s password
echo Enter your phone_number: 
read phone_number

pwd=$(htpasswd -bnBC 8 "" $password | tr -d ':\n')

echo SYS_ORG user is creating....

mysql -u infyn -p << EOF
USE status1;
INSERT INTO users (user_id,first_name,last_name,password,mail_id,phone_number,createdAt,updatedAt) VALUES ('$user_id', '$first_name', '$last_name', '$pwd','$mail_id','$phone_number','$createdAt','$updatedAt');
EOF
