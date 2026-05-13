import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

export default function PeruMap() {

  const [geoData, setGeoData] = useState(null);

  const [hoveredRegion, setHoveredRegion] =
    useState(null);

  useEffect(() => {

    fetch("/peru.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
      });

  }, []);

  return (
    <div className="relative bg-white rounded-3xl shadow-sm border border-slate-200 p-4">

      <h2 className="text-2xl font-bold mb-4 text-slate-800">
        Mapa Electoral del Perú
      </h2>

      <div className="bg-slate-100 rounded-2xl overflow-hidden">

        {geoData && (

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 1200,
              center: [-75, -9],
            }}
            style={{
              width: "100%",
              height: "600px",
            }}
          >

            <Geographies geography={geoData}>

              {({ geographies }) =>

                geographies.map((geo) => {

                  const region =
                    geo.properties.NOMBDEP ||
                    geo.properties.name ||
                    "Desconocido";

                  return (

                    <Geography
                      key={geo.rsmKey}
                      geography={geo}

                      onMouseEnter={() => {
                        setHoveredRegion(region);
                      }}

                      onMouseLeave={() => {
                        setHoveredRegion(null);
                      }}

                      style={{
                        default: {
                          fill: "#2563eb",
                          outline: "none",
                          stroke: "#ffffff",
                          strokeWidth: 0.5,
                        },

                        hover: {
                          fill: "#1d4ed8",
                          outline: "none",
                          cursor: "pointer",
                        },

                        pressed: {
                          fill: "#1e40af",
                          outline: "none",
                        },
                      }}
                    />

                  );
                })
              }

            </Geographies>

          </ComposableMap>

        )}

      </div>

      {hoveredRegion && (

        <div className="absolute top-24 left-6 bg-blue-900 text-white px-4 py-3 rounded-2xl shadow-xl z-50">

          <h3 className="font-bold text-lg">
            {hoveredRegion}
          </h3>

          <p className="text-sm opacity-90">
            Región seleccionada
          </p>

          <div className="mt-2 text-sm">
            <p>Participación: 78%</p>
            <p>Mesas: 1,250</p>
            <p>Ganador: Candidato A</p>
          </div>

        </div>

      )}

    </div>
  );
}