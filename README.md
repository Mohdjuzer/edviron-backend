This project is a microservice backend for managing school transactions and payments Given by Edviron. Built with Node.js and NestJS, it integrates with a payment gateway and MongoDB Atlas, providing secure JWT-protected REST APIs to handle payment creation, webhook updates, and transaction management.

Table of Contents:
1.Setup and Installation

2.Environment Variables

3.API Usage

4.Postman Collection

5.Project Structure

6.Additional Notes

Setup and Installation:
Prerequisites-
-Node.js (v16 or later recommended)

-npm or yarn package manager

-MongoDB Atlas account with cluster connection URI

-Payment API credentials

Steps:
1.Clone the Repository

bash-
git clone https://github.com/Mohdjuzer/edviron-backend.git
cd edviron-backend

2.Install Dependencies

bash-
npm install
# or
yarn install

3.Configure Environment Variables

Create a .env file in the project root.

Populate it with the reuqired data.

4.Run the Application

bash-
npm run start:dev
# or
yarn start:dev
Application will start on port 3000 (default).

-Environment Variables:
Create a .env file with the following variables:
# MongoDB connection URI for MongoDB Atlas
MONGODB_URI=<your-mongodb-atlas-uri>

# JWT configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=3600s

# Payment Gateway Credentials
PG_KEY=Pg_key
API_KEY=xxxxxxxxx... (full API key here)

# School information
SCHOOL_ID=6xxxxxx

# Callback URL after payment
CALLBACK_URL=http://localhost:3000/payment/callback

# Payment API endpoint URL
PAYMENT_API=https://yourdomain.com

API Usage Examples
Base URL: http://localhost:3000

Authentication
Register a new user

POST /auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "testpassword"
}
Login


POST /auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "testpassword"
}
Response:

json
{
  "access_token": "<jwt_access_token>"
}
Use this token for all protected endpoints in the Authorization header:

text
Authorization: Bearer <jwt_access_token>
Payments
Create Payment

text
POST /create-payment
Authorization: Bearer <jwt_access_token>
Content-Type: application/json

{
  "amount": 100
}
Response:

json
{
  "paymentUrl": "https://dev-payments.edviron.com/edviron-pg/redirect?session_id=..."
}
Webhook
Webhook to update payment status

POST /webhook
Content-Type: application/json

{
  "status": 200,
  "order_info": {
    "order_id": "custom_order_id_or_collect_id",
    "order_amount": 2000,
    "transaction_amount": 2200,
    "gateway": "PhonePe",
    "bank_reference": "YESBNK222",
    "status": "success",
    "payment_mode": "upi",
    "payemnt_details": "success@ybl",
    "Payment_message": "payment success",
    "payment_time": "2025-04-23T08:14:21.945+00:00",
    "error_message": "NA"
  }
}
Transaction APIs
Fetch all transactions:

GET /transactions
Authorization: Bearer <jwt_access_token>

Fetch transactions by school:


GET /transactions/school/:schoolId
Authorization: Bearer <jwt_access_token>

Check transaction status:

GET /transaction-status/:custom_order_id
Authorization: Bearer <jwt_access_token>



Postman Collection
https://mohammed-5857384.postman.co/workspace/Mohammed's-Workspace~6e94cac4-1df0-49d1-8884-4deddd33a40e/request/46646722-769bdf9a-621f-4363-86f2-bf6eeedb0361?action=share&creator=46646722

Make sure to:

Set environment variable jwt_token after login.

Use {{jwt_token}} in the Authorization header for all protected API calls like:

text
Authorization: Bearer {{jwt_token}}
Update base_url variable to your server URL (http://localhost:3000 or deployed URL).