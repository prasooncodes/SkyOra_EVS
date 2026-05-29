# Google Analytics Implementation for Book Flight Component

This document describes how to set up and use Google Analytics in the SkyOra application, specifically for the Book Flight component.

## Setup Instructions

### 1. Install Dependencies
Google Analytics dependencies have already been installed. If you need to reinstall them, run:
```bash
npm install --save-dev @types/gtag.js
```

### 2. Add Google Analytics Script to index.html
The Google Analytics script will be loaded dynamically by the `GoogleAnalyticsService`. However, for best practices, you can also add it to your `src/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your actual Google Analytics Measurement ID.

### 3. Update Google Analytics Service
Open `src/app/services/google-analytics.ts` and replace the placeholder Measurement ID:

```typescript
private readonly GA_MEASUREMENT_ID = 'G-YOUR_ACTUAL_MEASUREMENT_ID';
```

Get your Measurement ID from Google Analytics:
1. Go to https://analytics.google.com
2. Select your property
3. Go to Admin → Data streams
4. Select your web stream
5. Copy the Measurement ID (starts with `G-`)

## Events Tracked

### Page View
- **Event Name**: `page_view`
- **When**: Component initializes
- **Data**: Page title and path

### Flight Search
- **Event Name**: `flight_search`
- **When**: User clicks "Search Flights"
- **Data**: Source city, destination city, trip type

### Flight Selection
- **Event Name**: `flight_selected`
- **When**: User selects a flight from search results
- **Data**: Flight ID, source city, destination city

### Passenger Count Change
- **Event Name**: `passenger_count_changed`
- **When**: User changes the number of passengers
- **Data**: Number of passengers

### Seat Type Selection
- **Event Name**: `seat_type_selected`
- **When**: User selects economy or business class
- **Data**: Seat type, passenger index

### Trip Type Selection
- **Event Name**: `trip_type_selected`
- **When**: User switches between one-way and round-trip
- **Data**: Trip type ('oneway' or 'roundtrip')

### Date Selection
- **Event Name**: `date_selected`
- **When**: User selects booking date or return date
- **Data**: Date type ('booking_date' or 'return_date'), selected date

### Booking Initiated
- **Event Name**: `booking_initiated`
- **When**: User starts the booking process (passes validation)
- **Data**: Total price (value), currency, number of passengers, flight ID

### Booking Completed
- **Event Name**: `booking_completed`
- **When**: User completes booking and navigates to booking cart
- **Data**: Total price (value), currency, number of passengers, flight ID

### Validation Errors
- **Event Name**: `validation_error`
- **When**: User encounters a validation error
- **Data**: Error message

### Search Errors
- **Event Name**: `flight_search_error`
- **When**: Flight search API fails
- **Data**: Error message

## Using the Google Analytics Service

The `GoogleAnalyticsService` is already injected into the `BookFlight` component. To track custom events, use:

```typescript
// Track a custom event
this.googleAnalyticsService.trackEvent('custom_event_name', {
  custom_property_1: 'value1',
  custom_property_2: 'value2'
});
```

## Using Google Analytics Dashboard

1. Go to Google Analytics (https://analytics.google.com)
2. Select your property
3. Go to **Reports** → **Realtime** to see live events
4. Go to **Reports** → **Events** to see event analytics
5. Create custom reports and segments based on the events

## Ecommerce Events Configuration (Optional)

For more advanced tracking (like purchase tracking), you can implement ecommerce events:

```typescript
this.googleAnalyticsService.trackEvent('purchase', {
  value: 5999,
  currency: 'INR',
  items: [
    {
      item_id: 'flight_123',
      item_name: 'Delhi to Mumbai Flight',
      item_category: 'flight',
      quantity: 1,
      price: 5999
    }
  ]
});
```

## Debugging

### Check if Google Analytics is working:
1. Open Developer Tools (F12)
2. Go to Network tab
3. Look for requests to `googletagmanager.com`
4. Go to Console tab and check if there are any errors

### Debug mode:
1. Add `&debug` to your URL: `https://localhost:4200/book-flight?debug`
2. Open Developer Tools Console
3. Look for gtag debug messages

### Google Analytics Debugger Extension:
1. Install the [Google Analytics Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/)
2. Go to your application
3. Open Developer Tools Console to see detailed event tracking

## Best Practices

1. **Set User ID** (Optional): If users are logged in, set user ID for better tracking:
   ```typescript
   this.googleAnalyticsService.trackEvent('user_logged_in', {
     user_id: userId,
     user_type: 'premium'
   });
   ```

2. **Track Custom Dimensions**: Store additional context:
   ```typescript
   this.googleAnalyticsService.trackEvent('flight_booked', {
     airline: 'IndiGo',
     aircraft_type: 'Airbus A320',
     route: 'DEL-BOM'
   });
   ```

3. **Use Meaningful Event Names**: Use snake_case for event names
4. **Avoid PII**: Don't send personal information in events
5. **Test Thoroughly**: Test all events before going to production

## Troubleshooting

### Events not showing up in Google Analytics:
1. Check if Measurement ID is correct
2. Wait 24-48 hours for data to appear in reports (real-time data shows immediately)
3. Verify in the Realtime tab first
4. Check for any JavaScript errors in the console

### Events showing as "not set":
1. Ensure event names don't have special characters
2. Ensure event parameters are string values
3. Check that events are being called after Google Analytics is initialized

## Resources

- [Google Analytics Documentation](https://developers.google.com/analytics/devguides/collection/gtagjs)
- [Event Measurement Guide](https://support.google.com/analytics/answer/9234069)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/10089681)
