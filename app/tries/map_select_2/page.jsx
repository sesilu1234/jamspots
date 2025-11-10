export default function Page() {
  const html = `
  <div class="map-container">
    <gmpx-api-loader
      key="AIzaSyBL-twzJmy2J0YtspJXo9ON3ExZucOQAmE"
      solution-channel="GMP_GE_mapsandplacesautocomplete_v2"
    ></gmpx-api-loader>

    <gmp-map center="40.749933,-73.98633" zoom="13" map-id="DEMO_MAP_ID">
      <div slot="control-block-start-inline-start" class="place-picker-container">
        <gmpx-place-picker placeholder="Enter an address"></gmpx-place-picker>
      </div>
      <gmp-advanced-marker></gmp-advanced-marker>
    </gmp-map>
  </div>

  <script>
    async function init() {
      await customElements.whenDefined("gmp-map");

      const map = document.querySelector("gmp-map");
      const marker = document.querySelector("gmp-advanced-marker");
      const placePicker = document.querySelector("gmpx-place-picker");
      const infowindow = new google.maps.InfoWindow();

      map.innerMap.setOptions({ mapTypeControl: false });

      placePicker.addEventListener("gmpx-placechange", () => {
        const place = placePicker.value;
        if (!place.location) {
          window.alert("No details available for input: '" + place.name + "'");
          infowindow.close();
          marker.position = null;
          return;
        }

        if (place.viewport) {
          map.innerMap.fitBounds(place.viewport);
        } else {
          map.center = place.location;
          map.zoom = 17;
        }

        marker.position = place.location;
        infowindow.setContent(\`
          <strong>\${place.displayName}</strong><br>
          <span>\${place.formattedAddress}</span>
        \`);
        infowindow.open(map.innerMap, marker);

        const data = {
          name: place.displayName,
          address: place.formattedAddress,
          coordinates: {
            lat: place.location.lat(),
            lng: place.location.lng(),
          },
        };
        console.log(data);

        const link = \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(
          place.displayName
        )}\`;
        console.log(link);

        const mapLink = \`https://www.google.com/maps/place/?q=place_id:\${place.id}\`;
        console.log(mapLink);
      });
    }

    document.addEventListener("DOMContentLoaded", init);
  </script>

  <script
    type="module"
    src="https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js"
  ></script>

  <style>
    .map-container {
      width: 960px;
      height: 288px;
      max-width: 75%;
      max-height: 80%;
      margin: auto;
      margin-top: 120px;
      border: 1px solid #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    gmp-map {
      width: 100%;
      height: 100%;
      display: block;
    }

    .place-picker-container {
      padding: 5px;
    }
  </style>
  `;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
