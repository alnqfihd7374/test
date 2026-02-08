// المتغيرات العالمية لإدارة حالة التطبيق
let currentPage = 0;
let totalScore = 0;
const totalQuestions = 30;
const maxPossibleScore = 90; // 30 سؤال × 3 نقاط كحد أقصى
const answers = {}; // لتخزين إجابة كل سؤال

// 1. وظيفة بدء التقييم
function startAssessment() {
    const userName = document.getElementById('userName').value.trim();
    if (userName === "") {
        alert("يرجى إدخال الاسم الكامل لمتابعة الفحص السريري.");
        return;
    }

    document.getElementById('displayUserName').innerText = userName;
    document.getElementById('section-landing').classList.add('hidden');
    document.getElementById('section-assessment').classList.remove('hidden');
    
    showPage(1);
}

// 2. إدارة التنقل بين الصفحات
function showPage(pageNumber) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    
    // إظهار الصفحة المطلوبة
    const targetPage = document.getElementById(`page-${pageNumber}`);
    targetPage.classList.remove('hidden');
    
    currentPage = pageNumber;
    updateUI();
}

// 3. تحديث واجهة المستخدم (شريط التقدم والأزرار)
function updateUI() {
    // تحديث شريط التقدم
    const progress = (currentPage / 10) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('currentPageNum').innerText = currentPage;

    // التحكم في ظهور أزرار التنقل
    document.getElementById('prevBtn').classList.toggle('hidden', currentPage === 1);
    
    if (currentPage === 10) {
        document.getElementById('nextBtn').classList.add('hidden');
        document.getElementById('submitBtn').classList.remove('hidden');
    } else {
        document.getElementById('nextBtn').classList.remove('hidden');
        document.getElementById('submitBtn').classList.add('hidden');
    }
}

// 4. معالجة اختيار الإجابات
document.querySelectorAll('.opt-btn').forEach((button, index) => {
    button.addEventListener('click', function() {
        // تحديد السؤال الذي ينتمي إليه الزر
        const parentBlock = this.closest('.question-block');
        const questionIndex = Array.from(document.querySelectorAll('.question-block')).indexOf(parentBlock);
        
        // إزالة التحديد من الأزرار الأخرى في نفس السؤال
        parentBlock.querySelectorAll('.opt-btn').forEach(btn => btn.classList.remove('selected'));
        
        // إضافة التحديد للزر الحالي
        this.classList.add('selected');
        
        // تخزين النتيجة
        answers[questionIndex] = parseInt(this.getAttribute('data-value'));
    });
});

// 5. التنقل للأمام وللخلف
document.getElementById('nextBtn').addEventListener('click', () => {
    if (isPageAnswered(currentPage)) {
        showPage(currentPage + 1);
        window.scrollTo(0, 0);
    } else {
        alert("يرجى الإجابة على جميع الأسئلة في هذه الصفحة للمتابعة.");
    }
});

document.getElementById('prevBtn').addEventListener('click', () => {
    showPage(currentPage - 1);
    window.scrollTo(0, 0);
});

// التحقق من الإجابة على جميع أسئلة الصفحة الحالية
function isPageAnswered(page) {
    const startIndex = (page - 1) * 3;
    for (let i = startIndex; i < startIndex + 3; i++) {
        if (answers[i] === undefined) return false;
    }
    return true;
}

// 6. حساب النتيجة النهائية وعرض التقرير
document.getElementById('submitBtn').addEventListener('click', () => {
    if (!isPageAnswered(10)) {
        alert("يرجى إكمال الأسئلة الأخيرة.");
        return;
    }

    let finalScore = 0;
    for (let key in answers) {
        finalScore += answers[key];
    }

    const decayPercentage = Math.round((finalScore / maxPossibleScore) * 100);
    displayResults(decayPercentage);
});

function displayResults(percentage) {
    document.getElementById('section-assessment').classList.add('hidden');
    document.getElementById('section-results').classList.remove('hidden');
    document.getElementById('decayPercentage').innerText = percentage;
    
    // وضع التاريخ الحالي
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString('ar-EG', options);

    // تشخيص الحالة بناءً على النتيجة
    let diagnosis = "";
    if (percentage <= 25) {
        diagnosis = "المؤشرات الذهنية مستقرة. تظهر مرونة عالية في التعامل مع المشتتات الرقمية.";
    } else if (percentage <= 50) {
        diagnosis = "إجهاد معرفي متوسط. يُنصح بتفعيل وضع 'الهدوء' وتقليل ساعات التصفح العشوائي.";
    } else if (percentage <= 75) {
        diagnosis = "مؤشر تدهور مرتفع. تعاني الوظائف التنفيذية من إجهاد ناتج عن فرط استهلاك الدوبامين.";
    } else {
        diagnosis = "حالة إجهاد حاد (Brain Rot). يُنصح بقطع رقمي كامل (Digital Detox) لمدة 72 ساعة لاستعادة التوازن.";
    }
    document.getElementById('diagnosisText').innerText = diagnosis;
}

// 7. مشاركة النتيجة عبر واتساب
function shareToWhatsApp() {
    const name = document.getElementById('displayUserName').innerText;
    const score = document.getElementById('decayPercentage').innerText;
    const text = `نتائج الفحص السريري للإجهاد المعرفي الرقمي:\n\nالمشارك: ${name}\nنسبة التدهور المعرفي: ${score}%\n\nيمكنك إجراء الفحص الخاص بك هنا: https://alnqfihd7374.github.io/test/`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}
