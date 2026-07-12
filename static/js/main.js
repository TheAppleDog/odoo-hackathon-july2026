// main.js holds client-side behavior for TransitOps.
// It includes login form behavior and vehicle list interactions.

const passwordToggle = document.querySelector('.password-toggle');
const passwordInput = document.querySelector('#password');

if (passwordToggle && passwordInput) {
  passwordToggle.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    passwordToggle.querySelector('.toggle-icon').textContent = isPassword ? '🙈' : '👁️';
  });
}

const addVehicleBtn = document.getElementById('addVehicleBtn');
const vehicleModal = document.getElementById('vehicleModal');
const closeModal = document.getElementById('closeModal');
const cancelModal = document.getElementById('cancelModal');
const vehicleForm = document.getElementById('vehicleForm');
const modalTitle = document.getElementById('modalTitle');
const formMode = document.getElementById('formMode');
const originalRegistration = document.getElementById('originalRegistration');

const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const statusFilter = document.getElementById('statusFilter');
const vehicleTableBody = document.getElementById('vehicleTableBody');

const deleteForm = document.getElementById('deleteForm');
const deleteRegistration = document.getElementById('deleteRegistration');

function openModal(mode, vehicle = null) {
  vehicleModal.classList.remove('hidden');
  modalTitle.textContent = mode === 'edit' ? 'Edit Vehicle' : 'Add Vehicle';
  formMode.value = mode;

  if (mode === 'edit' && vehicle) {
    document.getElementById('registration').value = vehicle.registration;
    document.getElementById('name').value = vehicle.name;
    document.getElementById('type').value = vehicle.type;
    document.getElementById('capacity').value = vehicle.capacity;
    document.getElementById('fuel_type').value = vehicle.fuel_type || '';
    document.getElementById('odometer').value = vehicle.odometer;
    document.getElementById('status').value = vehicle.status;
    // purchase_date not available from table row; keep existing value or blank for now.
    originalRegistration.value = vehicle.registration;
    document.getElementById('registration').focus();
  } else {
    vehicleForm.reset();
    originalRegistration.value = '';
    document.getElementById('registration').focus();
  }
}


function closeVehicleModal() {
  vehicleModal.classList.add('hidden');
}

if (addVehicleBtn) {
  addVehicleBtn.addEventListener('click', () => openModal('add'));
}

if (closeModal) {
  closeModal.addEventListener('click', closeVehicleModal);
}

if (cancelModal) {
  cancelModal.addEventListener('click', closeVehicleModal);
}

if (vehicleModal) {
  vehicleModal.addEventListener('click', (event) => {
    if (event.target === vehicleModal) {
      closeVehicleModal();
    }
  });
}

function getVehicleRowData(row) {
  const statusText = row.children[6].textContent.trim();
  return {
    registration: row.dataset.registration,
    name: row.children[1].textContent,
    type: row.children[2].textContent,
    capacity: row.children[3].textContent,
    fuel_type: row.children[4].textContent,
    odometer: row.children[5].textContent,
    status: statusText,
  };
}


function updateTableVisibility() {
  const searchValue = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value.toLowerCase();
  const typeValue = typeFilter ? typeFilter.value.toLowerCase() : 'all';

  Array.from(vehicleTableBody.rows).forEach((row) => {
    const rowText = [
      row.cells[0].textContent,
      row.cells[1].textContent,
      row.cells[2].textContent,
      row.cells[3].textContent,
      row.cells[4].textContent,
    ]
      .join(' ')
      .toLowerCase();

    const rowStatus = row.dataset.status.toLowerCase();
    const rowType = row.dataset.type ? row.dataset.type.toLowerCase() : '';

    const matchesSearch = rowText.includes(searchValue);
    const matchesStatus = statusValue === 'all' || rowStatus === statusValue;
    const matchesType = typeValue === 'all' || rowType === typeValue;

    row.style.display = matchesSearch && matchesStatus && matchesType ? '' : 'none';
  });
}


if (searchInput) {
  searchInput.addEventListener('input', updateTableVisibility);
}

