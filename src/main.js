import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

//  API
const CONFIG_KEY = 'hcm'; 
const API_URL = `https://mapsystem.onrender.com/api/config/${CONFIG_KEY}`;

async function initApp() {
  try {
    console.log("Đang tải config...");
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Không tải được cấu hình bản đồ!");
    
    const config = await response.json();
    console.log("Config loaded:", config);

    if(config.title) document.title = config.title;

    //  Cập nhật Header
    const titleEl = document.getElementById('app-title');
    if (titleEl && config.title) {
        titleEl.innerText = config.title.toUpperCase(); 
    }

    const logoEl = document.getElementById('app-logo');
    if (logoEl && config.logoUrl) {
        logoEl.src = config.logoUrl;
        logoEl.classList.remove('hidden'); 
         
    }

    // Cập nhật Footer Title
    
    const footerTitle = document.getElementById('footer-title');
    if (footerTitle && config.title) {
        footerTitle.innerText = config.title.toUpperCase();
    }

    const footerLogo = document.getElementById('app-logo1');
    if (footerLogo && config.logoUrl) {
        footerLogo.src = config.logoUrl;
        footerLogo.classList.remove('hidden');

    }
    


    const map = L.map('map').setView(config.center, config.zoom);

    const baseLayersData = config.baseLayers.map(item => ({
      name: item.name,
      img: item.thumbnailUrl,
      layer: L.tileLayer(item.layerUrl, {
        maxZoom: 20,
        attribution: '&copy; OpenStreetMap contributors'
      })
    }));

    if (baseLayersData.length > 0) {
      baseLayersData[0].layer.addTo(map);
    }

    const overlayLayersData = config.overlays.map(item => ({
      name: item.name,
      iconUrl: item.iconUrl, 
      active: item.active,
      layer: L.tileLayer.wms(item.wmsUrl, {
        layers: item.layers,
        format: "image/png",
        transparent: true,
        attribution: item.name,
        zIndex: 100
      })
    }));

    overlayLayersData.forEach(item => {
      if (item.active) item.layer.addTo(map);
    });

    
    const CombinedLayerControl = L.Control.extend({
      onAdd: function () {
        const wrapper = L.DomUtil.create("div", "combined-layer-control-wrapper");
        const toggleButton = L.DomUtil.create("div", "custom-layer-toggle", wrapper);
        toggleButton.innerHTML = `<div><i class="fa-solid fa-layer-group"></i></div>`;
        
        const panelContainer = L.DomUtil.create("div", "combined-layer-control", wrapper);
        L.DomEvent.disableClickPropagation(wrapper);

        // Base Layers
        const baseSection = L.DomUtil.create("div", "base-section", panelContainer);
        const titleBlock = L.DomUtil.create("div", "base-title", baseSection);
        titleBlock.innerHTML = `<h4>Lớp nền bản đồ</h4>`;
        const itemsContainer = L.DomUtil.create("div", "base-items-list", baseSection);
        
        baseLayersData.forEach((item) => {
            const div = L.DomUtil.create("div", "base-item", itemsContainer);
            div.innerHTML = `
                <img src="${item.img}" class="base-thumb" alt="${item.name}">
                <div class="base-name">${item.name}</div>
            `;
            
            if (map.hasLayer(item.layer)) {
                div.classList.add("selected");
            }

            L.DomEvent.on(div, "click", () => {
                baseLayersData.forEach(i => map.removeLayer(i.layer));
                map.addLayer(item.layer);
                item.layer.bringToBack();
                const allItems = itemsContainer.querySelectorAll(".base-item");
                allItems.forEach(el => el.classList.remove("selected"));
                div.classList.add("selected");
            });
        });
        
        // Overlays
        const overlaySection = L.DomUtil.create("div", "overlay-section", panelContainer);
        overlaySection.innerHTML = `<h4>Lớp dữ liệu</h4>`;
        overlayLayersData.forEach(item => {
            const div = L.DomUtil.create("div", "overlay-item", overlaySection);
            div.innerHTML = `
                <label>
                    <input type="checkbox" class="overlay-checkbox">
                    <img src="${item.iconUrl}" class="overlay-icon" style="width: 20px; height: 20px; object-fit: contain; margin-right: 5px;">
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

    // Marker
    const faIcon = L.divIcon({
      html: `
        <i class="fa-solid fa-location-dot" style="color: rgb(18, 199, 57); font-size: 32px;"></i>
      `,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -28]
    });

    const marker = L.marker(config.center, {icon: faIcon}).addTo(map);
    marker.bindPopup(`<b>273 Điện Biên Phủ  Phường Xuân Hòa TP.HCM</b><br>${config.center}`);
    marker.on('click' , function() {
      map.setView(config.center, 17, {animate: true})
    });

  } catch (error) {
    console.error("Lỗi khởi tạo ứng dụng:", error);
    alert("Không thể tải bản đồ. Vui lòng kiểm tra API Key ");
  }
}

initApp();