// =================== TAB SWITCH ===================
function openTab(evt, tabName) {
    const contents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < contents.length; i++) {
        contents[i].style.display = "none";
    }

    const buttons = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

// =================== VOLUNTEER DATA ===================
// Volunteer JSON লোড
let volunteers = [];
fetch('volunteers.json')
    .then(response => response.json())
    .then(data => {
        volunteers = data;
    })
    .catch(err => console.error('Volunteer JSON load error:', err));

// Volunteer search function
function searchVolunteer() {
    const phone = document.getElementById('searchPhone').value.trim();
    const resultDiv = document.getElementById('volunteerResult');
    resultDiv.innerHTML = '';

    if (phone.length !== 11 || !/^01\d{9}$/.test(phone)) {
        resultDiv.innerHTML = '<div class="card" style="color:red;text-align:center;">⚠️ সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।</div>';
        return;
    }

    const volunteer = volunteers.find(v => v.phone === phone);
    if (!volunteer) {
        resultDiv.innerHTML = '<div class="card" style="color:red;text-align:center;">আপনার দেওয়া নাম্বারে কোন ভলেন্টিয়ার পাওয়া যায়নি।</div>';
        return;
    }

    // Volunteer profile card
    let html = `<div class="card profile">
        <img src="${volunteer.photo}" alt="${volunteer.name}">
        <h3>স্বাগতম ${volunteer.name}</h3>
        <p>দায়িত্ব: ${volunteer.duty} | রুম: ${volunteer.room}</p>
        <p>মোবাইল: ${volunteer.phone} | ইমেইল: ${volunteer.email}</p>
        <p>রক্তের গ্রুপ: ${volunteer.blood} | টি-শার্ট: ${volunteer.tshirt}</p>
        <p>অতিরিক্ত তথ্য: ${volunteer.extra}</p>
    </div>`;

    // Same duty members
    const sameDuty = volunteers.filter(v => v.duty === volunteer.duty && v.phone !== volunteer.phone);
    if (sameDuty.length > 0) {
        html += `<div class="card same-duty">
            <h4>একই দায়িত্বের অন্যান্য ভলেন্টিয়ার</h4>`;
        sameDuty.forEach(v => {
            html += `<div class="same-duty-item">
                <img src="${v.photo}" alt="${v.name}">
                <span>${v.name} | রুম: ${v.room}</span>
            </div>`;
        });
        html += `</div>`;
    }

    // Room details for duty = "Guard" (example)
    if (volunteer.duty.toLowerCase() === 'guard') {
        html += `<div class="card">
            <h4>${volunteer.room} রুমের বিস্তারিত</h4>
            <p>${volunteer.roomDetails || 'ডিটেইলস দেওয়া হয়নি'}</p>
        </div>`;
    }

    resultDiv.innerHTML = html;
}

// =================== ADMIN PANEL ===================
const adminCreds = [
    {username:'admin1', password:'1234'},
    {username:'admin2', password:'abcd'}
];

function adminLogin() {
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value.trim();
    const loginMsg = document.getElementById('adminLoginMsg');

    const valid = adminCreds.find(u => u.username === user && u.password === pass);
    if (!valid) {
        alert('Username বা Password ভুল!');
        return;
    }

    document.getElementById('adminTable').style.display = 'block';

    // Filter dropdown
    const filterSelect = document.getElementById('filterDuty');
    const duties = [...new Set(volunteers.map(v => v.duty))];
    filterSelect.innerHTML = `<option value="">সকল দায়িত্ব</option>`;
    duties.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        filterSelect.appendChild(opt);
    });

    // Table
    const tbody = document.querySelector('#adminTable tbody');
    tbody.innerHTML = '';
    volunteers.forEach(v => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${v.photo}" style="width:35px;height:45px;object-fit:cover;border-radius:3px;"> ${v.name}</td>
            <td>${v.gender}</td>
            <td>${v.phone}</td>
            <td>${v.email}</td>
            <td>${v.blood}</td>
            <td>${v.duty}</td>
            <td>${v.room}</td>
            <td>${v.tshirt}</td>
            <td>${v.extra}</td>
        `;
        tbody.appendChild(row);
    });
}

// Filter admin table by duty
function filterDutyList() {
    const filterValue = document.getElementById('filterDuty').value;
    const tbody = document.querySelector('#adminTable tbody');
    Array.from(tbody.rows).forEach(row => {
        row.style.display = (!filterValue || row.cells[5].textContent === filterValue) ? '' : 'none';
    });
}

// PDF Download placeholder
function downloadVolunteerPDF() {
    window.open('volunteers.pdf', '_blank');
}

// =================== DEFAULT VOLUNTEER TAB ===================
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("volunteer").style.display = "block";
});    });
}

// ===== PDF Download =====
function downloadPDF(){
    window.open(adminData.pdf,'_blank');
}