// Basic client-side validation for required numeric fields
if (vehicleForm) {
  vehicleForm.addEventListener('submit', (e) => {
    const registration = document.getElementById('registration')?.value?.trim();
    const name = document.getElementById('name')?.value?.trim();
    const capacity = document.getElementById('capacity')?.value?.trim();
    const odometer = document.getElementById('odometer')?.value?.trim();

    const isNum = (v) => v !== '' && !Number.isNaN(Number(v));

    if (!registration) {
      e.preventDefault();
      alert('Registration Number is required.');
      return;
    }
    if (!name) {
      e.preventDefault();
      alert('Vehicle Name is required.');
      return;
    }
    if (!isNum(capacity)) {
      e.preventDefault();
      alert('Capacity must be numeric.');
      return;
    }
    if (!isNum(odometer)) {
      e.preventDefault();
      alert('Odometer must be numeric.');
      return;
    }
  });
}


if (statusFilter) {
  statusFilter.addEventListener('change', updateTableVisibility);
}

if (typeFilter) {
  typeFilter.addEventListener('change', updateTableVisibility);
}


if (vehicleTableBody) {
  vehicleTableBody.addEventListener('click', (event) => {
    const editButton = event.target.closest('.edit-btn');
    const deleteButton = event.target.closest('.delete-btn');

    if (editButton) {
      const row = editButton.closest('tr');
      openModal('edit', getVehicleRowData(row));
    }

    if (deleteButton) {
      const row = deleteButton.closest('tr');
      if (confirm('Delete this vehicle from the fleet?')) {
        deleteRegistration.value = row.dataset.registration;
        deleteForm.submit();
      }
    }
  });
}


function setCurrentDate() {
  const dateEl = document.getElementById('currentDate');
  if (!dateEl) return;
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  dateEl.textContent = new Date().toLocaleDateString('en-US', options);
}

function animateKpiNumbers() {
  const counters = document.querySelectorAll('.kpi-number[data-target]');
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target);
    const duration = 1200;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
    let current = 0;

    const update = () => {
      current += step;
      if (current >= target) {
        counter.textContent = target;
      } else {
        counter.textContent = current;
        requestAnimationFrame(update);
      }
    };

    update();
  });
}


function initCharts() {
  // Fleet Utilization Bar Chart (70%)
  const fleetUtilizationCtx = document.getElementById('fleetUtilizationChart');
  if (fleetUtilizationCtx) {
    new Chart(fleetUtilizationCtx, {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Utilization %',
            data: [72, 78, 81, 75],
            backgroundColor: '#714B67',
            borderRadius: 12,
            maxBarThickness: 26,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#675263' } },
          y: {
            grid: { color: 'rgba(113,75,103,0.08)' },
            ticks: { color: '#675263', stepSize: 10 },
            suggestedMax: 100,
          },
        },
      },
    });
  }

  // Vehicle Status Doughnut Chart (30%)
  const vehicleStatusCtx = document.getElementById('vehicleStatusChart');
  if (vehicleStatusCtx) {
    new Chart(vehicleStatusCtx, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'In Transit', 'Idle'],
        datasets: [
          {
            data: [58, 26, 16],
            backgroundColor: ['#714B67', '#5A8FD4', '#B8B0C0'],
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        cutout: '65%',
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}

function initDashboard() {
  // Keep date logic only if date element exists (older dashboard markup)
  setCurrentDate();
  animateKpiNumbers();
  initCharts();
  document.body.classList.add('dashboard-ready');
}


// Theme toggle removed (light/dark selection disabled).

function initDropdowns() {
  const notificationsBtn = document.getElementById('notificationsBtn');
  const notificationsDropdown = document.getElementById('notificationsDropdown');
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  const panels = [notificationsDropdown, profileDropdown].filter(Boolean);

  const closeAll = () => panels.forEach((p) => (p.style.display = 'none'));
  const togglePanel = (btn, panel) => {
    if (!btn || !panel) return;
    const isOpen = panel.style.display === 'block';
    closeAll();
    panel.style.display = isOpen ? 'none' : 'block';
  };

  if (notificationsBtn && notificationsDropdown) {
    notificationsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel(notificationsBtn, notificationsDropdown);
    });
  }

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel(profileBtn, profileDropdown);
    });
  }

  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
}

