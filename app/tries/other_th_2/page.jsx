'use client';
import { useEffect } from 'react';

export default function PlacesExample() {
  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBL-twzJmy2J0YtspJXo9ON3ExZucOQAmE&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      const sydney = new google.maps.LatLng(-33.867, 151.195);
      const map = new google.maps.Map(document.getElementById('map'), {
        center: sydney,
        zoom: 15,
      });

      const infowindow = new google.maps.InfoWindow();
      const service = new google.maps.places.PlacesService(map);

      const request = {
        query: 'Museum of Contemporary Art Australia',
        fields: ['name', 'geometry'],
      };

      service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          results.forEach((place) => createMarker(place, map, infowindow));
          map.setCenter(results[0].geometry.location);
        }
      });
    };

    const createMarker = (place, map, infowindow) => {
      if (!place.geometry || !place.geometry.location) return;
      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
      });
      marker.addListener('click', () => {
        infowindow.setContent(place.name || '');
        infowindow.open(map, marker);
      });
    };

    loadScript();
  }, []);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        marginTop: '20px',
      }}
    />
  );
}
