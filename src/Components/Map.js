import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

require('dotenv').config();

mapboxgl.accessToken = process.env.API_TOKEN;

function Map(props) {
  const mapContainerRef = useRef(null);
  const [lat, setLatitude] = useState(37.7749); // Default latitude
  const [long, setLongitude] = useState(-122.4194); // Default longitude
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Update latitude and longitude from props.
  useEffect(() => {
    if (props.ipDetails.latitude && props.ipDetails.longitude) {
      setLatitude(props.ipDetails.latitude);
      setLongitude(props.ipDetails.longitude);
    }
  }, [props.ipDetails]);

  // Initialize the map
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      projection: 'globe',
      zoom: 12,
      center: [long, lat],
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.enable();
    mapRef.current = map;

    map.on('style.load', () => {
      map.setFog({});
    });

    // Initialize the marker
    markerRef.current = new mapboxgl.Marker()
      .setLngLat([long, lat])
      .addTo(map);

      markerRef.current.getElement().addEventListener('click', () => {
        map.flyTo({
          center: [long, lat],
          zoom: 15,
          speed: 1.5,
          curve: 1,
        });
      });

    const secondsPerRevolution = 60; // to change speed og globe spin.
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false; // globe spin automatically until interaction.

    const spinEnabled = true;

    const spinGlobe = () => {
      const zoom = map.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.getCenter();
        center.lng -= distancePerSecond;
        map.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    };

    map.on('mousedown', () => {
      userInteracting = true;

    });
    map.on('dragstart', () => {
      userInteracting = true;

    });
    map.on('moveend', () => {
      spinGlobe();
    });

    spinGlobe();

    return () => {
      map.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the marker and fly to new location when lat and long change
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      // Update marker position
      markerRef.current.setLngLat([long, lat]);

      // Fly to the new location
      mapRef.current.flyTo({
        center: [long, lat],
        zoom: 12,
        speed: 2,
        curve: 1,
      });
    }
    markerRef.current.getElement().addEventListener('click', () => {
      mapRef.current.flyTo({
        center: [long, lat],
        zoom: 15,
        speed: 1.5,
        curve: 1,
      });
    });


  }, [lat,long]);

  return <div className="map" ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />;
}

export default Map;
