## LittleBom
A full-stack e-commerce web application for kids clothing, built with Node.js, Express, and MongoDB.

##  Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Frontend:** EJS, Bootstrap 5, Chart.js
- **Payment:** Razorpay
- **Authentication:** Express Session
##  Setup & Installation

### 1. Clone the repository
git clone https://github.com/yourusername/littlebom.git
cd littlebom
```

### 2. Install dependencies
npm install

### 3. Create `.env` file in root folder
```env
MONGO_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret


### 4. Run the application
# Development
node app.js

# Production (with pm2)
pm2 start app.js --name littlebom

### 5. Open in browser
http://localhost:3000

##  Features
- User registration, login & profile management
- Product browsing with search, filter & sort
- Shopping cart with quantity management
- Coupon & discount system
- Razorpay payment with HMAC signature verification
- Cash on Delivery (COD) support
- Order tracking & management
- Admin dashboard with sales analytics
- Daily & weekly revenue charts


