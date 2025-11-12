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
  attribution: ' &copy; Esri '
  });
        
const esriStreet = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: '© Esri Street Map',
  
  maxZoom: 20
  });
const esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: '© Esri Topographic',
  
  maxZoom: 20
  });
const googleRoad = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  attribution: '© Google Roads',
  maxZoom: 20
});
const carto = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '© Carto Voyager',
                
  maxZoom: 20
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
const baseLayers =[
   {
  name: 'OSM',
  layer: osm ,
  img: './img/osm.png',
},
{
  name: 'Vệ Tinh',
  layer: satelliteLayer ,
  img: './img/veTinh.png',
},
{
  name: 'Đường Phố',
  layer: esriStreet,
  img: './img/duongpho.png',
},
{
  name: 'Địa Hình',
  layer: esriTopo ,
  img: './img/diahinh.png',
},
{
  name: 'Google Map',
  layer: googleRoad ,
  img: './img/ggmap.png',
},
{
  name: 'Carto ',
  layer: carto ,
  img: './img/carto.png',
},

];

const overlayLayers =[
  {
    name: 'Bề mặt dân cư',
    layer:layerBeMat ,
    icon: 'fa-solid fa-house-chimney'
  },
  {
    name: 'Điểm địa chính',
    layer:layerDiemDiaChinh ,
    icon:'fa-solid fa-location-dot'
  },
  {
    name: 'Đường bộ',
    layer:layerDuongBo ,
    icon:'fa-solid fa-road'
  },
  {
    name: 'Cây lâu năm',
    layer:layerCayLauNam ,
    icon:'fa-solid fa-tree'
  },
  {
    name: 'Công trình công nghiệp',
    layer:layerCongTrinh ,
    icon:'fa-solid fa-industry'
  }

]

// Custom control 
const CombinedLayerControl = L.Control.extend({
    onAdd: function () {
        
        const wrapper = L.DomUtil.create("div", "combined-layer-control-wrapper");

        //  nút bấm icon
        const toggleButton = L.DomUtil.create("div", "custom-layer-toggle", wrapper);
        toggleButton.innerHTML = `<div><i class="fa-solid fa-layer-group"></i></div>`;
        //  bảng control
        const panelContainer = L.DomUtil.create("div", "combined-layer-control", wrapper);
        
        // Ngăn click trên control lan xuống bản đồ
        L.DomEvent.disableClickPropagation(wrapper);

        const baseSection = L.DomUtil.create("div", "base-section", panelContainer);
        const titleBlock = L.DomUtil.create("div", "base-title", baseSection);
        titleBlock.innerHTML = `<h4> Lớp nền bản đồ</h4>`;
        const itemsContainer = L.DomUtil.create("div", "base-items-list", baseSection);
        baseLayers.forEach((item, index) => {
            const div = L.DomUtil.create("div", "base-item", itemsContainer);
            div.innerHTML = `
                <img src="${item.img}" class="base-thumb" alt="${item.name}">
                <div class="base-name">${item.name}</div>
            `;
            
            
            if (map.hasLayer(item.layer)) {
                div.classList.add("selected");
            }

            L.DomEvent.on(div, "click", () => {
                baseLayers.forEach(i => map.removeLayer(i.layer));
                map.addLayer(item.layer);
                document.querySelectorAll(".base-item").forEach(el => el.classList.remove("selected"));
                div.classList.add("selected");
            });
        });
        
        const overlaySection = L.DomUtil.create("div", "overlay-section", panelContainer);
        overlaySection.innerHTML = `<h4> Lớp dữ liệu</h4>`;
        
        overlayLayers.forEach(item => {
            const div = L.DomUtil.create("div", "overlay-item", overlaySection);
            div.innerHTML = `
                <label>
                    <input type="checkbox" class="overlay-checkbox">
                    <i class="${item.icon} overlay-icon" ></i>
                    <span class="overlay-name">${item.name}</span>
                </label>
            `;
            const checkbox = div.querySelector(".overlay-checkbox");

            if (map.hasLayer(item.layer)) {
                checkbox.checked = true;
                div.classList.add("active");
            }

            L.DomEvent.on(checkbox, "change", function () {
                if (this.checked) { 
                    map.addLayer(item.layer);
                    div.classList.add("active");
                } else {
                    map.removeLayer(item.layer);
                    div.classList.remove("active"); 
                }
            });
        });
        
        return wrapper;
    },    
});

map.addControl(new CombinedLayerControl({ position: "bottomleft"} ));
 

// marker
const faIcon = L.divIcon({
  html: `
    <i class="fa-solid fa-location-dot " 
       style="
         color: rgb(18, 199, 57);
         font-size: 32px;
       ">
    </i>
  `,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28]
});
const marker = L.marker([lat , log] , {icon: faIcon}).addTo(map);
marker.bindPopup('<b>273 Điện Biên Phủ , Phường Xuân Hòa , <br> Thành Phố Hồ chí Minh.</b>');
marker.on('click' , function() {
  map.setView([lat, log ] , 17 , {animate: true})
});

