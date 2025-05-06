# LocalBytes Backend API Documentation

This document outlines the available endpoints for the LocalBytes API.

## Base URL

> [!NOTE]
> The port is normalized to ensure it isn't in use by another service.   
> The API will run on port 5000 by default.

```
http://localhost:5000
```

## Authentication

_Note: Authentication through frontend session tokens will be implemented in the future._

## Endpoints

### Restaurants

#### Get All Restaurants

```
GET /api/restaurants
```

Returns a list of all restaurants in the database.  
Type: `Restaurant[]`

#### Fetch Restaurants from Google Places API

```
GET /api/restaurants/fetch?lat=38.951561&lng=-92.328636&radius=8000&query=restaurant
```

Fetches restaurants from Google Places API based on location and search query, then saves new ones to the database. Returns the newly added restaurants.  
Type: `Restaurant[]`

Query Parameters:
- `lat`: Latitude (default: 38.951561)
- `lng`: Longitude (default: -92.328636)
- `radius`: Search radius in meters (default: 8000)
- `query`: Search query (default: 'restaurant')

### Comments

#### Create Comment

```
POST /api/comments
```

Creates a new comment.

Request Body:
```json
{
  "body": "This restaurant is amazing!",
  "place_id": "google_place_id",
  "uuid": "user_id"
}
```

#### Get Comments by Place ID

```
GET /api/comments/place/:placeId
```

Returns all comments for a specific restaurant identified by its Google Place ID.

#### Update Comment

> [!NOTE]
> The update comment endpoint is not yet implemented.

```
PUT /api/comments/:commentId
```

Updates a specific comment.

Request Body:
```json
```

#### Delete Comment

> [!NOTE]
> The delete comment endpoint is not yet implemented.

```
DELETE /api/comments/:commentId
```

Deletes a specific comment.