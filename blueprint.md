# Project Blueprint: Real-Time Weather Website

## Overview

This document outlines the plan for creating a real-time weather website as requested. The website will display the current weather for a default city (Busan), show the last updated time, and allow users to select other major South Korean cities to view their weather.

## Core Features

*   **Default City Weather:** Display the current weather for Busan on page load.
*   **Last Updated Time:** Show the date and time when the weather information was last fetched.
*   **City Selection:** A dropdown menu to select from a list of major South Korean cities.
*   **Detailed Weather Button:** A button that redirects the user to a more detailed weather report for the selected city.
*   **Real-time Data:** Weather information will be fetched from the `wttr.in` JSON API.

## Design and Styling

*   **Theme:** A modern, dark theme will be used for the interface.
*   **Layout:** A responsive, centered layout that works well on both desktop and mobile devices.
*   **Components:** Web Components will be used to create a reusable `<weather-card>` element for displaying weather information.
*   **Visuals:**
    *   **Texture:** A subtle noise texture on the background.
    *   **Depth:** Multi-layered drop shadows on UI elements to create a sense of depth and a "lifted" look.
    *   **Interactivity:** Interactive elements like buttons and dropdowns will have a "glow" effect on hover/focus.
    *   **Typography:** Clear and readable fonts with a good hierarchy.

## Technical Implementation

*   **HTML (`index.html`):** The main structure of the page, including the container for the weather information, the city selector, and the details button.
*   **CSS (`style.css`):** All styling for the application, including the dark theme, responsive layout, and component styles. CSS variables will be used for colors.
*   **JavaScript (`main.js`):**
    *   **ES Modules:** The code will be organized using ES Modules.
    *   **Web Components:** A custom element `weather-card` will be defined.
    *   **API Fetching:** The `fetch` API with `async/await` will be used to get data from `https://wttr.in/{city}?format=j1`.
    *   **DOM Manipulation:** The UI will be dynamically updated with the fetched weather data.
    *   **Event Handling:** Event listeners will be set up for the city selection dropdown and the "Detailed Weather" button.

## Plan for Current Request

1.  **Create `blueprint.md`:** Document the project plan. (Done)
2.  **Update `index.html`:** Add the necessary HTML elements for the weather display, city selector, and buttons.
3.  **Update `style.css`:** Implement the dark theme, responsive layout, and styles for all UI elements.
4.  **Update `main.js`:**
    *   Define the `WeatherCard` custom element.
    *   Create a function to fetch weather data from the `wttr.in` API.
    *   Create a function to update the DOM with the new weather data.
    *   Add event listeners for user interactions.
    *   Fetch the initial weather data for Busan on page load.