function initGlobalSearch() {
  const globalSearch = document.getElementById('globalSearch');
  const vehicleTableBody = document.getElementById('vehicleTableBody');
  if (!globalSearch) return;

  const apply = () => {
    const q = globalSearch.value.trim().toLowerCase();
    if (!vehicleTableBody) return;

    Array.from(vehicleTableBody.rows).forEach((row) => {
      const registration = (row.dataset.registration || '').toLowerCase();
      const driver = (row.dataset.driver || '').toLowerCase();
      const trip = (row.dataset.tripId || row.dataset.trip_id || '').toLowerCase();

      const matches = !q || registration.includes(q) || driver.includes(q) || trip.includes(q);
      row.style.display = matches ? '' : 'none';
    });
  };

  globalSearch.addEventListener('input', apply);
  apply();
}

function initDriversUI() {
  const addDriverBtn = document.getElementById('addDriverBtn');
  const driverModal = document.getElementById('driverModal');
  const closeDriverModal = document.getElementById('closeDriverModal');
  const cancelDriverModal = document.getElementById('cancelDriverModal');

  const driverForm = document.getElementById('driverForm');
  const driverModalTitle = document.getElementById('driverModalTitle');
  const driverFormMode = document.getElementById('driverFormMode');
  const originalLicenseNumber = document.getElementById('originalLicenseNumber');

  const searchInput = document.getElementById('driverSearchInput');
  const statusFilter = document.getElementById('driverStatusFilter');
  const licenseFilter = document.getElementById('driverLicenseFilter');
  const driverTableBody = document.getElementById('driverTableBody');

  const deleteForm = document.getElementById('deleteDriverForm');
  const deleteLicenseNumber = document.getElementById('deleteDriverLicenseNumber');

  const statusPillToKey = (txt) => String(txt || '').toLowerCase().trim().replace(/\s+/g, '-');

  function openDriverModal(mode, driver = null) {
    driverModal.classList.remove('hidden');
    driverFormMode.value = mode;
    driverModalTitle.textContent = mode === 'edit' ? 'Edit Driver' : 'Add Driver';

    if (mode === 'edit' && driver) {
      document.getElementById('full_name').value = driver.full_name || '';
      document.getElementById('phone').value = driver.phone || '';
      document.getElementById('email').value = driver.email || '';
      document.getElementById('license_number').value = driver.license_number || '';
      document.getElementById('license_expiry').value = driver.license_expiry || '';
      document.getElementById('assigned_vehicle_registration').value = driver.assigned_vehicle_registration || '';
      document.getElementById('experience').value = driver.experience || '';
      document.getElementById('address').value = driver.address || '';
      document.getElementById('status').value = driver.status || 'Available';
      document.getElementById('availability').value = driver.availability || driver.status || 'Available';

      originalLicenseNumber.value = driver.license_number || '';
      document.getElementById('full_name').focus();
    } else {
      driverForm.reset();
      driverFormMode.value = 'add';
      originalLicenseNumber.value = '';
      // set defaults
      document.getElementById('status').value = 'Available';
      document.getElementById('availability').value = 'Available';
      document.getElementById('full_name').focus();
    }
  }

  function closeModal() {
    driverModal.classList.add('hidden');
  }

  if (addDriverBtn) addDriverBtn.addEventListener('click', () => openDriverModal('add'));
  if (closeDriverModal) closeDriverModal.addEventListener('click', closeModal);
  if (cancelDriverModal) cancelDriverModal.addEventListener('click', closeModal);

  if (driverModal) {
    driverModal.addEventListener('click', (event) => {
      if (event.target === driverModal) closeModal();
    });
  }

  function getDriverRowData(row) {
    // Columns now:
    // 0 Driver Name, 1 Phone, 2 Email, 3 License Number,
    // 4 Assigned Vehicle, 5 Experience, 6 Status, 7 Actions
    return {
      full_name: row.children[0].textContent.trim(),
      phone: row.children[1].textContent.trim(),
      email: row.children[2]?.textContent?.trim() || '',
      license_number:
        row.dataset.licenseNumber ||
        row.dataset.license_number ||
        row.children[3].textContent.trim(),
      assigned_vehicle_registration:
        row.children[4].textContent.trim() === '-' ? '' : row.children[4].textContent.trim(),
      experience: row.children[5].textContent.trim(),
      status: row.dataset.status ? row.dataset.status.replace(/-/g, ' ') : row.children[6].textContent.trim(),
      license_expiry: row.dataset.expiry || '',
      availability: row.dataset.status ? row.dataset.status.replace(/-/g, ' ') : row.children[6].textContent.trim(),
      address: '',
    };
  }

  function isLicenseExpiring(isoDate) {
    if (!isoDate) return false;
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return false;
    const now = new Date();
    const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 90;
  }

  // Pagination (UI-only)
  const driverPaginationMeta = document.getElementById('driverPaginationMeta');
  const driverPrevPageBtn = document.getElementById('driverPrevPageBtn');
  const driverNextPageBtn = document.getElementById('driverNextPageBtn');
  const DRIVERS_PER_PAGE = 8;
  let driverCurrentPage = 1;

  function setPaginationButtons(totalMatches) {
    if (!driverPrevPageBtn || !driverNextPageBtn) return;

    const totalPages = Math.max(1, Math.ceil(totalMatches / DRIVERS_PER_PAGE));
    const canPrev = driverCurrentPage > 1;
    const canNext = driverCurrentPage < totalPages;

    driverPrevPageBtn.disabled = !canPrev;
    driverNextPageBtn.disabled = !canNext;
  }

  function applyPagination(totalMatches) {
    if (!driverTableBody) return;

    const rows = Array.from(driverTableBody.rows);
    const matchedRows = rows.filter((r) => r.dataset.matchesFiltered === 'true');

    const total = totalMatches;
    const totalPages = Math.max(1, Math.ceil(total / DRIVERS_PER_PAGE));
    driverCurrentPage = Math.min(Math.max(driverCurrentPage, 1), totalPages);

    const startIndex = (driverCurrentPage - 1) * DRIVERS_PER_PAGE;
    const endIndex = Math.min(startIndex + DRIVERS_PER_PAGE, total);

    matchedRows.forEach((row, idx) => {
      row.style.display = idx >= startIndex && idx < endIndex ? '' : 'none';
    });

    // Hide non-matched rows completely
    rows.forEach((row) => {
      if (row.dataset.matchesFiltered !== 'true') row.style.display = 'none';
    });

    if (driverPaginationMeta) {
      const from = total === 0 ? 0 : startIndex + 1;
      const to = total === 0 ? 0 : endIndex;
      driverPaginationMeta.textContent = `Showing ${from}–${to} of ${total} Drivers`;
    }

    setPaginationButtons(total);
  }

  function updateDriverVisibility() {
    const q = (searchInput?.value || '').toLowerCase();
    const s = (statusFilter?.value || 'all').toLowerCase();
    const l = (licenseFilter?.value || 'all').toLowerCase();

    if (!driverTableBody) return;

    Array.from(driverTableBody.rows).forEach((row) => {
      const name = (row.children[0].textContent || '').toLowerCase();
      const phone = (row.children[1].textContent || '').toLowerCase();
      const email = (row.children[2]?.textContent || '').toLowerCase();
      const lic = (row.children[3].textContent || '').toLowerCase();
      const veh = (row.children[4].textContent || '').toLowerCase();

      const matchesSearch =
        !q ||
        name.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        lic.includes(q) ||
        veh.includes(q);

      const rowStatus = (row.dataset.status || '').toLowerCase();
      const matchesStatus = s === 'all' || rowStatus === s;

      let matchesLicense = true;
      const expiry = row.dataset.expiry || '';
      if (l === 'expiring') matchesLicense = isLicenseExpiring(expiry);
      if (l === 'valid') matchesLicense = !!expiry && !isLicenseExpiring(expiry);

      const matches = matchesSearch && matchesStatus && matchesLicense;
      row.dataset.matchesFiltered = matches ? 'true' : 'false';
    });

    driverCurrentPage = 1;

    const matchedCount = Array.from(driverTableBody.rows).filter((r) => r.dataset.matchesFiltered === 'true').length;
    applyPagination(matchedCount);
  }

  if (searchInput) searchInput.addEventListener('input', updateDriverVisibility);
  if (statusFilter) statusFilter.addEventListener('change', updateDriverVisibility);
  if (licenseFilter) licenseFilter.addEventListener('change', updateDriverVisibility);

  if (driverPrevPageBtn) {
    driverPrevPageBtn.addEventListener('click', () => {
      if (driverPrevPageBtn.disabled) return;
      driverCurrentPage -= 1;
      const matchedCount = Array.from(driverTableBody?.rows || []).filter((r) => r.dataset.matchesFiltered === 'true').length;
      applyPagination(matchedCount);
    });
  }

  if (driverNextPageBtn) {
    driverNextPageBtn.addEventListener('click', () => {
      if (driverNextPageBtn.disabled) return;
      driverCurrentPage += 1;
      const matchedCount = Array.from(driverTableBody?.rows || []).filter((r) => r.dataset.matchesFiltered === 'true').length;
      applyPagination(matchedCount);
    });
  }

  if (driverTableBody) {
    driverTableBody.addEventListener('click', (event) => {
      const editBtn = event.target.closest('.edit-driver-btn');
      const deleteBtn = event.target.closest('.delete-driver-btn');

      if (editBtn) {
        const row = editBtn.closest('tr');
        openDriverModal('edit', getDriverRowData(row));
      }

      if (deleteBtn) {
        const row = deleteBtn.closest('tr');
        const license = row.dataset.licenseNumber || row.dataset.license_number || row.children[3].textContent.trim();
        if (confirm('Delete this driver from records?')) {
          deleteLicenseNumber.value = license;
          deleteForm.submit();
        }
      }
    });
  }

  updateDriverVisibility();
}

