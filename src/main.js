      // thư viện leaflet
      import L from "leaflet"; 
      import "leaflet/dist/leaflet.css";
      //  tọa độ trung tâm (10.780221592300679, 106.68759855218681) 273 Điện Biên Phủ , Phường Xuân Hòa , Thành Phố Hồ Chí Minh
      const lat = 10.780221592300679;
      const log = 106.68759855218681 ;
      
      // khởi tạo bản đồ 
      const map = L.map('map').setView([lat, log] , 17);
     
      // nền bản đồ openStreetMap
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png' , {
        maxZoom : 20,
        // bản quyền openStreetMap
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'   
      }).addTo(map);
      // maker tại vị trí xác định
      const marker = L.marker([lat , log] ).addTo(map);
      // thông tin maker 
      marker.bindPopup('<b>273 Điện Biên Phủ , Phường Xuân Hòa , <br> Thành Phố Hồ chí Minh.</b>');
      
      
