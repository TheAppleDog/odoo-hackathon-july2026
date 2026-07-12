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

  // Maintenance page hooks
  initMaintenanceUI();

  // Fuel page hooks
  initFuelUI();
});


console.log('TransitOps UI loaded');

function initFuelUI() {
  const fuelSearchInput = document.getElementById('fuelSearchInput');
  const fuelTypeFilter = document.getElementById('fuelTypeFilter');
  const fuelDateFilter = document.getElementById('fuelDateFilter');
  const fuelTableBody = document.getElementById('fuelTableBody');

  if (!fuelTableBody) return;

  const fuelModal = document.getElementById('fuelModal');
  const addFuelBtn = document.getElementById('addFuelBtn');
  const closeFuelModal = document.getElementById('closeFuelModal');
  const cancelFuelModal = document.getElementById('cancelFuelModal');

  const fuelForm = document.getElementById('fuelForm');
  const fuelModalTitle = document.getElementById('fuelModalTitle');
  const fuelFormMode = document.getElementById('fuelFormMode');
  const originalFuelLogId = document.getElementById('originalFuelLogId');

  const deleteFuelForm = document.getElementById('deleteFuelForm');
  const deleteFuelLogId = document.getElementById('deleteFuelLogId');

  const fields = {
    log_id: null,

    vehicle: document.getElementById('fuelVehicle'),
    driver: document.getElementById('fuelDriver'),
    fuel_type: document.getElementById('fuelType'),
    fuel_quantity: document.getElementById('fuelQuantity'),
    fuel_cost: document.getElementById('fuelCost'),
    current_odometer: document.getElementById('fuelOdometer'),
    fuel_station: document.getElementById('fuelStation'),
    fuel_date: document.getElementById('fuelDate'),
    remarks: document.getElementById('fuelRemarks'),
  };

  const FUEL_PER_PAGE = 6;
  let fuelCurrentPage = 1;

  const fuelPaginationMeta = document.getElementById('fuelPaginationMeta');
  const fuelPrevPageBtn = document.getElementById('fuelPrevPageBtn');
  const fuelNextPageBtn = document.getElementById('fuelNextPageBtn');

  function applyFuelPagination(totalMatches) {
    const rows = Array.from(fuelTableBody.rows);
    const matchedRows = rows.filter((r) => r.dataset.matchesFiltered === 'true');
    const total = totalMatches;
    const totalPages = Math.max(1, Math.ceil(total / FUEL_PER_PAGE));

    fuelCurrentPage = Math.min(Math.max(fuelCurrentPage, 1), totalPages);

    const startIndex = (fuelCurrentPage - 1) * FUEL_PER_PAGE;
    const endIndex = Math.min(startIndex + FUEL_PER_PAGE, total);

    matchedRows.forEach((row, idx) => {
      row.style.display = idx >= startIndex && idx < endIndex ? '' : 'none';
    });

    rows.forEach((row) => {
      if (row.dataset.matchesFiltered !== 'true') row.style.display = 'none';
    });

    if (fuelPaginationMeta) {
      const from = total === 0 ? 0 : startIndex + 1;
      const to = total === 0 ? 0 : endIndex;
      fuelPaginationMeta.textContent = `Showing ${from}–${to} of ${total} Fuel Logs`;
    }

    if (fuelPrevPageBtn) fuelPrevPageBtn.disabled = fuelCurrentPage <= 1;
    if (fuelNextPageBtn) fuelNextPageBtn.disabled = fuelCurrentPage >= totalPages;
  }

  function filterFuelRows() {
    const q = (fuelSearchInput?.value || '').trim().toLowerCase();
    const ft = (fuelTypeFilter?.value || 'all').toLowerCase();
    const fd = fuelDateFilter?.value || 'all';

    Array.from(fuelTableBody.rows).forEach((row) => {
      const vehicle = (row.dataset.vehicle || '').toLowerCase();
      const fuelType = (row.dataset.fuelType || '').toLowerCase();
      const rowDate = row.dataset.date || '';

      const matchesQ = !q || vehicle.includes(q) || (row.cells[0].textContent || '').toLowerCase().includes(q);
      const matchesT = ft === 'all' || fuelType === ft;
      const matchesD = fd === 'all' || rowDate === fd;

      const matches = matchesQ && matchesT && matchesD;
      row.dataset.matchesFiltered = matches ? 'true' : 'false';
      row.style.display = '';
    });

    fuelCurrentPage = 1;
    const matchedCount = Array.from(fuelTableBody.rows).filter((r) => r.dataset.matchesFiltered === 'true').length;
    applyFuelPagination(matchedCount);

    const empty = document.getElementById('fuelEmptyState');
    if (empty) empty.classList.toggle('hidden', matchedCount !== 0);
  }

  function getFuelRowData(row) {
    return {
      log_id: row.dataset.logId || row.children[0].textContent.trim(),
      vehicle: row.dataset.vehicle,
      driver: row.dataset.driver,
      fuel_type: row.cells[3].textContent.trim(),
      fuel_quantity: row.cells[4].textContent.trim(),
      cost: (row.cells[5].textContent || '').replace(/[^0-9.]/g, ''),
      mileage: row.cells[6].textContent.trim(),
      fuel_station: row.cells[7].textContent.trim(),
      fuel_date: row.dataset.date || row.cells[8].textContent.trim(),
      remarks: '',
    };
  }

  function closeFuelModalUI() {
    fuelModal.classList.add('hidden');
  }

  function openFuelModal(mode, rec = null) {
    fuelModal.classList.remove('hidden');
    fuelFormMode.value = mode;
    fuelModalTitle.textContent = mode === 'edit' ? 'Edit Fuel Log' : 'Add Fuel Log';

    if (mode === 'edit' && rec) {
      originalFuelLogId.value = rec.log_id || '';
      if (fields.vehicle) fields.vehicle.value = rec.vehicle;
      if (fields.driver) fields.driver.value = rec.driver;
      if (fields.fuel_type) fields.fuel_type.value = rec.fuel_type;
      if (fields.fuel_quantity) fields.fuel_quantity.value = rec.fuel_quantity;
      if (fields.fuel_cost) fields.fuel_cost.value = rec.cost;
      if (fields.current_odometer) fields.current_odometer.value = '';
      if (fields.fuel_station) fields.fuel_station.value = rec.fuel_station;
      if (fields.fuel_date) fields.fuel_date.value = rec.fuel_date;
      if (fields.remarks) fields.remarks.value = rec.remarks || '';
    } else {
      fuelForm.reset();
      fuelFormMode.value = 'add';
      originalFuelLogId.value = '';
      if (fields.remarks) fields.remarks.value = '';
      if (fuelTableBody) {
        const first = fuelTableBody.querySelector('tr');
        if (first && fields.vehicle) fields.vehicle.value = first.dataset.vehicle || '';
        if (first && fields.driver) fields.driver.value = first.dataset.driver || '';
        if (first && fields.fuel_type) fields.fuel_type.value = first.cells[3].textContent.trim();
      }
      if (fields.fuel_date) {
        const today = new Date();
        const iso = today.toISOString().slice(0, 10);
        fields.fuel_date.value = iso;
      }
    }

    document.getElementById('fuelVehicle')?.focus();
  }

  if (addFuelBtn) addFuelBtn.addEventListener('click', () => openFuelModal('add'));
  if (closeFuelModal) closeFuelModal.addEventListener('click', closeFuelModalUI);
  if (cancelFuelModal) cancelFuelModal.addEventListener('click', closeFuelModalUI);
  if (fuelModal) {
    fuelModal.addEventListener('click', (e) => {
      if (e.target === fuelModal) closeFuelModalUI();
    });
  }

  if (fuelPrevPageBtn) {
    fuelPrevPageBtn.addEventListener('click', () => {
      if (fuelPrevPageBtn.disabled) return;
      fuelCurrentPage -= 1;
      const matchedCount = Array.from(fuelTableBody.rows).filter((r) => r.dataset.matchesFiltered === 'true').length;
      applyFuelPagination(matchedCount);
    });
  }

  if (fuelNextPageBtn) {
    fuelNextPageBtn.addEventListener('click', () => {
      if (fuelNextPageBtn.disabled) return;
      fuelCurrentPage += 1;
      const matchedCount = Array.from(fuelTableBody.rows).filter((r) => r.dataset.matchesFiltered === 'true').length;
      applyFuelPagination(matchedCount);
    });
  }

  if (fuelTableBody) {
    fuelTableBody.addEventListener('click', (event) => {
      const editBtn = event.target.closest('.edit-fuel-btn');
      const deleteBtn = event.target.closest('.delete-fuel-btn');

      if (editBtn) {
        const row = editBtn.closest('tr');
        if (!row) return;
        const data = getFuelRowData(row);
        openFuelModal('edit', data);
      }

      if (deleteBtn) {
        const row = deleteBtn.closest('tr');
        if (!row) return;
        const logId = row.dataset.logId || row.children[0].textContent.trim();
        if (confirm('Delete this fuel log record?')) {
          deleteFuelLogId.value = logId;
          deleteFuelForm.submit();
        }
      }
    });
  }

  if (fuelSearchInput) fuelSearchInput.addEventListener('input', filterFuelRows);
  if (fuelTypeFilter) fuelTypeFilter.addEventListener('change', filterFuelRows);
  if (fuelDateFilter) fuelDateFilter.addEventListener('change', filterFuelRows);

  // Ensure initial filtered state
  Array.from(fuelTableBody.rows).forEach((row) => {
    row.dataset.matchesFiltered = 'true';
  });
  fuelCurrentPage = 1;
  filterFuelRows();
}


