# Tailored Adventures & Budget Tracker

Welcome to Tailored Adventures! This project combines three main features: a Chatbot, a Travel Plan Generator, and a Budget Tracker. Below is an overview of each feature and how to use them.

## Features

### 1. Chatbot

The Chatbot feature allows users to interact by asking questions related to travel plans or any other relevant queries. It provides responses based on predefined answers or queries the database for information.

### 2. Travel Plan Generator

The Travel Plan Generator helps users plan their trips by providing options based on the input provided. Users can specify:
- **From**: Starting location of the trip.
- **To**: Destination of the trip.
- **Number of Days**: Duration of the trip.
- **Budget**: Estimated budget for the trip.
- **Number of Persons**: Number of people traveling.

The generator then suggests multiple plans that fit the criteria, detailing activities, accommodations, transportation, and meals.

### 3. Budget Tracker

The Budget Tracker feature enables users to manage their expenses during a trip. Users can:
- **Create New Budget**: Specify budgets for shopping, transportation, food, and accommodation.
- **Track Expenses**: Update the amount spent on each budget category to monitor expenses throughout the trip.

## Usage

1. **Installation**
   - Clone the repository: `git clone <repository-url>`
   - Install dependencies: `npm install`

2. **Setup**
   - Set up environment variables: Create a `.env` file and add the necessary environment variables, such as `MONGO_URI`, `PORT`, etc.

3. **Running the Server**
   - Start the server: `npm start`

4. **Accessing the Application**
   - Open your web browser and go to `http://localhost:5000` (or the specified port).

5. **Interacting with Features**
   - **Chatbot**: Use the chat interface to ask questions and receive responses.
   - **Travel Plan Generator**: Fill out the form with travel details and click "Generate Plans" to see suggested itineraries.
   - **Budget Tracker**:
     - Click "Create New Budget" to set up initial budgets.
     - Use the provided form to track expenses and update spent amounts.

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB (mongoose)
- **Frontend**: HTML, CSS, JavaScript (Vanilla JS)
- **Other Tools**: Axios (for API requests), dotenv (for environment variables), etc.

## Folder Structure

- **`/public`**: Contains static files like `index.html`, CSS files, and client-side JavaScript.
- **`/models`**: Contains Mongoose schema definitions.
- **`/controllers`**: Contains controller functions for handling routes.
- **`/routes`**: Contains Express route definitions.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and create a pull request with your proposed changes.

---

Feel free to adjust the sections and details according to your project's specific structure and requirements. This README should serve as a comprehensive guide for users and potential contributors to understand and utilize the features of your Tailored Adventures & Budget Tracker application.