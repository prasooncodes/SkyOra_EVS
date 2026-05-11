export interface FlightInterface {
  FlightId: number;
  FlightNo: string;
  Source: string;
  Destination: string;
  DepartureTime: Date;
  ArrivalTime: Date;

  TotalBusinessSeats: number;
  TotalEconomySeats: number;
  AvailableBusinessSeats: number;
  AvailableEconomySeats: number;

  BusinessPrice: number;
  EconomyPrice: number;

  flightId?: number;
  flightNo?: string;
  source?: string;
  destination?: string;
  businessPrice?: number;
  economyPrice?: number;
}