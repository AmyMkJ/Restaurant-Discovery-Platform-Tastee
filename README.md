# Tastee - Restaurant Discovery Platform

## Project Title
Tastee

## Description of the Web Application
Tastee is a comprehensive web application designed to help users discover restaurants around a chosen location. Users can search for restaurants by name or cuisine tags, browse ranked listings, and read or write reviews after dining. The platform incorporates social features such as favorites, history tracking, friend/follow functionality, activity feeds, and likes. To maintain content quality, the app includes anti-spam mechanisms that detect abnormal bursts of likes or reviews and can throttle or suspend suspicious accounts.

## Key Features for Beta Version
- **Map & Location Integration**: Large interactive map displaying user's current location or a specified address; automatically fetches nearby restaurants within a configurable radius (e.g., 2–5 km).
- **Search Functionality**: Search by restaurant name or tags/cuisines/locations using basic text matching and distance filtering.
- **Listings & Sorting**: Display restaurant lists sortable by newest, popularity, or price; includes pagination and lazy loading for improved performance.
- **Restaurant Detail Pages**: Show core information (name, location, tags), average rating, and recent reviews with images.
- **Authentication & User Profiles**: Email/password-based authentication; user profiles displaying favorites and visit history.
- **Review System**: Logged-in users can post ratings and text reviews; includes a simple report/flagging mechanism for inappropriate content.
- **Favorites Management**: Ability to save and manage favorite restaurants.
- **Basic Anti-Spam Measures**: Rate limiting and burst detection (e.g., throttling accounts that generate too many likes/reviews in a short time).

## Additional Features for Final Version
- **Advanced Search & Ranking**: Multi-signal ranking algorithm combining distance, popularity, and text relevance; additional filters for price range and current open status.
- **Social Layer Enhancement**: Follow friends and restaurants; personalized activity feed; likes and comments on posts; nested comments (replies to comments).
- **Personalized Recommendations**: "Because you liked X" suggestions and trending restaurants for the week.

## Technology Stack
- **Frontend**: Next.js
- **Backend**: Express.js
- **Database**: NeDB
- **Web API**: RESTful architecture / long polling
- **Maps Integration**: Google Maps API or Mapbox
- **DevOps & Deployment**: Docker

## Top 5 Technical Challenges
1. **Geospatial Indexing & Proximity Queries**: Implementing efficient location-based searches to find restaurants within a specified radius, requiring learning and applying geospatial indexing techniques not covered in class.
2. **Real-Time Activity Feed with WebSockets**: Building a responsive, live-updating social feed using Socket.IO, managing connection states and efficient data broadcasting.
3. **Map Integration & Geocoding API Implementation**: Creating a dynamic, interactive map where users can search for a place by name (like "Toronto") and see it pinpointed, or click on the map to get that location's address. The challenge is learning to use mapping tools (like Mapbox) and managing the external services that power these features, all while ensuring the map responds quickly and reliably. (also use cron job google map to automatically renew the data and do the quick search) 
4. **Personalized Recommendation Engine**: Creating a content-based filtering system that suggests restaurants based on the user's favorite history and similar user preferences.
5. **Implementing an Efficient Multi-Filter Search System**: Designing and building a robust client and server-side architecture that can seamlessly handle concurrent filters (e.g., cuisine tags, price range, operating hours) along with text queries, ensuring performance and a smooth user experience as filter complexity grows.
