export interface FlightInterface {
  flightId: number;
  flightNo: string;
  source: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;

  totalBusinessSeats: number;
  totalEconomySeats: number;
  availableBusinessSeats: number;
  availableEconomySeats: number;

  businessPrice: number;
  economyPrice: number;
}