# Mapbox Route Planner

This project is a Mapbox-based interactive route planning tool. It allows users to add points on the map, calculate routes, view distance and duration,  Points can be added via map click or autocomplete search

## Features

- **Interactive Mapbox map** with user geolocation  
- **Add points** by clicking on the map or using search  
- **Calculate routes** between multiple points  
- **Route summary**: total distance and duration  
- **Autocomplete search** using Mapbox  

## Setup Instructions

### Prerequisites

- Node.js 
- npm or yarn  
- Mapbox access token  

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Create .env file on the root of the project 
- add VITE_PUBLIC_MAPBOX_TOKEN = {{Your access token here}}

### 3. run the application
```
npm i
npm run dev
```
