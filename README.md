# Kentro-WooCom-API

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D%2016.13-green)
![TypeScript](https://img.shields.io/badge/TypeScript-%3E%3D%205.1-blue)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A small backend service developed in Node.js and TypeScript for integrating WooCommerce with Kentro via REST APIs.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [Scalability Considerations](#scalability-considerations)

## Introduction

Kentro-WooCom-API is a backend service that enables integration between WooCommerce and Kentro, facilitating the import of products from a WooCommerce demo store into a Kentro demo account using their respective REST APIs. 

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/devdesignersid/kentro-woocom-api.git
   cd kentro-woocom-api
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Build the code:
    ```bash
    npm run build:prod
    ```

4. Start the service:
    ```bash
    npm run start:prod
    ```

## Configuration

### Environment Variables

To securely manage credentials and configuration, set the following environment variables in your `.env` file:

- `ENV`: Environment mode (e.g., "development", "production").
- `LOG_LEVEL`: Logging level (e.g., "info", "debug").

#### Application Configuration

- `APP__NAME`: The name of your application.
- `APP__VERSION`: The version of your application.
- `APP__HOST`: The host on which your application will run (e.g., "localhost").
- `APP__PORT`: The port on which your application will listen.
- `APP__DESCRIPTION`: A brief description of your application.

#### Kentro API Configuration

- `KENTRO__API_URL`: Kentro API base URL (e.g., "https://api.kentro.com").
- `KENTRO__API_KEY`: Your Kentro API key.
- `KENTRO__API_SECRET`: Your Kentro API secret.
- `KENTRO__API_VERSION`: Kentro API version (e.g., "v1").

#### WooCommerce Configuration

- `WOOCOMMERCE__API_URL`: WooCommerce API base URL (e.g., "https://api.woocommerce.com").
- `WOOCOMMERCE__CONSUMER_KEY`: Your WooCommerce consumer key.
- `WOOCOMMERCE__CONSUMER_SECRET`: Your WooCommerce consumer secret.
- `WOOCOMMERCE__API_VERSION`: WooCommerce API version (e.g., "v3").

Make sure to populate these environment variables with the actual values required for your project. The service will use these values to configure its behavior, including connecting to the Kentro and WooCommerce APIs securely.

## Usage

For detailed information about how to use the API endpoints provided by this service, please refer to the Swagger documentation hosted at:

[Swagger Documentation](http://localhost:3000/docs)

The Swagger documentation provides interactive documentation for the API, including details on request parameters, response formats, and example requests.

Please ensure that you have the service running locally, and access the Swagger documentation using the provided link for a comprehensive guide on how to use the endpoints.

## Scalability Considerations

To ensure the scalability of the Kentro-WooCom-API service, consider the following:

- Implement load balancing to distribute incoming requests.
- Use caching mechanisms to reduce API load.
- Choose a scalable database solution if needed.
- Implement concurrency control and rate limiting.
- Monitor the service's health and set up auto-scaling policies.