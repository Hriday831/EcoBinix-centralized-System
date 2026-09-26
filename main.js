const BIN_TELEMETRY_SEED = [
      {
        id: "SGM-DEL-0102",
        battery: 100,
        lastUpdate: "Just now",
        streams: { plastic: 90, paper: 92, metal: 98, reject: 95 },
      },
      {
        id: "SGM-DEL-0103",
        battery: 92,
        lastUpdate: "2 mins ago",
        streams: { plastic: 90, paper: 92, metal: 98, reject: 95 },
      },
      {
        id: "SGM-DEL-0104",
        battery: 16,
        lastUpdate: "5 mins ago",
        streams: { plastic: 80, paper: 30, metal: 25, reject: 2 }
      },
      {
        id: "SGM-DEL-0105",
        battery: 72,
        lastUpdate: "6 mins ago",
        streams: { plastic: 85, paper: 95, metal: 80, reject: 92 }
      },
      {
        id: "SGM-DEL-0106",
        battery: 64,
        lastUpdate: "10 mins ago",
        streams: { plastic: 10, paper: 50, metal: 15, reject: 5 }
      },
      {
        id: "SGM-DEL-0107",
        battery: 88,
        lastUpdate: "12 mins ago",
        streams: { plastic: 8, paper: 30, metal: 40, reject: 1 }
      },
      {
        id: "SGM-DEL-0108",
        battery: 81,
        lastUpdate: "15 mins ago",
        streams: { plastic: 8, paper: 40, metal: 28, reject: 1 }
      },
      {
        id: "SGM-DEL-0109",
        battery: 45,
        lastUpdate: "18 mins ago",
        streams: { plastic: 8, paper: 35, metal: 25, reject: 2 }
      },
      {
        id: "SGM-DEL-0110",
        battery: 94,
        lastUpdate: "22 mins ago",
        streams: { plastic: 8, paper: 40, metal: 25, reject: 1 }
      }
    ];

    const BIN_TELEMETRY_DATA = BIN_TELEMETRY_SEED.map(telemetry => ({ ...telemetry }));

    const MACHINE_DATA = [
      { id: "SGM-DEL-0102", location: "Connaught Place - Inner Circle", city: "New Delhi, Delhi", lat: 28.6315, lng: 77.2167, status: "active" },
      { id: "SGM-DEL-0103", location: "India Gate Central", city: "New Delhi, Delhi", lat: 28.6129, lng: 77.2295, status: "active" },
      { id: "SGM-DEL-0104", location: "Chandni Chowk Market", city: "Old Delhi, Delhi", lat: 28.6560, lng: 77.2300, status: "active" },
      { id: "SGM-DEL-0105", location: "Saket Select Citywalk", city: "South Delhi, Delhi", lat: 28.5284, lng: 77.2190, status: "active" },
      { id: "SGM-DEL-0106", location: "West Delhi Gateway", city: "West Delhi, Delhi", lat: 28.6650, lng: 77.1000, status: "inactive" },
      { id: "SGM-DEL-0107", location: "Indira Gandhi Int Airport T3", city: "South West Delhi", lat: 28.5562, lng: 77.0999, status: "active" },
      { id: "SGM-DEL-0108", location: "Ghaziabad Sector 12 Hub", city: "Ghaziabad, UP", lat: 28.6692, lng: 77.4538, status: "active" },
      { id: "SGM-DEL-0109", location: "Noida Expressway Hub", city: "Noida, UP", lat: 28.5355, lng: 77.3910, status: "active" },
      { id: "SGM-DEL-0110", location: "Delhi Cantonment Station", city: "New Delhi, Delhi", lat: 28.5950, lng: 77.1250, status: "active" },
      { id: "SGM-DEL-0101", location: "Karol Bagh Metro Junction", city: "Central Delhi, Delhi", lat: 28.6517, lng: 77.1906, status: "active" }
    ];

    function calculateFill(streams) {
      const values = Object.values(streams);
      return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
    }

    function calculateFillStatus(fill) {
      if (fill < 70) return 'Normal';
      if (fill <= 85) return 'Warning';
      return 'Critical';
    }

    function buildBinsData() {
      return BIN_TELEMETRY_DATA.map(telemetry => {
        const machine = MACHINE_DATA.find(item => item.id === telemetry.id);
        const streams = telemetry.streams;
        const fill = calculateFill(streams);
        return {
          id: telemetry.id,
          battery: telemetry.battery,
          lastUpdate: telemetry.lastUpdate,
          streams,
          location: machine.location,
          city: machine.city,
          lat: machine.lat,
          lng: machine.lng,
          fill,
          status: calculateFillStatus(fill),
          machineStatus: machine.status
        };
      });
    }

    let BINS_DATA = buildBinsData();
    const ACTIVE_ROUTES = [
      { id: 'R-DEL-409', title: 'Central & East Corridor', truck: 'Truck #04', status: 'Active', binIds: ['SGM-DEL-0104', 'SGM-DEL-0106', 'SGM-DEL-0109', 'SGM-DEL-0105'] },
      { id: 'R-DEL-412', title: 'Central Delhi Priority Run', truck: 'Truck #02', status: 'Active', binIds: ['SGM-DEL-0102', 'SGM-DEL-0103', 'SGM-DEL-0107'] },
      { id: 'R-DEL-415', title: 'Noida & Ghaziabad Circuit', truck: 'Truck #07', status: 'Active', binIds: ['SGM-DEL-0108', 'SGM-DEL-0109', 'SGM-DEL-0106'] }
    ];
    let selectedRouteId = ACTIVE_ROUTES[0].id;
    window['readyTo-Dispatch'] = [];
    const readyToDispatch = window['readyTo-Dispatch'];
    let alertDetailMap, quickDispatchMap;

    const COLLECTORS_DATA = [
      { name: "Arjun Mehta", license: "DL-0420180098765", vehicle: "DL 01 AB 4821", phone: "+91 98765 21045", status: "On Route", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80" },
      { name: "Priya Sharma", license: "DL-0720210043210", vehicle: "DL 02 CD 7614", phone: "+91 98110 45872", status: "Available", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80" },
      { name: "Rakesh Kumar", license: "DL-0320190076543", vehicle: "DL 03 EF 1958", phone: "+91 98991 67321", status: "On Route", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80" },
      { name: "Neha Verma", license: "DL-0620220019274", vehicle: "DL 04 GH 9086", phone: "+91 97654 11209", status: "Off Duty", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&q=80" }
    ];

    function getUserLevel(points) {
      if (points < 100) return 'First Sorter';
      if (points < 200) return 'Perfect Sorter';
      if (points < 400) return 'Community Hero';
      if (points < 700) return 'Eco Warrior';
      return 'City Legend';
    }

    const GREEN_POINTS_DISTRICTS = ['Darjeeling', 'Kolkata', 'Howrah', 'Hooghly', 'Nadia', 'Jalpaiguri', 'Siliguri', 'Murshidabad', 'Durgapur', 'Asansol', 'North 24 Parganas', 'South 24 Parganas', 'Bardhaman', 'Malda', 'Bankura', 'Delhi', 'Pune', 'Bengaluru', 'Guwahati', 'Bhubaneswar'];
    const GREEN_POINTS_BASE_POINTS = [85, 135, 185, 245, 335, 455, 585, 735];
    const user = Array.from({ length: 150 }, (_, index) => {
      const points = index % 10 === 0 ? 50 : GREEN_POINTS_BASE_POINTS[index % GREEN_POINTS_BASE_POINTS.length];
      return { district: GREEN_POINTS_DISTRICTS[index % GREEN_POINTS_DISTRICTS.length], email: `user${String(index + 1).padStart(3, '0')}@gmail.com`, points, wasteWeight: Number((6.5 + ((index * 1.7) % 29) + (index % 4) * 0.35).toFixed(1)), level: getUserLevel(points) };
    });
    const GREEN_POINTS_LEVEL_ORDER = ['First Sorter', 'Perfect Sorter', 'Community Hero', 'Eco Warrior', 'City Legend'];

    function getGreenPointsLevelBadge(level) {
      const badgeClasses = { 'First Sorter': 'bg-slate-100 text-slate-600', 'Perfect Sorter': 'bg-blue-100 text-blue-700', 'Community Hero': 'bg-emerald-100 text-emerald-700', 'Eco Warrior': 'bg-purple-100 text-purple-700', 'City Legend': 'bg-amber-100 text-amber-700' };
      return `<span class="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-extrabold ${badgeClasses[level]}">${level}</span>`;
    }

    function updateGreenPointsSummary() {
      const totalUsers = user.length;
      const averagePoints = user.reduce((sum, currentUser) => sum + currentUser.points, 0) / totalUsers;
      const averageWasteWeight = user.reduce((sum, currentUser) => sum + currentUser.wasteWeight, 0) / totalUsers;
      const levelCounts = user.reduce((counts, currentUser) => {
        counts[currentUser.level] += 1;
        return counts;
      }, Object.fromEntries(GREEN_POINTS_LEVEL_ORDER.map(level => [level, 0])));

      document.getElementById('green-points-total-users').innerText = totalUsers;
      document.getElementById('green-points-average-points').innerText = averagePoints.toFixed(1);
      document.getElementById('green-points-average-waste').innerText = `${averageWasteWeight.toFixed(1)} kg`;
      document.getElementById('green-count-first-sorter').innerText = levelCounts['First Sorter'];
      document.getElementById('green-count-perfect-sorter').innerText = levelCounts['Perfect Sorter'];
      document.getElementById('green-count-community-hero').innerText = levelCounts['Community Hero'];
      document.getElementById('green-count-eco-warrior').innerText = levelCounts['Eco Warrior'];
      document.getElementById('green-count-city-legend').innerText = levelCounts['City Legend'];
    }

    function getFilteredGreenPointsUsers() {
      const search = document.getElementById('green-points-search').value.trim().toLowerCase();
      const district = document.getElementById('green-points-district').value;
      const level = document.getElementById('green-points-level').value;
      const sort = document.getElementById('green-points-sort').value;
      const filteredUsers = user.filter(currentUser => (!search || currentUser.email.toLowerCase().includes(search)) && (!district || currentUser.district === district) && (!level || currentUser.level === level));
      if (sort) {
        const [field, direction] = sort.split('-');
        filteredUsers.sort((firstUser, secondUser) => { const firstValue = field === 'points' ? firstUser.points : firstUser.wasteWeight; const secondValue = field === 'points' ? secondUser.points : secondUser.wasteWeight; return direction === 'asc' ? firstValue - secondValue : secondValue - firstValue; });
      }
      return filteredUsers;
    }

    function updateGreenPointsTable() {
      const filteredUsers = getFilteredGreenPointsUsers();
      document.getElementById('green-points-table-body').innerHTML = filteredUsers.map((currentUser, index) => { const isFiftyPointGainer = currentUser.points === 50; return `<tr class="${isFiftyPointGainer ? 'bg-emerald-50/80 border-l-4 border-emerald-500' : 'hover:bg-slate-50/80'} transition"><td class="py-3 px-4 font-bold text-slate-500">${index + 1}</td><td class="py-3 px-4 font-bold text-slate-800">${currentUser.district}</td><td class="py-3 px-4 text-slate-600">${currentUser.email}</td><td class="py-3 px-4 font-extrabold text-brand-700">${currentUser.points} ${isFiftyPointGainer ? '<span class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px]">+50 Points</span>' : ''}</td><td class="py-3 px-4">${getGreenPointsLevelBadge(currentUser.level)}</td><td class="py-3 px-4 font-semibold text-slate-700">${currentUser.wasteWeight.toFixed(1)} kg</td></tr>`; }).join('') || '<tr><td colspan="6" class="py-8 text-center text-slate-400">No users match the selected filters.</td></tr>';
    }

    function initializeGreenPoints() {
      const districtSelect = document.getElementById('green-points-district');
      [...new Set(user.map(currentUser => currentUser.district))].sort().forEach(district => districtSelect.insertAdjacentHTML('beforeend', `<option value="${district}">${district}</option>`));
      const levelSelect = document.getElementById('green-points-level');
      GREEN_POINTS_LEVEL_ORDER.forEach(level => levelSelect.insertAdjacentHTML('beforeend', `<option value="${level}">${level}</option>`));
      updateGreenPointsSummary();
      updateGreenPointsTable(true);
    }

    let currentSelectedBin = BINS_DATA[0];
    let dashboardMap, fullScreenMap, routePreviewMap;
    let dashboardMapLayers = {};
    let dashboardMarkers = [];
    let compositionChartInstance = null;

    function updateDashboardMetrics() {
      const criticalBins = BINS_DATA.filter(bin => bin.status === 'Critical');
      const averageFill = BINS_DATA.length
        ? Math.round(BINS_DATA.reduce((total, bin) => total + bin.fill, 0) / BINS_DATA.length)
        : 0;

      document.getElementById('total-machine').innerText = BINS_DATA.length;
      document.getElementById('active-alerts').innerText = criticalBins.length;
      document.getElementById('average-fill-level').innerText = `${averageFill}%`;
      document.getElementById('dashboard-total-users').innerText = user.length;
      document.getElementById('dashboard-total-collector-vans').innerText = COLLECTORS_DATA.length;
      document.getElementById('sidebar-alert-count').innerText = criticalBins.length;
      document.getElementById('notification-alert-count').innerText = criticalBins.length;
      document.getElementById('alert-summary-count').innerText = `${criticalBins.length} Critical Machine${criticalBins.length === 1 ? '' : 's'}`;
    }

    // Initialize Application on DOM ready
    window.addEventListener('DOMContentLoaded', () => {
      updateDashboardMetrics();
      renderFleetOverviewTable(BINS_DATA);
      renderMachinesGrid(BINS_DATA);
      renderCollectorsGrid();
      renderAlertsList();
      initializeGreenPoints();
      initLeafletDashboardMap();
      initMiniCharts();
      initCompositionDonutChart();
    });

    // Toggle navigation views
    function switchView(viewName) {
      const views = ['dashboard', 'machines', 'analytics', 'alerts', 'routes', 'collectors', 'green-points'];
      views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        const navEl = document.getElementById(`nav-${v}`);
        if (el) el.classList.add('hidden');
        if (navEl) navEl.classList.remove('active');
      });

      const targetView = document.getElementById(`view-${viewName}`);
      const targetNav = document.getElementById(`nav-${viewName}`);
      if (targetView) targetView.classList.remove('hidden');
      if (targetNav) targetNav.classList.add('active');

      // Trigger map resize if map views opened
      if (viewName === 'routes') {
        renderActiveRoutes();
        setTimeout(initRoutePreviewMap, 100);
      } else if (viewName === 'analytics') {
        setTimeout(initAnalyticsCharts, 100);
      } else if (viewName === 'dashboard') {
        setTimeout(() => { if (dashboardMap) dashboardMap.invalidateSize(); }, 200);
      } else if (viewName === 'green-points') {
        updateGreenPointsSummary();
        updateGreenPointsTable(true);
      }
    }

    // Toggle Sidebar on mobile
    function toggleSidebar() {
      const sb = document.getElementById('sidebar');
      sb.classList.toggle('-ml-64');
    }

    // Render Fleet Overview Table
    function renderFleetOverviewTable(data) {
      const tbody = document.getElementById('fleetTableBody');
      tbody.innerHTML = '';

      data.forEach(bin => {
        let statusBadge = '';
        let barColor = 'bg-emerald-500';

        if (bin.status === 'Critical') {
          statusBadge = '<span class="flex items-center gap-1.5 text-rose-600 font-bold"><span class="w-2 h-2 rounded-full bg-rose-500"></span> Critical</span>';
          barColor = 'bg-rose-500';
        } else if (bin.status === 'Warning') {
          statusBadge = '<span class="flex items-center gap-1.5 text-amber-600 font-bold"><span class="w-2 h-2 rounded-full bg-amber-500"></span> Warning</span>';
          barColor = 'bg-amber-500';
        } else {
          statusBadge = '<span class="flex items-center gap-1.5 text-emerald-600 font-bold"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Normal</span>';
          barColor = 'bg-emerald-500';
        }

        const tr = document.createElement('tr');
        tr.className = `hover:bg-slate-50/80 transition cursor-pointer ${currentSelectedBin.id === bin.id ? 'bg-emerald-50/40' : ''}`;
        tr.onclick = (e) => {
          if (!e.target.matches('input[type="checkbox"]')) {
            selectDustbin(bin.id);
          }
        };

        tr.innerHTML = `
          <td class="py-3 px-3"><input type="checkbox" class="bin-row-checkbox rounded text-brand-600 focus:ring-brand-500"></td>
          <td class="py-3 px-3 font-bold text-slate-900">${bin.id}</td>
          <td class="py-3 px-3 text-slate-600 truncate max-w-[180px]">${bin.location}</td>
          <td class="py-3 px-3">
            <div class="flex items-center gap-2">
              <span class="w-8 font-bold text-slate-800">${bin.fill}%</span>
              <div class="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div class="${barColor} h-full rounded-full" style="width: ${bin.fill}%"></div>
              </div>
            </div>
          </td>
          <td class="py-3 px-3">
            <div class="flex items-center gap-1.5">
              <i class="fa-solid fa-battery-three-quarters ${bin.battery < 25 ? 'text-rose-500' : 'text-emerald-500'}"></i>
              <span>${bin.battery}%</span>
            </div>
          </td>
          <td class="py-3 px-3">${statusBadge}</td>
          <td class="py-3 px-3 text-slate-400 font-normal">${bin.lastUpdate}</td>
          <td class="py-3 px-3 text-right">
            <button onclick="selectDustbin('${bin.id}')" class="px-3 py-1 rounded-lg text-brand-700 bg-brand-50 hover:bg-brand-100 text-xs font-extrabold transition">
              View
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Select dustbin and update detail inspector panel
    function selectDustbin(binId) {
      const bin = BINS_DATA.find(b => b.id === binId);
      if (!bin) return;
      currentSelectedBin = bin;

      // Update right panel details
      document.getElementById('panelBinId').innerText = bin.id;
      document.getElementById('panelBinLocation').innerHTML = `<i class="fa-solid fa-location-dot text-brand-700 text-[10px]"></i> ${bin.location}`;
      document.getElementById('panelDonutBinTag').innerText = bin.id;
      document.getElementById('panelLastPingVal').innerText = bin.lastUpdate;

      const badge = document.getElementById('panelBinBadge');
      if (bin.status === 'Critical') {
        badge.innerText = 'CRITICAL';
        badge.className = 'text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700';
      } else if (bin.status === 'Warning') {
        badge.innerText = 'WARNING';
        badge.className = 'text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-700';
      } else {
        badge.innerText = 'NORMAL';
        badge.className = 'text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700';
      }

      // Update bars
      document.getElementById('panelBatteryVal').innerText = bin.battery + '%';
      document.getElementById('panelBatteryBar').style.width = bin.battery + '%';

      document.getElementById('panelLiquidVal').innerText = bin.streams.paper + '%';
      document.getElementById('panelLiquidBar').style.width = bin.streams.paper + '%';

      document.getElementById('panelBioVal').innerText = bin.streams.paper + '%';
      document.getElementById('panelBioBar').style.width = bin.streams.paper + '%';

      document.getElementById('panelDryVal').innerText = bin.streams.metal + '%';
      document.getElementById('panelDryBar').style.width = bin.streams.metal + '%';

      document.getElementById('panelPlasticVal').innerText = bin.streams.plastic + '%';
      document.getElementById('panelPlasticBar').style.width = bin.streams.plastic + '%';

      document.getElementById('panelHazardVal').innerText = bin.streams.reject + '%';
      document.getElementById('panelHazardBar').style.width = bin.streams.reject + '%';

      // Re-center map with animation
      if (dashboardMap) {
        dashboardMap.flyTo([bin.lat, bin.lng], 13, { duration: 1.2 });
      }

      renderFleetOverviewTable(BINS_DATA);
    }

    function resetSelectedBin() {
      selectDustbin(BINS_DATA[0].id);
    }

    // Detail Panel Segmented Tabs
    function setDetailTab(tabKey) {
      ['status', 'details', 'live'].forEach(k => {
        document.getElementById(`tab-${k}`).classList.remove('active');
        document.getElementById(`tabContent-${k}`).classList.add('hidden');
      });
      document.getElementById(`tab-${tabKey}`).classList.add('active');
      document.getElementById(`tabContent-${tabKey}`).classList.remove('hidden');
    }

    // Global Search
    function handleGlobalSearch(term) {
      const q = term.toLowerCase().trim();
      const filtered = BINS_DATA.filter(b => 
        b.id.toLowerCase().includes(q) || 
        b.location.toLowerCase().includes(q) || 
        b.city.toLowerCase().includes(q)
      );
      renderFleetOverviewTable(filtered);
    }

    // Table Filter Dropdown Menu Toggle
    function toggleTableFilterMenu() {
      document.getElementById('tableFilterDropdown').classList.toggle('hidden');
    }

    function filterOverviewTable(type) {
      document.getElementById('tableFilterDropdown').classList.add('hidden');
      if (type === 'critical') {
        renderFleetOverviewTable(BINS_DATA.filter(b => b.status === 'Critical'));
      } else if (type === 'warning') {
        renderFleetOverviewTable(BINS_DATA.filter(b => b.status === 'Warning'));
      } else if (type === 'normal') {
        renderFleetOverviewTable(BINS_DATA.filter(b => b.status === 'Normal'));
      } else {
        renderFleetOverviewTable(BINS_DATA);
      }
    }

    function toggleSelectAllBins(checked) {
      document.querySelectorAll('.bin-row-checkbox').forEach(cb => cb.checked = checked);
    }

    // Leaflet Dashboard Map Initialization
    function initLeafletDashboardMap() {
      if (dashboardMap) return;

      const mapElement = document.getElementById('dashboard-leaflet-map');
      if (!mapElement) return;
      if (typeof L === 'undefined') {
        mapElement.innerHTML = '<div class="map-unavailable"><i class="fa-solid fa-map-location-dot text-3xl"></i><span>Map service is unavailable. Check your internet connection.</span></div>';
        return;
      }

      // Delhi coordinates
      dashboardMap = L.map('dashboard-leaflet-map', {
        zoomControl: false,
        attributionControl: false
      }).setView([28.6139, 77.2090], 11);

      dashboardMapLayers.standard = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(dashboardMap);
      dashboardMapLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri'
      });

      // Add Custom Zoom Control bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(dashboardMap);

      // Add markers matching reference
      BINS_DATA.forEach(bin => {
        let colorClass = 'marker-green';
        if (bin.status === 'Critical') colorClass = 'marker-red marker-critical';
        else if (bin.status === 'Warning') colorClass = 'marker-yellow';

        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="bin-marker ${colorClass} w-7 h-7" onclick="selectDustbin('${bin.id}')">${bin.fill}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([bin.lat, bin.lng], { icon: customIcon }).addTo(dashboardMap);
        marker.bindPopup(`<b>${bin.id}</b><br>${bin.location}<br>Fill: <b>${bin.fill}%</b>`);
        dashboardMarkers.push(marker);
      });
    }

    function setMapLayer(type) {
      if (!dashboardMap) return;
      Object.entries(dashboardMapLayers).forEach(([layerType, layer]) => {
        if (layerType === type) dashboardMap.addLayer(layer);
        else if (dashboardMap.hasLayer(layer)) dashboardMap.removeLayer(layer);
      });
      document.getElementById('mapBtnLayerMap').className = type === 'standard' 
        ? 'px-3.5 py-1 text-xs font-bold rounded-lg bg-slate-900 text-white shadow-sm transition' 
        : 'px-3.5 py-1 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition';

      document.getElementById('mapBtnLayerSat').className = type === 'satellite' 
        ? 'px-3.5 py-1 text-xs font-bold rounded-lg bg-slate-900 text-white shadow-sm transition' 
        : 'px-3.5 py-1 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition';
    }

    function filterMapZone(zone) {
      if (!dashboardMap) return;
      if (zone === 'central') dashboardMap.flyTo([28.6315, 77.2167], 13);
      else if (zone === 'south') dashboardMap.flyTo([28.5284, 77.2190], 13);
      else if (zone === 'noida') dashboardMap.flyTo([28.5355, 77.3910], 12);
      else dashboardMap.flyTo([28.6139, 77.2090], 11);
    }

    function toggleMapFullscreen() {
      const mapCard = document.getElementById('dashboard-map-card');
      if (!mapCard) return;
      mapCard.classList.toggle('map-fullscreen');
      setTimeout(() => {
        if (dashboardMap) dashboardMap.invalidateSize();
      }, 150);
    }

    function renderActiveRoutes() {
      const routesList = document.getElementById('activeRoutesList');
      if (!routesList) return;
      const selectedRoute = ACTIVE_ROUTES.find(route => route.id === selectedRouteId) || ACTIVE_ROUTES[0];
      selectedRouteId = selectedRoute.id;
      routesList.innerHTML = ACTIVE_ROUTES.map(route => {
        const routeBins = route.binIds.map(binId => BINS_DATA.find(bin => bin.id === binId)).filter(Boolean);
        const isSelected = route.id === selectedRouteId;
        return `<button onclick="selectActiveRoute('${route.id}')" class="w-full text-left p-3 rounded-xl border ${isSelected ? 'border-brand-500 bg-brand-50/70' : 'border-slate-200 bg-slate-50 hover:border-brand-300'} transition">
          <div class="flex items-center justify-between gap-2"><span class="text-xs font-extrabold text-slate-900">${route.title}</span><span class="text-[10px] font-extrabold ${route.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'}">${route.status}</span></div>
          <div class="flex items-center justify-between mt-1 text-[10px] text-slate-500"><span>#${route.id} · ${route.truck}</span><span>${routeBins.length} stops</span></div>
        </button>`;
      }).join('');

      document.getElementById('selected-route-code').innerText = `ACTIVE DISPATCH #${selectedRoute.id}`;
      document.getElementById('selected-route-title').innerText = selectedRoute.title;
      document.getElementById('selected-route-truck').innerText = selectedRoute.truck;
      const routeStops = document.getElementById('routeStopsList');
      const routeBins = selectedRoute.binIds.map(binId => BINS_DATA.find(bin => bin.id === binId)).filter(Boolean);
      routeStops.innerHTML = routeBins.map((bin, index) => {
        const fillColor = bin.status === 'Critical' ? 'text-rose-600' : (bin.status === 'Warning' ? 'text-amber-600' : 'text-emerald-600');
        return `<div class="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"><div class="w-6 h-6 rounded-full bg-brand-700 text-white font-extrabold flex items-center justify-center shrink-0">${index + 1}</div><div class="flex-1"><div class="flex justify-between items-center"><span class="font-bold text-slate-800">${bin.location}</span><span class="${fillColor} font-extrabold">${bin.fill}% Fill</span></div><p class="text-[11px] text-slate-400">Dustbin ID: ${bin.id} • ${bin.status}</p></div></div>`;
      }).join('') || '<p class="text-xs text-slate-400">No machines are assigned to this route.</p>';
    }

    function selectActiveRoute(routeId) {
      if (!ACTIVE_ROUTES.some(route => route.id === routeId)) return;
      selectedRouteId = routeId;
      renderActiveRoutes();
      setTimeout(initRoutePreviewMap, 100);
    }

    // Full Screen Cockpit Map
    function initFullScreenMap() {
      if (typeof L === 'undefined' || !document.getElementById('full-screen-leaflet-map')) return;
      if (fullScreenMap) {
        fullScreenMap.invalidateSize();
        return;
      }
      fullScreenMap = L.map('full-screen-leaflet-map', {
        attributionControl: false
      }).setView([28.6139, 77.2090], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(fullScreenMap);

      BINS_DATA.forEach(bin => {
        let colorClass = bin.status === 'Critical' ? 'marker-red marker-critical' : (bin.status === 'Warning' ? 'marker-yellow' : 'marker-green');
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="bin-marker ${colorClass} w-8 h-8">${bin.fill}%</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        L.marker([bin.lat, bin.lng], { icon: customIcon })
          .addTo(fullScreenMap)
          .bindPopup(`<b>${bin.id}</b><br>${bin.location}<br>Battery: ${bin.battery}% | Fill: ${bin.fill}%`);
      });

      // Add Collection Route Polyline
      const latlngs = [
        [28.6560, 77.2300],
        [28.6650, 77.1000],
        [28.5355, 77.3910],
        [28.5284, 77.2190]
      ];
      L.polyline(latlngs, { color: '#059669', weight: 4, opacity: 0.8, dashArray: '8, 8' }).addTo(fullScreenMap);
    }

    // Route Preview Map
    function initRoutePreviewMap() {
      if (typeof L === 'undefined' || !document.getElementById('route-preview-leaflet-map')) return;
      if (routePreviewMap) {
        routePreviewMap.remove();
        routePreviewMap = null;
      }
      const selectedRoute = ACTIVE_ROUTES.find(route => route.id === selectedRouteId) || ACTIVE_ROUTES[0];
      const routeBins = selectedRoute.binIds.map(binId => BINS_DATA.find(bin => bin.id === binId)).filter(Boolean);
      if (!routeBins.length) return;
      const stops = routeBins.map(bin => [bin.lat, bin.lng]);
      routePreviewMap = L.map('route-preview-leaflet-map', {
        attributionControl: false
      }).fitBounds(stops, { padding: [25, 25] });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(routePreviewMap);

      L.polyline(stops, { color: '#047857', weight: 5, opacity: 0.9 }).addTo(routePreviewMap);

      routeBins.forEach((bin, idx) => {
        const numIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="w-6 h-6 rounded-full bg-brand-700 text-white font-extrabold flex items-center justify-center text-xs shadow-lg border-2 border-white">${idx + 1}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        L.marker([bin.lat, bin.lng], { icon: numIcon }).addTo(routePreviewMap).bindPopup(`<b>${idx + 1}. ${bin.id}</b><br>${bin.location}<br>Fill: <b>${bin.fill}%</b>`);
      });
    }

    // Mini Dashboard Charts Initialization
    function initMiniCharts() {
      if (typeof Chart === 'undefined') return;
      // Fleet Health Mini Bar Chart
      const ctxHealth = document.getElementById('fleetHealthMiniChart').getContext('2d');
      new Chart(ctxHealth, {
        type: 'bar',
        data: {
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          datasets: [{
            data: [75, 90, 85, 95, 60, 80, 88, 92, 70, 85],
            backgroundColor: ['#10b981', '#10b981', '#f59e0b', '#10b981', '#ef4444', '#10b981', '#10b981', '#10b981', '#f59e0b', '#10b981'],
            borderRadius: 4,
            barThickness: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: false, min: 0, max: 100 }
          }
        }
      });

      // Peak Fill Mini Bar Chart
      const ctxPeak = document.getElementById('peakFillMiniChart').getContext('2d');
      new Chart(ctxPeak, {
        type: 'bar',
        data: {
          labels: ['0102', '0103', '0104', '0105', '0106', '0107', '0108', '0109', '0110'],
          datasets: [{
            data: [20, 66, 100, 72, 97, 39, 48, 88, 54],
            backgroundColor: (context) => {
              const val = context.raw;
              if (val > 85) return '#ef4444';
              if (val >= 70) return '#f59e0b';
              return '#10b981';
            },
            borderRadius: 3,
            barThickness: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 9, weight: 'bold' }, color: '#94a3b8' }
            },
            y: {
              grid: { color: '#f1f5f9' },
              ticks: { font: { size: 9 }, color: '#94a3b8', stepSize: 50 },
              min: 0,
              max: 100
            }
          }
        }
      });
    }

    // Donut Chart for Waste Composition in Detail Inspector
    function initCompositionDonutChart() {
      if (typeof Chart === 'undefined') return;
      const ctx = document.getElementById('compositionDonutChart').getContext('2d');
      compositionChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Liquid', 'Bio-Waste', 'Dry Waste', 'Plastics', 'Extra'],
          datasets: [{
            data: [30, 32, 18, 20, 5],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'],
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: { legend: { display: false }, tooltip: { enabled: true } }
        }
      });
    }

    // Analytics View Charts
    function initAnalyticsCharts() {
      if (typeof Chart === 'undefined') return;
      const ctxTrend = document.getElementById('analyticsTrendChart');
      if (ctxTrend && !ctxTrend.chartInstance) {
        ctxTrend.chartInstance = new Chart(ctxTrend.getContext('2d'), {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                label: 'Bio-Waste',
                data: [12, 19, 15, 22, 28, 24, 30],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
              },
              {
                label: 'Dry & Plastics',
                data: [8, 12, 11, 14, 18, 16, 20],
                borderColor: '#f59e0b',
                backgroundColor: 'transparent',
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } }
          }
        });
      }

      const ctxPeak = document.getElementById('analyticsPeakChart');
      if (ctxPeak && !ctxPeak.chartInstance) {
        ctxPeak.chartInstance = new Chart(ctxPeak.getContext('2d'), {
          type: 'bar',
          data: {
            labels: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00'],
            datasets: [{
              label: 'Average Bin Fill Rate (%)',
              data: [15, 45, 68, 85, 92, 50, 20],
              backgroundColor: '#047857',
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
          }
        });
      }
    }

    function getWasteComposition(bin) {
      return bin.streams;
    }

    function openMachineDetails(binId) {
      const bin = BINS_DATA.find(item => item.id === binId);
      if (!bin) return;
      const composition = getWasteComposition(bin);
      document.getElementById('machineDetailsTitle').innerText = bin.id;
      document.getElementById('detailBinId').innerText = bin.id;
      document.getElementById('detailBinFill').innerText = `${bin.fill}% (${bin.status})`;
      document.getElementById('detailBinLocation').innerText = `${bin.location}, ${bin.city}`;
      document.getElementById('detailBinLat').innerText = bin.lat.toFixed(4);
      document.getElementById('detailBinLng').innerText = bin.lng.toFixed(4);
      document.getElementById('machineWasteComposition').innerHTML = [
        ['Plastic', composition.plastic, 'bg-purple-500'],
        ['Paper', composition.paper, 'bg-blue-500'],
        ['Metal', composition.metal, 'bg-slate-500'],
        ['Reject', composition.reject, 'bg-rose-500']
      ].map(([label, value, color]) => `
        <div class="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div class="flex items-center justify-between text-xs font-bold"><span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full ${color}"></span>${label}</span><span class="text-slate-900">${value}%</span></div>
          <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2"><div class="${color} h-full rounded-full" style="width: ${value}%"></div></div>
        </div>
      `).join('');
      document.getElementById('detailRouteButton').onclick = () => addBinToRoute(bin.id);
      document.getElementById('machineDetailsModal').classList.remove('hidden');
    }

    function closeMachineDetails() {
      document.getElementById('machineDetailsModal').classList.add('hidden');
    }

    function renderCollectorsGrid() {
      const grid = document.getElementById('collectorsGrid');
      if (!grid) return;
      grid.innerHTML = COLLECTORS_DATA.map(collector => {
        const statusClass = collector.status === 'Available'
          ? 'bg-emerald-100 text-emerald-700'
          : (collector.status === 'On Route' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600');
        return `
          <article class="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div class="h-16 bg-gradient-to-r from-brand-700 to-emerald-500 relative">
              <span class="absolute top-2 right-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${statusClass}">${collector.status}</span>
            </div>
            <div class="px-4 pb-3">
              <img src="${collector.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(collector.name)}" alt="${collector.name}" class="w-14 h-14 rounded-xl object-cover border-3 border-white shadow-md -mt-7 relative">
              <div class="mt-1.5">
                <h3 class="font-extrabold text-sm text-slate-900">${collector.name}</h3>
                <p class="text-[10px] text-slate-400 mt-0.5">Active collection crew member</p>
              </div>
              <div class="grid grid-cols-1 gap-1.5 mt-3 text-[11px]">
                <div class="flex items-center gap-2"><i class="fa-solid fa-id-card text-brand-700 w-4 text-center"></i><div><p class="text-slate-400 text-[9px]">Driving Licence ID</p><p class="font-bold text-slate-700">${collector.license}</p></div></div>
                <div class="flex items-center gap-2"><i class="fa-solid fa-truck text-brand-700 w-4 text-center"></i><div><p class="text-slate-400 text-[9px]">Vehicle Number</p><p class="font-bold text-slate-700">${collector.vehicle}</p></div></div>
                <div class="flex items-center gap-2"><i class="fa-solid fa-phone text-brand-700 w-4 text-center"></i><div><p class="text-slate-400 text-[9px]">Contact Number</p><p class="font-bold text-slate-700">${collector.phone}</p></div></div>
              </div>
              <div class="flex items-center justify-between border-t border-slate-100 mt-3 pt-2">
                <span class="text-[10px] text-slate-400"><i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i>Verified profile</span>
                <button onclick="contactCollector('${collector.phone}')" class="text-[11px] font-bold text-brand-700 hover:text-brand-900"><i class="fa-solid fa-phone mr-1"></i>Contact</button>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }

    // Render Machines Cards in Machines View
    function renderMachinesGrid(bins) {
      const grid = document.getElementById('machinesCardsGrid');
      grid.innerHTML = '';

      bins.forEach(bin => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3 hover:border-brand-500 transition group';
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-emerald-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                <i class="fa-solid fa-trash-can"></i>
              </div>
              <div>
                <h4 class="font-extrabold text-sm text-slate-900">${bin.id}</h4>
                <p class="text-[11px] text-slate-400">ECO-SensV4 Smart</p>
              </div>
            </div>
            <span class="text-[10px] font-black px-2 py-0.5 rounded-md ${bin.status === 'Critical' ? 'bg-rose-100 text-rose-700' : (bin.status === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')}">
              ${bin.status.toUpperCase()}
            </span>
          </div>

          <div class="flex items-center justify-between gap-2">
            <p class="text-xs text-slate-600 truncate"><i class="fa-solid fa-location-dot text-brand-700"></i> ${bin.location}</p>
            <span class="text-[9px] font-bold uppercase ${bin.machineStatus === 'active' ? 'text-emerald-600' : 'text-slate-400'}"><i class="fa-solid fa-circle text-[6px] mr-1"></i>${bin.machineStatus}</span>
          </div>

          <div class="space-y-1.5 pt-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-slate-500">Compactor Fill Level</span>
              <span class="${bin.status === 'Critical' ? 'text-rose-600' : (bin.status === 'Warning' ? 'text-amber-600' : 'text-slate-800')}">${bin.fill}%</span>
            </div>
            <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div class="h-full rounded-full ${bin.status === 'Critical' ? 'bg-rose-500' : (bin.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500')}" style="width: ${bin.fill}%"></div>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-semibold">
            <span class="text-slate-500 flex items-center gap-1.5"><i class="fa-solid fa-battery-half text-emerald-500"></i> ${bin.battery}%</span>
            <span class="text-slate-400 text-[11px]">${bin.lastUpdate}</span>
            <button onclick="openMachineDetails('${bin.id}')" class="text-brand-700 hover:text-brand-900 font-bold text-xs">
              Configure <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    // Render Alerts in Alerts View
    function renderAlertsList() {
      const container = document.getElementById('alertsContainer');
      const alerts = BINS_DATA
        .filter(bin => bin.status === 'Critical')
        .map(bin => ({
          id: bin.id,
          loc: bin.location,
          type: 'CRITICAL_CAPACITY',
          msg: `Bin reached ${bin.fill}% capacity. Immediate collection is required.`,
          time: bin.lastUpdate,
          icon: 'fa-triangle-exclamation text-rose-600 bg-rose-100'
        }));

      if (!alerts.length) {
        container.innerHTML = `
          <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
            <i class="fa-solid fa-circle-check text-4xl text-emerald-600 mb-2"></i>
            <h4 class="font-extrabold text-emerald-900 text-base">No Critical Machines</h4>
            <p class="text-xs text-emerald-700">All monitored machines are below the critical capacity threshold.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = alerts.map(a => `
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-start justify-between gap-4">
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.icon}">
              <i class="fa-solid ${a.icon.split(' ')[0]} text-lg"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-extrabold text-sm text-slate-900">${a.id}</span>
                <span class="text-xs text-slate-500 font-medium">• ${a.loc}</span>
                <span class="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">${a.type}</span>
              </div>
              <p class="text-xs text-slate-600 mt-1">${a.msg}</p>
              <span class="text-[10px] text-slate-400 font-medium mt-1 inline-block">${a.time}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="dismissSingleAlert(this)" class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600">Dismiss</button>
            <button id="alert-route-${a.id}" onclick="addBinToRoute('${a.id}')" class="px-3 py-1.5 rounded-lg border border-brand-200 hover:bg-brand-50 text-brand-700 text-xs font-bold">${readyToDispatch.some(bin => bin.id === a.id) ? 'Ready to Dispatch' : 'Add to Route'}</button>
            <button onclick="viewAlertNode('${a.id}')" class="px-3 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-sm">View Node</button>
          </div>
        </div>
      `).join('');
    }

    function dismissSingleAlert(btn) {
      const card = btn.closest('.bg-white');
      card.style.opacity = '0';
      setTimeout(() => card.remove(), 200);
    }

    function dismissAllAlerts() {
      document.getElementById('alertsContainer').innerHTML = `
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
          <i class="fa-solid fa-circle-check text-4xl text-emerald-600 mb-2"></i>
          <h4 class="font-extrabold text-emerald-900 text-base">All Alerts Acknowledged</h4>
          <p class="text-xs text-emerald-700">All current system exceptions have been reviewed and queued for resolution.</p>
        </div>
      `;
    }

    function dispatchAllAlertRoutes() {
      openQuickDispatchModal();
    }

    function viewAlertNode(binId) {
      const bin = BINS_DATA.find(item => item.id === binId);
      if (!bin) return;
      switchView('alerts');
      const detailPanel = document.getElementById('alert-machine-detail');
      detailPanel.classList.remove('hidden');
      document.getElementById('alert-detail-title').innerText = bin.id;
      document.getElementById('alert-detail-location').innerText = `${bin.location}, ${bin.city}`;
      document.getElementById('alert-detail-stats').innerHTML = [
        ['Fill Level', `${bin.fill}%`, bin.status === 'Critical' ? 'text-rose-600' : 'text-amber-600'],
        ['Battery', `${bin.battery}%`, bin.battery < 25 ? 'text-rose-600' : 'text-emerald-600'],
        ['Last Update', bin.lastUpdate, 'text-slate-800'],
        ['Machine Status', bin.machineStatus, 'text-slate-800']
      ].map(([label, value, color]) => `<div class="bg-slate-50 rounded-xl p-3 border border-slate-100"><p class="text-slate-400">${label}</p><p class="font-extrabold ${color} mt-1">${value}</p></div>`).join('');
      document.getElementById('alert-all-bin-levels').innerHTML = BINS_DATA.map(currentBin => {
        const barColor = currentBin.status === 'Critical' ? 'bg-rose-500' : (currentBin.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500');
        return `<div class="flex items-center gap-3 text-xs"><span class="w-28 truncate font-bold text-slate-700">${currentBin.id}</span><div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div class="${barColor} h-full rounded-full" style="width: ${currentBin.fill}%"></div></div><span class="w-10 text-right font-extrabold text-slate-700">${currentBin.fill}%</span></div>`;
      }).join('');
      if (typeof L !== 'undefined') {
        if (alertDetailMap) alertDetailMap.remove();
        alertDetailMap = L.map('alert-detail-map', { attributionControl: false }).setView([bin.lat, bin.lng], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(alertDetailMap);
        L.marker([bin.lat, bin.lng]).addTo(alertDetailMap).bindPopup(`<b>${bin.id}</b><br>${bin.location}`).openPopup();
      } else {
        document.getElementById('alert-detail-map').innerHTML = '<div class="map-unavailable"><i class="fa-solid fa-map-location-dot text-3xl"></i><span>Map service is unavailable.</span></div>';
      }
      setTimeout(() => { if (alertDetailMap) alertDetailMap.invalidateSize(); }, 150);
      detailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function closeAlertMachineDetail() {
      document.getElementById('alert-machine-detail').classList.add('hidden');
    }

    function addBinToRoute(binId) {
      const bin = BINS_DATA.find(item => item.id === binId);
      const routeList = document.getElementById('routeStopsList');
      if (!bin) return;
      if (readyToDispatch.some(item => item.id === bin.id)) {
        updateAlertRouteButton(bin.id);
        return;
      }
      readyToDispatch.push({ ...bin });
      updateAlertRouteButton(bin.id);
      if (!routeList) return;
      if ([...routeList.querySelectorAll('[data-route-bin]')].some(item => item.dataset.routeBin === bin.id)) return;

      const stopNumber = routeList.children.length + 1;
      const fillColor = bin.status === 'Critical' ? 'text-rose-600' : (bin.status === 'Warning' ? 'text-amber-600' : 'text-emerald-600');
      const stop = document.createElement('div');
      stop.dataset.routeBin = bin.id;
      stop.className = 'flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80';
      stop.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-brand-700 text-white font-extrabold flex items-center justify-center shrink-0">${stopNumber}</div>
        <div class="flex-1">
          <div class="flex justify-between items-center">
            <span class="font-bold text-slate-800">${bin.location}</span>
            <span class="${fillColor} font-extrabold">${bin.fill}% Fill</span>
          </div>
          <p class="text-[11px] text-slate-400">Dustbin ID: ${bin.id} • Added from alert center</p>
        </div>
      `;
      routeList.appendChild(stop);
    }

    function updateAlertRouteButton(binId) {
      const button = document.getElementById(`alert-route-${binId}`);
      if (!button) return;
      button.innerText = 'Ready to Dispatch';
      button.className = 'px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold';
    }

    function openQuickDispatchModal() {
      const list = document.getElementById('ready-dispatch-list');
      const confirmButton = document.getElementById('confirmQuickDispatchButton');
      list.innerHTML = readyToDispatch.length
        ? readyToDispatch.map(bin => `<div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"><div><p class="font-extrabold text-sm text-slate-900">${bin.id}</p><p class="text-xs text-slate-500">${bin.location}</p></div><span class="text-xs font-extrabold text-rose-600">${bin.fill}% full</span></div>`).join('')
        : '<div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">No machines have been added to Ready to Dispatch.</div>';
      document.getElementById('dispatch-ready-count').innerText = `${readyToDispatch.length} machine${readyToDispatch.length === 1 ? '' : 's'} ready for dispatch.`;
      const select = document.getElementById('dispatchCollectorSelect');
      select.innerHTML = COLLECTORS_DATA.map((collector, index) => `<option value="${index}">${collector.vehicle} - ${collector.name}</option>`).join('');
      confirmButton.disabled = readyToDispatch.length === 0;
      confirmButton.classList.toggle('opacity-50', readyToDispatch.length === 0);
      document.getElementById('quickDispatchModal').classList.remove('hidden');
      setTimeout(renderQuickDispatchMap, 100);
    }

    function renderQuickDispatchMap() {
      const mapElement = document.getElementById('quick-dispatch-map');
      if (!mapElement) return;
      if (quickDispatchMap) {
        quickDispatchMap.remove();
        quickDispatchMap = null;
      }
      if (!readyToDispatch.length) {
        mapElement.innerHTML = '<div class="map-unavailable"><i class="fa-solid fa-route text-3xl"></i><span>Add machines to Ready to Dispatch to plot the route.</span></div>';
        return;
      }
      if (typeof L === 'undefined') {
        mapElement.innerHTML = '<div class="map-unavailable"><i class="fa-solid fa-map-location-dot text-3xl"></i><span>Map service is unavailable.</span></div>';
        return;
      }
      mapElement.innerHTML = '';
      const routePoints = readyToDispatch.map(bin => [bin.lat, bin.lng]);
      quickDispatchMap = L.map('quick-dispatch-map', { attributionControl: false }).fitBounds(routePoints, { padding: [25, 25] });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(quickDispatchMap);
      L.polyline(routePoints, { color: '#e11d48', weight: 4, opacity: 0.85, dashArray: '8, 8' }).addTo(quickDispatchMap);
      readyToDispatch.forEach((bin, index) => {
        const markerIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="w-7 h-7 rounded-full bg-rose-600 text-white font-extrabold flex items-center justify-center text-xs shadow-lg border-2 border-white">${index + 1}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        L.marker([bin.lat, bin.lng], { icon: markerIcon }).addTo(quickDispatchMap).bindPopup(`<b>${index + 1}. ${bin.id}</b><br>${bin.location}<br>Fill: <b>${bin.fill}%</b>`);
      });
    }

    function closeQuickDispatchModal() {
      document.getElementById('quickDispatchModal').classList.add('hidden');
    }

    function confirmQuickDispatch() {
      if (!readyToDispatch.length) return;
      const collector = COLLECTORS_DATA[Number(document.getElementById('dispatchCollectorSelect').value)];
      if (!collector) return;
      const dispatchedIds = readyToDispatch.map(bin => bin.id).join(', ');
      readyToDispatch.length = 0;
      closeQuickDispatchModal();
      renderAlertsList();
      alert(`Route confirmed. ${collector.vehicle} (${collector.name}) assigned to ${dispatchedIds}.`);
    }

    // Modal Operations
    function openAddMachineModal() {
      document.getElementById('addMachineModal').classList.remove('hidden');
    }
    function closeAddMachineModal() {
      document.getElementById('addMachineModal').classList.add('hidden');
    }

    function openAddCollectorModal() {
      document.getElementById('addCollectorModal').classList.remove('hidden');
    }

    function closeAddCollectorModal() {
      document.getElementById('addCollectorModal').classList.add('hidden');
    }

    function handleCreateCollector(event) {
      event.preventDefault();
      const name = document.getElementById('newCollectorName').value.trim();
      const collector = {
        name,
        license: document.getElementById('newCollectorLicense').value.trim(),
        vehicle: document.getElementById('newCollectorVehicle').value.trim(),
        phone: document.getElementById('newCollectorPhone').value.trim(),
        status: document.getElementById('newCollectorStatus').value,
        photo: document.getElementById('newCollectorPhoto').value.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=047857&color=fff`
      };
      COLLECTORS_DATA.unshift(collector);
      renderCollectorsGrid();
      updateDashboardMetrics();
      document.querySelector('#addCollectorModal form').reset();
      closeAddCollectorModal();
      alert(`${name} was added to the collector directory.`);
    }

    function contactCollector(phone) {
      window.location.href = `tel:${phone.replace(/[^+\d]/g, '')}`;
    }

    function handleCreateMachine(e) {
      e.preventDefault();
      const id = document.getElementById('newBinId').value;
      const loc = document.getElementById('newBinLoc').value;
      const lat = parseFloat(document.getElementById('newBinLat').value);
      const lng = parseFloat(document.getElementById('newBinLng').value);

      const newMachine = {
        id,
        location: loc,
        city: "New Delhi, Delhi",
        lat,
        lng,
        status: "active"
      };
      const newTelemetry = {
        id,
        battery: 100,
        lastUpdate: "Just now",
        streams: { plastic: 20, paper: 35, metal: 20, reject: 25 }
      };

      MACHINE_DATA.unshift(newMachine);
      BIN_TELEMETRY_DATA.unshift(newTelemetry);
      BINS_DATA = buildBinsData();
      updateDashboardMetrics();
      renderFleetOverviewTable(BINS_DATA);
      renderMachinesGrid(BINS_DATA);
      renderAlertsList();
      closeAddMachineModal();
      alert(`✅ Dustbin ${id} provisioned and connected to smart mesh!`);
    }

    function dispatchSpecificBinRoute() {
      alert(`🚚 Route dispatched for ${currentSelectedBin.id} (${currentSelectedBin.location}). Truck #04 assigned.`);
    }

    function startRouteSimulation() {
      alert(`⚡ Simulation started! Truck #04 is now tracking waypoints across Delhi Central Corridor.`);
    }

    function generateAuditReportPDF() {
      alert('📄 Generating official ESG Monthly Audit report (PDF)... Download will begin shortly.');
    }

    function saveSettingsSuccess() {
      alert('💾 System configuration and alert thresholds saved successfully.');
    }

    function exportMachinesCSV() {
      alert('📥 Exporting fleet metadata CSV...');
    }