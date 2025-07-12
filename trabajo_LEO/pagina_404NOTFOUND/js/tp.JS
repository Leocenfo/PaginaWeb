function initMap() {
  const centro = { lat: 9.9333, lng: -84.0833 }; // San José, Costa Rica

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: centro
  });

  // Marcadores de ejemplo (puedes agregar más aquí)
  const lugares = [
    { lat: 9.9375, lng: -84.088 },
    { lat: 9.929, lng: -84.07 },
    { lat: 9.920, lng: -84.09 }
  ];

  lugares.forEach(pos => {
    new google.maps.Marker({
      position: pos,
      map: map
    });
  });
}