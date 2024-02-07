import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Spinner } from "react-bootstrap";
import AutocompleteOptions from "./components/Location/AutocompleteOptions"; // AutocompleteOptions bileşenini ekleyin
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [flightType, setFlightType] = useState("one-way");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelClass, setTravelClass] = useState("ECONOMY");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [autocompleteOptions, setAutocompleteOptions] = useState([]); 
  const [destinationAutocompleteOptions, setDestinationAutocompleteOptions] = useState([]); 
  const [minPrice, setMinPrice] = useState(""); 
  const [maxPrice, setMaxPrice] = useState(""); 

  
  const handleAutocomplete = async (input, setOptions) => {
    try {
      const response = await fetch(`http://localhost:3000/api/autocomplete?keyword=${input}`);
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error(error);
      setOptions([]);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    try {
      const response = await fetch(`http://localhost:3000/api/search?origin=${origin}&destination=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&flightType=${flightType}&adults=${adults}&children=${children}&infants=${infants}&travelClass=${travelClass}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    
  }, [searchResults]);

  const isFormValid = () => {
    
    if (origin === "" || destination === "") {
      return false;
    }
    
    if (departureDate === "") {
      return false;
    }
    return true;
  };

  const filterResultsByPrice = () => {
    if (minPrice === "" && maxPrice === "") {
      return searchResults;
    }
    const filteredResults = searchResults.filter(result => {
      const totalPrice = result.price.total;
      if (minPrice !== "" && maxPrice !== "") {
        return totalPrice >= parseFloat(minPrice) && totalPrice <= parseFloat(maxPrice);
      } else if (minPrice !== "") {
        return totalPrice >= parseFloat(minPrice);
      } else {
        return totalPrice <= parseFloat(maxPrice);
      }
    });
    return filteredResults;
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Locations</h5>
              <Form>
                {}
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="origin-input">
                      <Form.Label>Origin</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Location"
                        value={origin}
                        onChange={(e) => {
                          setOrigin(e.target.value);
                          handleAutocomplete(e.target.value, setAutocompleteOptions); 
                        }}
                      />
                      {}
                      <AutocompleteOptions 
                        options={autocompleteOptions} 
                        handleSelection={(option) => {
                          setOrigin(option.name);
                          setAutocompleteOptions([]); 
                        }} 
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="destination-input">
                      <Form.Label>Destination</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Location"
                        value={destination}
                        onChange={(e) => {
                          setDestination(e.target.value);
                          handleAutocomplete(e.target.value, setDestinationAutocompleteOptions); 
                        }}
                      />
                      {}
                      <AutocompleteOptions 
                        options={destinationAutocompleteOptions} 
                        handleSelection={(option) => {
                          setDestination(option.name);
                          setDestinationAutocompleteOptions([]); 
                        }} 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {}
                <Row>
                  <Col>
                    <div className="date-container bordered-div">
                      <h5>Dates</h5>
                      <Form.Group className="mb-3" controlId="flight-type-select">
                        <Form.Label>Flight Type</Form.Label>
                        <Form.Select value={flightType} onChange={(e) => setFlightType(e.target.value)}>
                          <option value="one-way">One-way</option>
                          <option value="round-trip">Round-trip</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="departure-date-input">
                        <Form.Label>Departure Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={departureDate}
                          onChange={(e) => setDepartureDate(e.target.value)}
                        />
                      </Form.Group>
                      {flightType === "round-trip" && (
                        <Form.Group className="mb-3" controlId="return-date-input">
                          <Form.Label>Return Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                          />
                        </Form.Group>
                      )}
                    </div>
                  </Col>
                  <Col>
                    <div className="details-container bordered-div">
                      <h5>Details</h5>
                      <Form.Group className="mb-3" controlId="travel-class-select">
                        <Form.Label>Travel Class</Form.Label>
                        <Form.Select value={travelClass} onChange={(e) => setTravelClass(e.target.value)}>
                          <option value="ECONOMY">Economy</option>
                          <option value="PREMIUM_ECONOMY">Premium Economy</option>
                          <option value="BUSINESS">Business</option>
                          <option value="FIRST">First</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="adults-input">
                        <Form.Label>Adults</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={adults}
                          onChange={(e) => setAdults(parseInt(e.target.value))}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="children-input">
                        <Form.Label>Children</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={children}
                          onChange={(e) => setChildren(parseInt(e.target.value))}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="infants-input">
                        <Form.Label>Infants</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={infants}
                          onChange={(e) => setInfants(parseInt(e.target.value))}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="min-price-input">
                        <Form.Label>Min Price</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="max-price-input">
                        <Form.Label>Max Price</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
                      </Form.Group>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button variant="primary" onClick={handleSearch} disabled={!isFormValid()}>
                      Search
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Results</h5>
              {searching ? (
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <ListGroup>
                  {filterResultsByPrice().length === 0 ? (
                    <ListGroup.Item>No results</ListGroup.Item>
                  ) : (
                    filterResultsByPrice().map((result, index) => (
                      <ListGroup.Item key={index}>
                        {result.itineraries.map((itinerary, i) => (
                          <div key={i}>
                            <small className="text-muted">{i === 0 ? "Outbound" : "Return"}</small>
                            <span className="fw-bold">{itinerary.segments.map(segment => segment.departure.iataCode).join(" → ")} → {itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}</span>
                            <div>{itinerary.duration}</div>
                          </div>
                        ))}
                        <span className="bg-primary rounded-pill m-2 badge fs-6">{result.price.total} {result.price.currency}</span>
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
