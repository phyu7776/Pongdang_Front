import { ZoomIn, ZoomOut } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import centroid from "@turf/centroid";
import PropTypes from 'prop-types';
import { memo } from 'react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * 세계 지도 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} props.position - 지도 위치 및 줌 상태
 * @param {function} props.setPosition - 지도 위치 설정 함수
 * @param {Array} props.visitedCountries - 방문한 국가 목록
 * @param {function} props.onCountryClick - 국가 클릭 핸들러
 */
function WorldMap({ position, setPosition, visitedCountries, onCountryClick }) {
  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 4) }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 0.5) return;
    setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 0.5) }));
  };

  const handleMoveEnd = (position) => {
    setPosition(position);
  };

  const handleCountryClick = (geo) => {
    if (onCountryClick) {
      const center = centroid(geo);
      onCountryClick(geo, center.geometry.coordinates);
    }
  };

  return (
    <div style={{ width: "100%", height: "500px", backgroundColor: "#f5f5f5", position: "relative" }}>
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-zinc-700"
          aria-label="지도 확대"
          title="지도 확대"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-zinc-700"
          aria-label="지도 축소"
          title="지도 축소"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [0, 0]
        }}
        style={{
          width: "100%",
          height: "100%"
        }}
        aria-label="세계 지도"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={4}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleCountryClick(geo)}
                  aria-label={`${geo.properties.name} 국가`}
                  tabIndex={0}
                  role="button"
                  style={{
                    default: {
                      fill: "#A8A8B3",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
          {visitedCountries.length > 0 && visitedCountries.map((country, index) => (
            country.coordinates && country.coordinates.length === 2 ? (
              <Marker key={index} coordinates={country.coordinates}>
                <circle r={5} fill="#F53" aria-label={`방문한 국가: ${country.name}`} />
              </Marker>
            ) : null
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

WorldMap.propTypes = {
  position: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    zoom: PropTypes.number.isRequired
  }).isRequired,
  setPosition: PropTypes.func.isRequired,
  visitedCountries: PropTypes.arrayOf(
    PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number)
    })
  ).isRequired,
  onCountryClick: PropTypes.func.isRequired
};

export default memo(WorldMap); 