function initMaintenanceUI() {
  const maintenanceSearchInput = document.getElementById('maintenanceSearchInput');
  const serviceTypeFilter = document.getElementById('serviceTypeFilter');
  const maintenanceStatusFilter = document.getElementById('maintenanceStatusFilter');
  const maintenanceTableBody = document.getElementById('maintenanceTableBody');

  if (!maintenanceTableBody) return;

  const maintenanceModal = document.getElementById('maintenanceModal');
  const addMaintenanceBtn = document.getElementById('addMaintenanceBtn');
  const closeMaintenanceModal = document.getElementById('closeMaintenanceModal');
  const cancelMaintenanceModal = document.getElementById('cancelMaintenanceModal');

  const maintenanceForm = document.getElementById('maintenanceForm');
  const maintenanceModalTitle = document.getElementById('maintenanceModalTitle');
  const maintenanceFormMode = document.getElementById('maintenanceFormMode');
  const originalServiceId = document.getElementById('originalServiceId');

  const fields = {
    service_id: null, // not shown in modal; we will ask for Service ID through edit using originalServiceId
    vehicle: document.getElementById('maintenanceVehicle'),
    service_type: document.getElementById('maintenanceServiceType'),
    mechanic_name: document.getElementById('maintenanceMechanicName'),
    service_date: document.getElementById('maintenanceServiceDate'),
    estimated_cost: document.getElementById('maintenanceEstimatedCost'),
    notes: document.getElementById('maintenanceNotes'),
    status: document.getElementById('maintenanceStatus'),
  };

  // We store service_id in the hidden originalServiceId + use it to populate modal for edit.
  // For add, we generate a temporary service_id on the client is NOT requested; service_id is required by backend.
  // Therefore we will inject a Service ID input dynamically when opening the modal.
  function ensureServiceIdInput() {
    let input = document.getElementById('maintenanceServiceIdInput');
    if (input) return;
    const grid = maintenanceForm.querySelector('.modal-grid');
    if (!grid) return;

    const wrapper = document.createElement('label');
    wrapper.innerHTML = `\r\n      Service ID\r\n      <input type="text" id="maintenanceServiceIdInput" name="service_id" required />\r\n    `;
    grid.appendChild(wrapper);
  }

  function openMaintenanceModal(mode, rec = null) {
    ensureServiceIdInput();
    maintenanceModal.classList.remove('hidden');
    maintenanceFormMode.value = mode;
    maintenanceModalTitle.textContent = mode === 'edit' ? 'Edit Maintenance' : 'Add Maintenance';

    if (mode === 'edit' && rec) {
      document.getElementById('maintenanceServiceIdInput').value = rec.service_id;
      fields.vehicle.value = rec.vehicle;
      fields.service_type.value = rec.service_type;
      fields.mechanic_name.value = rec.mechanic_name;
      // rec.service_date is YYYY-MM-DD
      fields.service_date.value = rec.service_date;
      fields.estimated_cost.value = rec.estimated_cost;
      fields.notes.value = rec.notes || '';
      fields.status.value = rec.status;
      originalServiceId.value = rec.service_id;
    } else {
      maintenanceForm.reset();
      maintenanceFormMode.value = 'add';
      originalServiceId.value = '';
      // default
      if (fields.status) fields.status.value = 'Scheduled';
      if (fields.notes) fields.notes.value = '';
      if (fields.vehicle && maintenanceTableBody) {
        // default to first vehicle from table data
        const firstRow = maintenanceTableBody.querySelector('tr');
        if (firstRow && firstRow.dataset.vehicle) fields.vehicle.value = firstRow.dataset.vehicle;
      }
      // leave service_id empty for required input
    }

    document.getElementById('maintenanceServiceIdInput').focus();
  }

  function closeMaintenanceModalUI() {
    maintenanceModal.classList.add('hidden');
  }

  if (addMaintenanceBtn) addMaintenanceBtn.addEventListener('click', () => openMaintenanceModal('add'));
  if (closeMaintenanceModal) closeMaintenanceModal.addEventListener('click', closeMaintenanceModalUI);
  if (cancelMaintenanceModal) cancelMaintenanceModal.addEventListener('click', closeMaintenanceModalUI);
  if (maintenanceModal) {
    maintenanceModal.addEventListener('click', (e) => {
      if (e.target === maintenanceModal) closeMaintenanceModalUI();
    });
  }

  function statusTextToKey(txt) {
    return String(txt || '').toLowerCase().trim().replace(/\s+/g, '-');
  }

  function getMaintenanceRowData(row) {
    return {
      service_id: row.dataset.serviceId,
      vehicle: row.dataset.vehicle,
      service_type: row.dataset.serviceType,
      mechanic_name: row.children[3].textContent.trim(),
      service_date: row.children[4].textContent.trim(),
      estimated_cost: row.children[5].textContent.trim().replace(/[^0-9]/g, ''),
      status: (row.children[6].querySelector('.status-pill')?.textContent || row.dataset.status || '').trim(),
      notes: row.dataset.notes || '',
    };
  }

  // UI-only pagination that respects current filter matches by hiding non-matching rows.
  const maintenancePaginationMeta = document.getElementById('maintenancePaginationMeta');
  const maintenancePrevPageBtn = document.getElementById('maintenancePrevPageBtn');
  const maintenanceNextPageBtn = document.getElementById('maintenanceNextPageBtn');
  const MAINTENANCE_PER_PAGE = 6;
  let maintenanceCurrentPage = 1;

  function applyMaintenancePagination(totalMatches) {
    const rows = Array.from(maintenanceTableBody.rows);
    const matchedRows = rows.filter((r) => r.dataset.matchesFiltered === 'true');
    const total = totalMatches;
    const totalPages = Math.max(1, Math.ceil(total / MAINTENANCE_PER_PAGE));

    maintenanceCurrentPage = Math.min(Math.max(maintenanceCurrentPage, 1), totalPages);

    const startIndex = (maintenanceCurrentPage - 1) * MAINTENANCE_PER_PAGE;
    const endIndex = Math.min(startIndex + MAINTENANCE_PER_PAGE, total);

    matchedRows.forEach((row, idx) => {
      row.style.display = idx >= startIndex && idx < endIndex ? '' : 'none';
    });

    rows.forEach((row) => {
      if (row.dataset.matchesFiltered !== 'true') row.style.display = 'none';
    });

    if (maintenancePaginationMeta) {
      const from = total === 0 ? 0 : startIndex + 1;
      const to = total === 0 ? 0 : endIndex;
      maintenancePaginationMeta.textContent = `Showing ${from}–${to} of ${total} Services`;
    }

    if (maintenancePrevPageBtn) maintenancePrevPageBtn.disabled = maintenanceCurrentPage <= 1;
    if (maintenanceNextPageBtn) maintenanceNextPageBtn.disabled = maintenanceCurrentPage >= totalPages;
  }

  function applyMaintenanceFilters() {
    const q = (maintenanceSearchInput?.value || '').trim().toLowerCase();
    const st = (serviceTypeFilter?.value || 'all').toLowerCase();
    const s = (maintenanceStatusFilter?.value || 'all').toLowerCase();

    Array.from(maintenanceTableBody.rows).forEach((row) => {
      const vehicle = (row.dataset.vehicle || '').toLowerCase();
      const serviceType = (row.dataset.serviceType || '').toLowerCase();
      const rowStatus = statusTextToKey(row.dataset.status || '');

      const matchesQ = !q || vehicle.includes(q) || (row.children[1]?.textContent || '').toLowerCase().includes(q);
      const matchesST = st === 'all' || serviceType === st;
      const matchesS = s === 'all' || rowStatus === s;

      row.dataset.matchesFiltered = matchesQ && matchesST && matchesS ? 'true' : 'false';
      // default visible; pagination will finalize display
      row.style.display = '';
    });

    const matchedCount = Array.from(maintenanceTableBody.rows).filter((r) => r.dataset.matchesFiltered === 'true').length;
    maintenanceCurrentPage = 1;
    applyMaintenancePagination(matchedCount);

    // Empty state toggle
    const empty = document.getElementById('maintenanceEmptyState');
    if (empty) {
      empty.classList.toggle('hidden', matchedCount !== 0);
    }
  }

  if (maintenanceSearchInput) maintenanceSearchInput.addEventListener('input', applyMaintenanceFilters);
  if (serviceTypeFilter) serviceTypeFilter.addEventListener('change', applyMaintenanceFilters);
  if (maintenanceStatusFilter) maintenanceStatusFilter.addEventListener('change', applyMaintenanceFilters);

  if (maintenancePrevPageBtn) {
    maintenancePrevPageBtn.addEventListener('click', () => {
      if (maintenancePrevPageBtn.disabled) return;
      maintenanceCurrentPage -= 1;
      const matchedCount = Array.from(maintenanceTableBody.rows).filter((r) => r.dataset.matchesFiltered === 'true').length;
      applyMaintenancePagination(matchedCount);
    });
  }

  if (maintenanceNextPageBtn) {
    maintenanceNextPageBtn.addEventListener('click', () => {
      if (maintenanceNextPageBtn.disabled) return;
      maintenanceCurrentPage += 1;
      const matchedCount = Array.from(maintenanceTableBody.rows).filter((r) => r.dataset.matchesFiltered === 'true').length;
      applyMaintenancePagination(matchedCount);
    });
  }

  if (maintenanceTableBody) {
    maintenanceTableBody.addEventListener('click', (event) => {
      const editBtn = event.target.closest('.edit-maintenance-btn');
      const deleteBtn = event.target.closest('.delete-maintenance-btn');

      if (editBtn) {
        const row = editBtn.closest('tr');
        if (!row) return;
        const data = getMaintenanceRowData(row);
        // Notes are not present in the row; backend keeps notes; we store empty.
        openMaintenanceModal('edit', data);
      }

      if (deleteBtn) {
        const row = deleteBtn.closest('tr');
        if (!row) return;
        const sid = row.dataset.serviceId;
        if (confirm('Delete this maintenance record?')) {
          document.getElementById('deleteMaintenanceServiceId').value = sid;
          document.getElementById('deleteMaintenanceForm').submit();
        }
      }
    });
  }

  applyMaintenanceFilters();
}

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

