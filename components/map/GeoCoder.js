import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useControl } from "react-map-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const GeoCoder = ({
  latSetterFunction,
  lngSetterFunction,
  setLocationName,
}) => {
  const ctrl = new MapboxGeocoder({
    accessToken:
      "pk.eyJ1Ijoic2xpY2VvZmFuc2giLCJhIjoiY2xqand2OGJkMGU5ajNlcHBybmJ3bmhmcCJ9.SQkgqzB2OVG-o3thrzDzvw",
    marker: false,
    collapsed: true,
  });
  useControl(() => ctrl);
  ctrl.on("result", (e) => {
    const coords = e.result.geometry.coordinates;
    setLocationName(e.result.place_name);
    lngSetterFunction(coords[0]);
    latSetterFunction(coords[1]);
  });
  return null;
};

export default GeoCoder;