window.addEventListener('DOMContentLoaded', () => {
  // avoid layout overlap with fixed global topbar
  const page = document.querySelector('.dashboard-content');
  if (page) page.style.paddingTop = '94px';

  initDashboard();
  initDropdowns();
  initGlobalSearch();

  // Driver page hooks
  initDriversUI();

  // Trip page hooks
  initTripsUI();
});


console.log('TransitOps UI loaded');

function initTripsUI() {
  const tripSearchInput = document.getElementById('tripSearchInput');
  const tripStatusFilter = document.getElementById('tripStatusFilter');
  const tripRouteFilter = document.getElementById('tripRouteFilter');
  const tripTableBody = document.getElementById('tripTableBody');

  if (!tripTableBody) return;

  const tripModal = document.getElementById('tripModal');
  const addTripBtn = document.getElementById('addTripBtn');
  const closeTripModal = document.getElementById('closeTripModal');
  const cancelTripModal = document.getElementById('cancelTripModal');

  const tripForm = document.getElementById('tripForm');
  const tripModalTitle = document.getElementById('tripModalTitle');
  const tripFormMode = document.getElementById('tripFormMode');
  const originalTripId = document.getElementById('originalTripId');

  const deleteTripForm = document.getElementById('deleteTripForm');
  const deleteTripId = document.getElementById('deleteTripId');

  const fields = {
    trip_id: document.getElementById('trip_id'),
    pickup_location: document.getElementById('pickup_location'),
    destination: document.getElementById('destination'),
    driver: document.getElementById('driver'),
    vehicle: document.getElementById('vehicle'),
    departure_date: document.getElementById('departure_date'),
    departure_time: document.getElementById('departure_time'),
    expected_arrival: document.getElementById('expected_arrival'),
    distance_km: document.getElementById('distance_km'),
    trip_status: document.getElementById('trip_status'),
  };

  const statusTextToKey = (txt) => String(txt || '').toLowerCase().trim().replace(/\s+/g, '-');

  function openTripModal(mode, trip = null) {
    tripModal.classList.remove('hidden');
    tripFormMode.value = mode;
    tripModalTitle.textContent = mode === 'edit' ? 'Edit Trip' : 'Add Trip';

    if (mode === 'edit' && trip) {
      fields.trip_id.value = trip.trip_id || '';
      fields.pickup_location.value = trip.pickup_location || '';
      fields.destination.value = trip.destination || '';
      fields.driver.value = trip.driver_name || '';
      fields.vehicle.value = trip.vehicle_registration || '';
      fields.departure_date.value = trip.departure_date || '';
      fields.departure_time.value = trip.departure_time || '';
      // Convert stored "YYYY-MM-DD HH:MM" to datetime-local "YYYY-MM-DDTHH:MM"
      if (trip.expected_arrival) {
        const v = String(trip.expected_arrival);
        fields.expected_arrival.value = v.replace(' ', 'T');
      } else {
        fields.expected_arrival.value = '';
      }
      fields.distance_km.value = trip.distance_km != null ? trip.distance_km : '';
      fields.trip_status.value = trip.status || 'Scheduled';
      originalTripId.value = trip.original_trip_id || trip.trip_id || '';
      fields.trip_id.focus();
    } else {
      tripForm.reset();
      tripFormMode.value = 'add';
      originalTripId.value = '';
      tripModalTitle.textContent = 'Add Trip';
      fields.trip_id.focus();
    }
  }

  function closeTripModalUI() {
    tripModal.classList.add('hidden');
  }

  if (addTripBtn) addTripBtn.addEventListener('click', () => openTripModal('add'));
  if (closeTripModal) closeTripModal.addEventListener('click', closeTripModalUI);
  if (cancelTripModal) cancelTripModal.addEventListener('click', closeTripModalUI);

  if (tripModal) {
    tripModal.addEventListener('click', (e) => {
      if (e.target === tripModal) closeTripModalUI();
    });
  }

  function getTripRowData(row) {
    // Cells indices based on template:
    // 0 trip_id, 1 pickup, 2 destination, 3 driver, 4 vehicle, 5 departure, 6 arrival, 7 distance, 8 status, 9 actions
    const departureCell = row.cells[5].textContent.trim();
    const [departureDate, departureTime] = departureCell.split(' ');
    const expectedArrival = row.cells[6].textContent.trim();
    const distanceText = row.cells[7].textContent.trim();
    const distanceNum = distanceText.replace(/[^0-9.]/g, '');

    const statusPill = row.cells[8].querySelector('.status-pill');
    const statusText = statusPill ? statusPill.textContent.trim() : row.dataset.status || '';

    return {
      trip_id: row.cells[0].textContent.trim(),
      pickup_location: row.cells[1].textContent.trim(),
      destination: row.cells[2].textContent.trim(),
      driver_name: row.cells[3].textContent.trim(),
      vehicle_registration: row.cells[4].textContent.trim(),
      departure_date: departureDate || '',
      departure_time: departureTime || '',
      expected_arrival: expectedArrival,
      distance_km: distanceNum ? Number(distanceNum) : null,
      status: statusText,
    };
  }

  function applyTripFilters() {
    const q = (tripSearchInput?.value || '').trim().toLowerCase();
    const s = (tripStatusFilter?.value || 'all').toLowerCase();
    const r = (tripRouteFilter?.value || 'all').toLowerCase();

    Array.from(tripTableBody.rows).forEach((row) => {
      const text = Array.from(row.cells)
        .map((c) => (c.textContent || '').trim())
        .join(' ') // basic
        .toLowerCase();

      const rowStatus = (row.dataset.status || '').toLowerCase();
      const rowRoute = (row.dataset.route || '').toLowerCase();

      const matchesQ = !q || text.includes(q) || (row.dataset.tripId || '').toLowerCase().includes(q);
      const matchesS = s === 'all' || rowStatus === s || statusTextToKey(rowStatus) === statusTextToKey(s);
      const matchesR = r === 'all' || rowRoute === r;

      row.style.display = matchesQ && matchesS && matchesR ? '' : 'none';
    });
  }

  if (tripSearchInput) tripSearchInput.addEventListener('input', applyTripFilters);
  if (tripStatusFilter) tripStatusFilter.addEventListener('change', applyTripFilters);
  if (tripRouteFilter) tripRouteFilter.addEventListener('change', applyTripFilters);

  if (tripTableBody) {
    tripTableBody.addEventListener('click', (event) => {
      const editBtn = event.target.closest('.edit-trip-btn');
      const deleteBtn = event.target.closest('.delete-trip-btn');

      if (editBtn) {
        const row = editBtn.closest('tr');
        if (!row) return;
        const data = getTripRowData(row);
        data.original_trip_id = row.dataset.tripId || data.trip_id;
        openTripModal('edit', data);
      }

      if (deleteBtn) {
        const row = deleteBtn.closest('tr');
        if (!row) return;
        const tid = row.dataset.tripId || row.cells[0].textContent.trim();
        if (confirm('Delete this trip record?')) {
          deleteTripId.value = tid;
          deleteTripForm.submit();
        }
      }
    });
  }

  applyTripFilters();
}

