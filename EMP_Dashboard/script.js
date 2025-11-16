// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selections ---
    const employeeForm = document.getElementById('employee-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const departmentInput = document.getElementById('department');
    const certifiedInput = document.getElementById('certified');
    const tableBody = document.getElementById('employee-table-body');
    const filterButtons = document.querySelector('.filter-buttons');
    const exportCsvButton = document.getElementById('export-csv');
    const searchBar = document.getElementById('search-bar'); // <-- NEW

    // Stats Elements
    const totalEl = document.getElementById('total-employees');
    const certifiedEl = document.getElementById('certified-count');
    const nonCertifiedEl = document.getElementById('non-certified-count');
    const mostCommonSkillEl = document.getElementById('most-common-skill');

    // Edit Modal Elements
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const cancelEditButton = document.getElementById('cancel-edit');
    const editIdInput = document.getElementById('edit-employee-id');
    const editNameInput = document.getElementById('edit-name');
    const editEmailInput = document.getElementById('edit-email');
    const editDepartmentInput = document.getElementById('edit-department');
    const editCertifiedInput = document.getElementById('edit-certified');

    // Toast Notification Element
    const toast = document.getElementById('toast-notification');

    // --- Application State ---
    let employees = [];
    let currentFilter = 'All';
    let currentSearchTerm = ''; // <-- NEW
    let editingEmployeeId = null;

    // --- Initial Data ---
    const sampleEmployees = [
        { id: 1, name: "Aisha Khan", email: "aisha@technova.com", department: "HR", skills: ["HTML", "CSS"], certified: true },
        { id: 2, name: "Bob Smith", email: "bob@technova.com", department: "Engineering", skills: ["JavaScript", "Python", "SQL"], certified: false },
        { id: 3, name: "Charlie Jain", email: "charlie@technova.com", department: "Sales", skills: ["CSS", "JavaScript"], certified: true }
    ];

    // --- Functions ---

    function loadEmployees() {
        const storedEmployees = localStorage.getItem('employees');
        if (storedEmployees) {
            employees = JSON.parse(storedEmployees);
        } else {
            employees = sampleEmployees;
            saveEmployees();
        }
    }

    function saveEmployees() {
        localStorage.setItem('employees', JSON.stringify(employees));
    }

    function renderTable(dataToRender) {
        tableBody.innerHTML = ''; // Clear existing rows

        if (dataToRender.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="6" style="text-align: center; color: var(--neutral-400-light);">No employees found...</td>`;
            tableBody.appendChild(tr);
            return;
        }

        dataToRender.forEach(employee => {
            const tr = document.createElement('tr');
            tr.dataset.id = employee.id;

            const skillsString = employee.skills.join(', ');
            const certifiedString = employee.certified ? 'Yes' : 'No';

            tr.innerHTML = `
                <th>${employee.name}</th>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${skillsString}</td>
                <td>${certifiedString}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn-edit" data-id="${employee.id}">Edit</button>
                        <button class="action-btn-delete" data-id="${employee.id}">Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function updateStats() {
        const total = employees.length;
        const certifiedCount = employees.filter(emp => emp.certified).length;
        const nonCertifiedCount = total - certifiedCount;

        const allSkills = employees.flatMap(emp => emp.skills);
        let mostCommonSkill = 'N/A';
        if (allSkills.length > 0) {
            const skillCounts = allSkills.reduce((acc, skill) => {
                acc[skill] = (acc[skill] || 0) + 1;
                return acc;
            }, {});
            mostCommonSkill = Object.keys(skillCounts).reduce((a, b) => 
                skillCounts[a] > skillCounts[b] ? a : b
            );
        }

        totalEl.textContent = total;
        certifiedEl.textContent = certifiedCount;
        nonCertifiedEl.textContent = nonCertifiedCount;
        mostCommonSkillEl.textContent = mostCommonSkill;
    }

    /**
     * NOW UPDATED to handle BOTH button filters AND search.
     */
    function filterAndRender() {
        let filteredEmployees = employees; // Start with all employees

        // 1. Apply Button Filter
        if (currentFilter !== 'All') {
            if (currentFilter === 'Certified') {
                filteredEmployees = filteredEmployees.filter(emp => emp.certified);
            } else {
                // Department filters
                filteredEmployees = filteredEmployees.filter(emp => emp.department === currentFilter);
            }
        }

        // 2. Apply Search Filter (to the already filtered list)
        const searchTerm = currentSearchTerm.toLowerCase().trim();
        if (searchTerm) {
            filteredEmployees = filteredEmployees.filter(emp => {
                // Check if name includes the search term
                const nameMatch = emp.name.toLowerCase().includes(searchTerm);
                
                // Check if ANY skill includes the search term
                const skillsMatch = emp.skills.some(skill => 
                    skill.toLowerCase().includes(searchTerm)
                );
                
                return nameMatch || skillsMatch; // Return true if either matches
            });
        }

        // 3. Render the final list
        renderTable(filteredEmployees);
    }

    function resetForm() {
        employeeForm.reset();
        document.querySelectorAll('.error-message.active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    }

    function addEmployee(e) {
        e.preventDefault(); 
        if (!validateForm(employeeForm)) {
            showToast('Please correct the errors in the form.', 'error');
            return;
        }

        const selectedSkills = [];
        employeeForm.querySelectorAll('input[name="skills"]:checked').forEach(checkbox => {
            selectedSkills.push(checkbox.value);
        });

        const newEmployee = {
            id: Date.now(),
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            department: departmentInput.value,
            skills: selectedSkills,
            certified: certifiedInput.checked
        };

        employees.push(newEmployee);
        saveEmployees();
        filterAndRender(); // Will now render with the current filter and search
        updateStats();
        resetForm();
        showToast('Employee added successfully!');
    }

    function deleteEmployee(id) {
        if (confirm('Are you sure you want to delete this employee?')) {
            employees = employees.filter(emp => emp.id !== id);
            saveEmployees();
            filterAndRender(); // Re-render the list
            updateStats();
            showToast('Employee deleted.', 'error');
        }
    }

    function openEditModal(id) {
        editingEmployeeId = id;
        const employee = employees.find(emp => emp.id === id);
        if (!employee) return;

        editIdInput.value = employee.id;
        editNameInput.value = employee.name;
        editEmailInput.value = employee.email;
        editDepartmentInput.value = employee.department;
        editCertifiedInput.checked = employee.certified;

        editForm.querySelectorAll('input[name="edit-skills"]').forEach(checkbox => {
            checkbox.checked = employee.skills.includes(checkbox.value);
        });

        editModal.showModal();
    }

    function handleEditSubmit(e) {
        e.preventDefault();

        const selectedSkills = [];
        editForm.querySelectorAll('input[name="edit-skills"]:checked').forEach(checkbox => {
            selectedSkills.push(checkbox.value);
        });

        employees = employees.map(emp => {
            if (emp.id === editingEmployeeId) {
                return {
                    id: emp.id,
                    name: editNameInput.value.trim(),
                    email: editEmailInput.value.trim(),
                    department: editDepartmentInput.value,
                    skills: selectedSkills,
                    certified: editCertifiedInput.checked
                };
            }
            return emp;
        });

        saveEmployees();
        filterAndRender(); // Re-render the list
        updateStats();
        editModal.close();
        editingEmployeeId = null;
        showToast('Employee details updated!');
    }

    function handleTableClick(e) {
        const target = e.target;
        if (target.classList.contains('action-btn-delete')) {
            const id = Number(target.dataset.id);
            deleteEmployee(id);
        }
        if (target.classList.contains('action-btn-edit')) {
            const id = Number(target.dataset.id);
            openEditModal(id);
        }
    }

    function handleFilterClick(e) {
        const target = e.target;
        if (!target.classList.contains('btn-filter')) return;

        filterButtons.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');

        currentFilter = target.dataset.filter;
        filterAndRender(); // This will now re-filter with the new button AND the existing search term
    }

    function validateField(e) {
        const field = e.target;
        const errorEl = field.nextElementSibling;
        let valid = true;
        let message = '';

        if (field.hasAttribute('required') && field.value.trim() === '') {
            valid = false;
            message = 'This field is required.';
        } else if (field.type === 'email' && !/\S+@\S+\.\S+/.test(field.value.trim())) {
            valid = false;
            message = 'Please enter a valid email address.';
        } else if (field.hasAttribute('minlength') && field.value.trim().length < field.minLength) {
            valid = false;
            message = `Must be at least ${field.minLength} characters.`;
        }

        if (valid) {
            field.classList.remove('invalid');
            errorEl.classList.remove('active');
            errorEl.textContent = '';
        } else {
            field.classList.add('invalid');
            errorEl.classList.add('active');
            errorEl.textContent = message;
        }
    }

    function validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input[required], select[required]');
        
        fields.forEach(field => {
            const errorEl = field.nextElementSibling;
            if (!errorEl || !errorEl.classList.contains('error-message')) return;

            let valid = true;
            let message = '';

            if (field.value.trim() === '') {
                valid = false;
                message = 'This field is required.';
            } else if (field.type === 'email' && !/\S+@\S+\.\S+/.test(field.value.trim())) {
                valid = false;
                message = 'Please enter a valid email address.';
            } else if (field.hasAttribute('minlength') && field.value.trim().length < field.minLength) {
                valid = false;
                message = `Must be at least ${field.minLength} characters.`;
            }

            if (valid) {
                field.classList.remove('invalid');
                errorEl.classList.remove('active');
                errorEl.textContent = '';
            } else {
                field.classList.add('invalid');
                errorEl.classList.add('active');
                errorEl.textContent = message;
                isValid = false;
            }
        });
        return isValid;
    }

    function exportToCSV() {
        const headers = ["ID", "Name", "Email", "Department", "Skills", "Certified"];
        const rows = employees.map(emp => [
            emp.id,
            `"${emp.name}"`,
            `"${emp.email}"`,
            `"${emp.department}"`,
            `"${emp.skills.join('; ')}"`,
            emp.certified
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'employee_report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function showToast(message, type = 'success') {
        toast.textContent = message;
        
        if (type === 'error') {
            toast.classList.add('error');
        } else {
            toast.classList.remove('error');
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function init() {
        loadEmployees();
        filterAndRender();
        updateStats();

        // Event Listeners
        employeeForm.addEventListener('submit', addEmployee);
        nameInput.addEventListener('blur', validateField);
        emailInput.addEventListener('blur', validateField);
        departmentInput.addEventListener('blur', validateField);
        tableBody.addEventListener('click', handleTableClick);
        filterButtons.addEventListener('click', handleFilterClick);
        editForm.addEventListener('submit', handleEditSubmit);
        cancelEditButton.addEventListener('click', () => editModal.close());
        exportCsvButton.addEventListener('click', exportToCSV);

        // --- Sidebar Toggle Button ---
        const sidebar = document.querySelector('.sidebar');
        const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
        const toggleIcon = toggleSidebarBtn.querySelector('.material-symbols-outlined');

        if (toggleSidebarBtn) {
            toggleSidebarBtn.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                
                // Change the icon text to match the state
                if (sidebar.classList.contains('collapsed')) {
                    toggleIcon.textContent = 'menu';
                } else {
                    toggleIcon.textContent = 'menu_open';
                }
            });
        }
        
        // --- NEW: Search Bar Event Listener ---
        searchBar.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value;
            filterAndRender(); // Re-filter on every keystroke
        });
    }

    // Run the app
    init();
});