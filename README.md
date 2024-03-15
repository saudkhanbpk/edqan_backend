# Edqan App

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [MVC Structure](#mvc-structure)
6. [Database](#database)
7. [Dependencies](#dependencies)
8. [Usage](#usage)

## 1. Introduction

Welcome to the documentation for Edqan App. This software is a Node.js-based backend application that follows the Model-View-Controller (MVC) architectural pattern. It is designed to provide a robust and flexible backend solution for your applications. The software uses MongoDB as its database and exposes a set of APIs to interact with various functionalities.

## 2. System Architecture

Edqan App follows a client-server architecture with the following components:

- **Client**: The client-side applications or services that interact with the APIs provided by this backend.
- **Server**: The Node.js server that hosts and runs the backend software.
- **Database**: MongoDB is used as the backend database to store and retrieve data.

## 3. Installation

To install and run Edqan App, follow these steps:

1. Run `npm install` to install dependencies.
2. For development environment, run `npm run dev`.
3. For production environment, run `npm start`.

## 4. Configuration

You can configure Edqan App by editing the `.env` file to set environment-specific configurations and API keys.

## 5. MVC Structure

- **Data Access Layer**: Contains Models and Repositories (`api/data-access-layer`).
- **Entities**: Contains data validation for each model (`api/entities`).
- **Use-Cases**: Contains logic for each model.
- **Controllers**: Contains controllers for each model (`api/controllers`).
- **Meeting**: Handles zoom meetings (`api/meeting`).
- **Error**: Handles application errors (`api/error`).
- **Notification Data**: Handles notifications of the system.
- **Security**: Handles authentication and access control.

## 6. Database

Edqan App uses MongoDB as its database. You can find the database configuration in the `.env` file.

## 7. Dependencies

All dependencies are listed in the `package.json` file. You can install these dependencies by running `npm install`.

## 8. Usage

To start the server, use the following command:

```bash
npm start # for production environment
npm run dev # for development environment
```

The server will listen on the specified port (default is 3000).

---
