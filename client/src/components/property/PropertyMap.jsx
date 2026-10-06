import React from 'react';
import { Link } from 'react-router-dom';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const mapStyles = { height: '100%', width: '100%' };
const defaultCenter = { lat: 19.076, lng: 72.877 };

export default function PropertyMap({ properties = [] }) {
  const [activeMarker, setActiveMarker] = React.useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return (
      <div className="h-full min-h-[260px] w-full bg-[#F5F1EB] border border-[#DDD5CC] flex items-center justify-center p-6 text-center rounded-sm">
        <p className="text-xs uppercase tracking-widest text-[#766B61] font-medium">
          Add your Google Maps API key to .env to enable map view.
        </p>
      </div>
    );
  }

  const validProps = Array.isArray(properties) ? properties : [];
  const center = (validProps.length === 1 && validProps[0]?.location?.coordinates?.lat)
    ? { lat: Number(validProps[0].location.coordinates.lat), lng: Number(validProps[0].location.coordinates.lng) }
    : defaultCenter;
  const zoom = validProps.length === 1 ? 14 : 6;

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={mapStyles} zoom={zoom} center={center}>
        {validProps.map(item => (
          item?.location?.coordinates?.lat && (
            <Marker 
              key={item._id} 
              position={{ lat: Number(item.location.coordinates.lat), lng: Number(item.location.coordinates.lng) }}
              onClick={() => setActiveMarker(item)}
            />
          )
        ))}
        {activeMarker && activeMarker.location?.coordinates && (
          <InfoWindow
            position={{ lat: Number(activeMarker.location.coordinates.lat), lng: Number(activeMarker.location.coordinates.lng) }}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div className="p-2 max-w-[220px] font-sans">
              {activeMarker.images?.[0] && (
                <img
                  src={activeMarker.images[0]}
                  className="w-full h-24 object-cover mb-2 rounded-xs"
                  alt={activeMarker.title}
                />
              )}
              <h4 className="font-semibold text-xs text-[#3E362E] line-clamp-1">
                {activeMarker.title}
              </h4>
              <p className="text-xs font-bold text-[#865D36] my-1">
                ₹{Number(activeMarker.price || 0).toLocaleString('en-IN')}
                {activeMarker.category === 'rent' ? '/mo' : ''}
              </p>
              <Link
                to={`/properties/${activeMarker._id}`}
                className="text-[11px] uppercase tracking-wider font-semibold text-[#3E362E] hover:text-[#865D36] transition-colors inline-block pt-1"
              >
                View Residence &rarr;
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}