// รอให้หน้าเว็บโหลดเสร็จก่อนเริ่มทำงาน
document.addEventListener('DOMContentLoaded', () => {
    
    // ดึงปุ่มและองค์ประกอบต่างๆ ที่ต้องใช้
    const calculateBtn = document.getElementById('calculate-btn');
    const chartCanvas = document.getElementById('expense-chart');

    // ตัวแปรสำหรับเก็บกราฟ (เพื่อให้เราอัปเดตได้)
    let expenseChartInstance = null;

    // ฟังก์ชันสำหรับดึงค่าตัวเลขจาก Input (ถ้าว่างให้เป็น 0)
    function getValue(id) {
        const element = document.getElementById(id);
        // ใช้ parseFloat เพื่อแปลงข้อความเป็นตัวเลข (รวมทศนิยม)
        // || 0 หมายถึง ถ้าค่าที่ได้เป็น NaN (Not a Number) หรือค่าว่าง ให้ใช้ 0 แทน
        return parseFloat(element.value) || 0;
    }

    // ฟังก์ชันสำหรับคำนวณและแสดงผล
    function calculateAndDisplay() {
        
        // 1. ดึงค่ารายรับ
        const incomeSide = getValue('income-side');
        const incomeAllowance = getValue('income-allowance');
        const totalIncome = incomeSide + incomeAllowance;

        // 2. ดึงค่ารายจ่าย
        const expenseFood = getValue('expense-food');
        const expenseWork = getValue('expense-work');
        const expenseShopping = getValue('expense-shopping');
        const totalExpense = expenseFood + expenseWork + expenseShopping;

        // 3. คำนวณยอดคงเหลือ
        const balance = totalIncome - totalExpense;

        // 4. แสดงผลสรุปตัวเลข
        document.getElementById('total-income').textContent = totalIncome.toLocaleString(); // toLocaleString() ช่วยใส่ลูกน้ำ
        document.getElementById('total-expense').textContent = totalExpense.toLocaleString();
        document.getElementById('balance').textContent = balance.toLocaleString();

        // 5. อัปเดตหรือสร้างกราฟวงกลม
        updateChart(expenseFood, expenseWork, expenseShopping);
    }

    // ฟังก์ชันสำหรับวาดกราฟ
    function updateChart(food, work, shopping) {
        
        // ถ้ามีกราฟเก่าอยู่ ให้ทำลายทิ้งก่อน (ป้องกันกราฟซ้อนกัน)
        if (expenseChartInstance) {
            expenseChartInstance.destroy();
        }
        
        // ดึงพื้นที่วาด (context)
        const ctx = chartCanvas.getContext('2d');
        
        expenseChartInstance = new Chart(ctx, {
            type: 'pie', // ชนิดของกราฟ
            data: {
                labels: ['ค่ากิน', 'ค่างาน', 'ช้อปปิ้ง'], // ป้ายกำกับ
                datasets: [{
                    label: 'สัดส่วนรายจ่าย',
                    data: [food, work, shopping], // ข้อมูลตัวเลข
                    backgroundColor: [ // สีของแต่ละส่วน
                        'rgba(255, 99, 132, 0.8)', // แดง (ค่ากิน)
                        'rgba(54, 162, 235, 0.8)', // น้ำเงิน (ค่างาน)
                        'rgba(255, 206, 86, 0.8)'  // เหลือง (ช้อปปิ้ง)
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true, // ทำให้กราฟปรับขนาดตามหน้าจอ
                plugins: {
                    legend: {
                        position: 'top', // แสดงป้ายกำกับไว้ด้านบน
                    },
                    title: {
                        display: true,
                        text: 'สัดส่วนรายจ่าย' // หัวข้อกราฟ
                    }
                }
            }
        });
    }

    // สั่งให้ปุ่ม "คำนวณ" ทำงานเมื่อถูกคลิก
    calculateBtn.addEventListener('click', calculateAndDisplay);

    // คำนวณครั้งแรกเมื่อโหลดหน้า (เพื่อให้เห็นกราฟเปล่าๆ ก่อน)
    calculateAndDisplay();
});