import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  // Replace with your actual Google Analytics Measurement ID
  private readonly GA_MEASUREMENT_ID = 'G-SQ4FSX9D4V'; // Update this with your GA4 measurement ID

  constructor() {
    this.initGoogleAnalytics();
  }

  /**
   * Initialize Google Analytics by loading the gtag script
   */
  private initGoogleAnalytics(): void {
    if (typeof window === 'undefined') {
      return; // Skip on server-side rendering
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // ✅ FIXED: Updated function expression signature to accept rest parameters (...args: any[])
    // This resolves the 'Expected 0 arguments, but got 2' build compilation error permanently.
    const gtag = function(...args: any[]) {
      (window.dataLayer as any).push(args);
    };
    
    gtag('js', new Date());
    gtag('config', this.GA_MEASUREMENT_ID);

    // Store gtag function globally for use across components
    (window as any).gtag = gtag;
  }

  /**
   * Track page view event
   * @param pageTitle - Title of the page
   * @param pagePath - Path of the page
   */
  trackPageView(pageTitle: string, pagePath: string): void {
    this.sendEvent('page_view', {
      page_title: pageTitle,
      page_path: pagePath
    });
  }

  /**
   * Track custom event
   * @param eventName - Name of the event
   * @param eventData - Event data object
   */
  trackEvent(eventName: string, eventData?: Record<string, any>): void {
    this.sendEvent(eventName, eventData);
  }

  /**
   * Track flight search event
   * @param source - Flight departure city
   * @param destination - Flight arrival city
   * @param tripType - 'oneway' or 'roundtrip'
   */
  trackFlightSearch(source: string, destination: string, tripType: string): void {
    this.sendEvent('flight_search', {
      source_city: source,
      destination_city: destination,
      trip_type: tripType
    });
  }

  /**
   * Track flight selection event
   * @param flightId - ID of selected flight
   * @param source - Flight departure city
   * @param destination - Flight arrival city
   */
  trackFlightSelection(flightId: number, source: string, destination: string): void {
    this.sendEvent('flight_selected', {
      flight_id: flightId,
      source_city: source,
      destination_city: destination
    });
  }

  /**
   * Track passenger count change event
   * @param numberOfPassengers - Number of passengers
   */
  trackPassengerCountChange(numberOfPassengers: number): void {
    this.sendEvent('passenger_count_changed', {
      number_of_passengers: numberOfPassengers
    });
  }

  /**
   * Track seat type selection
   * @param seatType - Type of seat selected ('Economy' or 'Business')
   * @param passengerIndex - Index of passenger
   */
  trackSeatTypeSelection(seatType: string, passengerIndex: number): void {
    this.sendEvent('seat_type_selected', {
      seat_type: seatType,
      passenger_index: passengerIndex
    });
  }

  /**
   * Track trip type selection
   * @param tripType - Trip type ('oneway' or 'roundtrip')
   */
  trackTripTypeSelection(tripType: string): void {
    this.sendEvent('trip_type_selected', {
      trip_type: tripType
    });
  }

  /**
   * Track date selection event
   * @param dateType - Type of date ('booking_date' or 'return_date')
   * @param date - Selected date
   */
  trackDateSelection(dateType: string, date: string): void {
    this.sendEvent('date_selected', {
      date_type: dateType,
      selected_date: date
    });
  }

  /**
   * Track booking initiation event
   * @param totalPrice - Total price of booking
   * @param numberOfPassengers - Number of passengers
   * @param flightId - Flight ID
   */
  trackBookingInitiated(totalPrice: number, numberOfPassengers: number, flightId: number): void {
    this.sendEvent('booking_initiated', {
      value: totalPrice,
      currency: 'INR',
      number_of_passengers: numberOfPassengers,
      flight_id: flightId
    });
  }

  /**
   * Track booking completion event
   * @param totalPrice - Total price of booking
   * @param numberOfPassengers - Number of passengers
   * @param flightId - Flight ID
   */
  trackBookingCompleted(totalPrice: number, numberOfPassengers: number, flightId: number): void {
    this.sendEvent('booking_completed', {
      value: totalPrice,
      currency: 'INR',
      number_of_passengers: numberOfPassengers,
      flight_id: flightId
    });
  }

  /**
   * Track error event
   * @param errorType - Type of error
   * @param errorMessage - Error message
   */
  trackError(errorType: string, errorMessage: string): void {
    this.sendEvent('error', {
      error_type: errorType,
      error_message: errorMessage
    });
  }

  /**
   * Track validation error event
   * @param validationMessage - Validation error message
   */
  trackValidationError(validationMessage: string): void {
    this.sendEvent('validation_error', {
      error_message: validationMessage
    });
  }

  /**
   * Send event to Google Analytics
   * @param eventName - Name of the event
   * @param eventData - Event data
   */
  private sendEvent(eventName: string, eventData?: Record<string, any>): void {
    if (typeof window === 'undefined' || !(window as any).gtag) {
      return; // Skip if gtag is not available (SSR or not initialized)
    }

    try {
      (window as any).gtag('event', eventName, eventData || {});
    } catch (error) {
      console.error('Error tracking event:', eventName, error);
    }
  }
}

// Declare gtag global with open array args parameter to pass compilation tests cleanly
declare let gtag: (...args: any[]) => void;

// Extend window interface
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
