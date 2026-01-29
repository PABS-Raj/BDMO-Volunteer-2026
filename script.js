let volunteers = [];
let adminData = {username:"admin",password:"123456",pdf:"assets/volunteer_list.pdf"};

// Load volunteer JSON
fetch('data/volunteers.json')
.then(res=>res.json())
.then(data=>volunteers=data);

// ===== Tabs =====
function openTab(tabName){
    document.querySelectorAll('.tab-content').forEach(tc=>tc.style.display='none');
    document.getElementById(tabName).style.display='block';
    document.querySelectorAll('.tab-btn').forEach(tb=>tb.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// ===== Volunteer Search =====
function searchVolunteer(){
    const phone = document.getElementById('phoneInput').value.trim();
    const box = document.getElementById('result');
    box.innerHTML='';

    if(!/01\d{9}/.test(phone)){
        box.innerHTML='<div class="card">⚠️ সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।</div>';
        return;
    }

    const v = volunteers.find(x=>x.phone===phone);
    if(!v){
        box.innerHTML='<div class="card">ভলেন্টিয়ার পাওয়া যায়নি।</div>';
        return;
    }

    box.innerHTML=`
    <div class="card profile">
        <img src="${v.photo}" alt="${v.name}">
        <h3>স্বাগতম ${v.name}</h3>
        <p>দায়িত্ব: ${v.duty}</p>
        <p>রুম: ${v.room}</p>
        <p>মোবাইল: ${v.phone}</p>
    </div>`;

    const same = volunteers.filter(x=>x.room===v.room && x.phone!==v.phone);
    if(same.length){
        let html='<div class="card same-duty"><h4>একই রুমে গার্ড</h4>';
        same.forEach(s=>{
            html+=`<div class="same-duty-item">
            <img src="${s.photo}" alt="${s.name}"><span>${s.name}</span>
            </div>`;
        });
        html+='</div>';
        box.innerHTML+=html;
    }
}

// ===== Admin Login =====
function loginAdmin(){
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value.trim();
    if(user===adminData.username && pass===adminData.password){
        document.getElementById('adminTable').style.display='block';
        document.getElementById('adminLogin').style.display='none';
        loadAdminTable();
    } else{
        alert('Username অথবা Password ভুল!');
    }
}

// ===== Load Admin Table =====
function loadAdminTable(){
    const tbody = document.getElementById('adminTbody');
    tbody.innerHTML='';
    volunteers.forEach(v=>{
        const row = document.createElement('tr');
        row.innerHTML=`
        <td>${v.name}</td>
        <td><img src="${v.photo}" style="width:35px;height:45px;object-fit:cover;border-radius:4px;"></td>
        <td>${v.phone}</td>
        <td>${v.email||''}</td>
        <td>${v.gender}</td>
        <td>${v.blood}</td>
        <td>${v.duty}</td>
        <td>${v.room}</td>
        <td>${v.tshirt}</td>
        <td>${v.extra}</td>
        `;
        tbody.appendChild(row);
    });

    const filter = document.getElementById('filterDuty');
    const duties = [...new Set(volunteers.map(v=>v.duty))];
    filter.innerHTML='<option value="">সকল দায়িত্ব</option>';
    duties.forEach(d=>{
        const opt = document.createElement('option');
        opt.value=d; opt.textContent=d;
        filter.appendChild(opt);
    });
}

// ===== Filter Table =====
function filterDutyList(){
    const val = document.getElementById('filterDuty').value;
    const tbody = document.getElementById('adminTbody');
    Array.from(tbody.rows).forEach(r=>{
        r.style.display=(val==='' || r.cells[6].textContent===val)?'':'none';
    });
}

// ===== PDF Download =====
function downloadPDF(){
    window.open(adminData.pdf,'_blank');
}
