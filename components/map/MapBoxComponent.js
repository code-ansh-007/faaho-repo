import ReactMapGl, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import GeoCoder from "./GeoCoder";

const MapBoxComponent = ({
  lat,
  lng,
  latSetterFunction,
  lngSetterFunction,
  setLocationName,
  listingView,
  large,
}) => {
  const mapRef = useRef(null);
  useEffect(() => {
    if (listingView) return;
    fetch("https://ipapi.co/json")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        mapRef?.current?.flyTo({ center: [data.longitude, data.latitude] });
        latSetterFunction(data.latitude);
        lngSetterFunction(data.longitude);
      });
  }, []);

  return (
    <main className="relative">
      <ReactMapGl
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1Ijoic2xpY2VvZmFuc2giLCJhIjoiY2xqand2OGJkMGU5ajNlcHBybmJ3bmhmcCJ9.SQkgqzB2OVG-o3thrzDzvw"
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 8,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{
          width: `${large ? 400 : 320}px`,
          height: `${large ? 400 : 300}px`,
          // height: 300,
          // width: 320,
          borderRadius: "10px",
        }}
      >
        <Marker
          latitude={lat}
          longitude={lng}
          draggable={!listingView}
          onDragEnd={(e) => {
            if (listingView) return;
            latSetterFunction(e.lngLat.lat);
            lngSetterFunction(e.lngLat.lng);
          }}
        />
        <NavigationControl position="bottom-right" />
        {listingView ? null : (
          <GeolocateControl
            position="top-left"
            trackUserLocation
            onGeolocate={(e) => {
              latSetterFunction(e.coords.latitude);
              lngSetterFunction(e.coords.longitude);
            }}
          />
        )}
        {listingView ? null : (
          <GeoCoder
            latSetterFunction={latSetterFunction}
            lngSetterFunction={lngSetterFunction}
            setLocationName={setLocationName}
          />
        )}
      </ReactMapGl>
    </main>
  );
};

export default MapBoxComponent;
