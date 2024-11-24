
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './SearchMovies.css'; // Assuming the styles are in this CSS file

const ListsNextSeen = () => {
  return (
    <div className="lists-next-seen">
      <Card className="movie-card">
        <Card.Img variant="top" src="movie-poster.jpg" />
        <Card.Body>
          <Card.Title>Movie Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
      {/* Add more cards as needed */}
    </div>
  );
};

export default ListsNextSeen;