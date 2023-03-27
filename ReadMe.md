# Password less Authentication Service APIs

Written in nodeJs, MongoDB and use SendGrid API as email service.

## Installation

Clone the repository:

```bash
git clone https://github.com/ujjwall-R/Passwordless-authentication-APIs
cd Passwordless-authentication-APIs
```

Install the dependencies:

```bash
npm i
```

## Usage

Get your sendgrid API from [https://sendgrid.com](https://sendgrid.com/).
Setup the [MONGODB ATLAS](https://www.mongodb.com/cloud/atlas/register).

Create a .env file with following template:

### .env

```bash
SENDGRID_API_KEY=""
MONGODB_URL=""
```

Deploy the node app on any cloud service.

## APIs

Register

```http
POST /users/signup
```

```json
#Request body
{
    "name": "John Doe",
    "email": "johnxxxxxxxxx@gmail.com",
    "gender":"male"
}

#Response
{
    "name": "John Doe",
    "email": "johnxxxxxxxxx@gmail.com"
}
```

Login

```http
POST /users/login
```

```json
#Request body
{
    "email":"johnxxxxxxxxx@gmail.com"
}

#Response
{
    "user": {
        "_id": "641ff966253xxxxxxxx",
        "name": "John Doe",
        "email": "johnxxxxxxxxx@gmail.com",
        "gender": "male",
        "__v": 1
    }
}
```

Verify OTP

```http
POST /users/verify
```

```json
#Request body
{
    "email":"johnxxxxxxxxx@gmail.com",
    "otp":"xxxx"
}
#Response
{
    "user": {
        "_id": "641ff966253xxxxxxxx",
        "name": "John Doe",
        "email": "johnxxxxxxxxx@gmail.com",
        "gender": "male",
        "__v": 1
    },
    "token": "eyJhbGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
