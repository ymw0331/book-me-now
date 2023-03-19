# Service Booking Marketplace MERN Webapp

This is a MERN stack web application that allows users to post and book services/products on the platform. As a platform owner, you will collect money from customers and pay to sellers. In-between you will take a certain percentage/commission/fee for being a platform owner.

## Getting Started

### Prerequisites

You need to have Node.js and npm installed on your computer to run this project.

### Installing

1. Clone the repository
2. Install the dependencies by running `npm install` in the root directory of the project
3. In the client directory, run `npm install` to install the frontend dependencies
4. Create a `.env` file in the root directory of the project and add your MongoDB connection string and JWT secret key as follows:
      <ul>
    <li>
   PORT = 3000

    </li>
    <li>
   MONGO_URI = mongo-db-connection-string
    
    </li>
    <li>
   JWT_SECRET = jwt-secret-key
    
    </li>

      <li>
   STRIPE_SECRET_KEY = stripe-secret-key>
      </li>
      <li>
   STRIPE_REDIRECT_URL=http://localhost:3000/stripe/callback

      </li>

      <li> STRIPE_SETTINGS_REDIRECT_URL=http://localhost:3000/dashboard/seller
      </li>

      <li>
      REACT_APP_GOOGLEPLACES_API_KEY= your_google_places_api_key
      </li>
      <li>
      STRIPE_SUCCESS_URL=http://localhost:3000/stripe/success
      </li>
      <li>
      STRIPE_CANCEL_URL=http://localhost:3000/stripe/cancel
      </li>
               
      
      
      </ul>

### Running

1. In the root directory of the project, run `npm start` to start the server
2. In the client directory, run `npm start` to start the frontend development server
3. Navigate to `http://localhost:3000` in your browser to access the web application

## Features

- User authentication and authorization with JWT
- CRUD operations for services and bookings
- Service providers can view their own services and bookings
- Users can search for services based on location
- Google Maps API integration for displaying service locations
- Stripe API integration for payment processing
- Responsive design using Bootstrap 4 & Ant Design

## Built With

- MongoDB - NoSQL database used for storing data
- Express.js - Backend web application framework for Node.js
- React.js - Frontend JavaScript library
- Redux - State management
- Node.js - JavaScript runtime environment
- Stripe API - Payment gateway
- Ant Design - UI library used for styling

## Acknowledgements

This project was built with the help of the following resources:

- [React Redux NodeJs Marketplace - Build A Hotel Booking App](https://www.udemy.com/course/react-node-mern-marketplace/) by Ryan Dhungel
- [Ant Design](https://ant.design/)
