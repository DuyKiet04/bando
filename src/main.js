 // thư viện leaflet
import L from "leaflet"; 
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

//  tọa độ trung tâm (10.780221592300679, 106.68759855218681) 273 Điện Biên Phủ , Phường Xuân Hòa , Thành Phố Hồ Chí Minh
const lat = 10.780221592300679;
const log = 106.68759855218681 ;

//  Khởi tạo bản đồ, trung tâm tại 273 Điện Biên Phủ, TP.HCM
const map = L.map('map').setView([lat, log], 17) ;

//  Lớp nền OSM
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
}).addTo(map);

//  Lớp nền Esri World Imagery
const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 20,    
  attribution: 'Tiles &copy; Esri — Source: Esri, USGS, USDA, etc.'
  });
        

//  5 lớp dữ liệu WMS từ  https://geodata-stnmt.tphcm.gov.vn/geoserver/web/wicket/bookmarkable/org.geoserver.web.demo.MapPreviewPage?1&filter=false"

const layerDiemDiaChinh = L.tileLayer.wms("https://geodata-stnmt.tphcm.gov.vn/geoserver/coso_dodac_2024/wms?", {
  layers: "coso_dodac_2024:diemdiachinh",
  format: "image/png",
  transparent: true,
  attribution: "Điểm địa chính | Nguồn: Sở TN&MT TP.HCM",
});

const layerDuongBo = L.tileLayer.wms("https://geodata-stnmt.tphcm.gov.vn/geoserver/dulieunen/wms?", {
  layers: "dulieunen:duongbo",
  format: "image/png",
  transparent: true,
  attribution: "Đường bộ | Nguồn: Sở TN&MT TP.HCM",
});

const layerBeMat = L.tileLayer.wms("https://geodata-stnmt.tphcm.gov.vn/geoserver/dulieunen/wms?", {
  layers: "dulieunen:bematkhudancu",
  format: "image/png",
  transparent: true,
  attribution: "Bề mặt khu dân cư | Nguồn: Sở TN&MT TP.HCM",
});

const layerCayLauNam = L.tileLayer.wms("https://geodata-stnmt.tphcm.gov.vn/geoserver/dulieunen/wms?", {
  layers: "dulieunen:caylaunam",
  format: "image/png",
  transparent: true,
  attribution: "Cây lâu năm | Nguồn: Sở TN&MT TP.HCM",
});

const layerCongTrinh = L.tileLayer.wms("https://geodata-stnmt.tphcm.gov.vn/geoserver/dulieunen/wms?", {
  layers: "dulieunen:congtrinhcongnghieps",
  format: "image/png",
  transparent: true,
  attribution: "Công trình công nghiệp | Nguồn: Sở TN&MT TP.HCM",
});

// Layer Control 
const baseLayers = {
  "OpenStreetMap": osm,
  "Vệ tinh": satelliteLayer,
};

const overlayLayers = {
  "Điểm địa chính ": layerDiemDiaChinh,
  "Đường bộ": layerDuongBo,
  "Bề mặt khu dân cư": layerBeMat,
  "Cây lâu năm": layerCayLauNam,
  "Công trình công nghiệp": layerCongTrinh,
};
// tạo và hiển thị bảng điều khiển  , collapsed : true là bảng thu nhỏ lại , flase thì show ra .
L.control.layers(baseLayers, overlayLayers, { collapsed: true }).addTo(map);
// marker
const marker = L.marker([lat , log] ).addTo(map);
  
marker.bindPopup('<b>273 Điện Biên Phủ , Phường Xuân Hòa , <br> Thành Phố Hồ chí Minh.</b>');

marker.on('click' , function() {
  map.setView([lat, log ] , 17 , {animate: true})
});

