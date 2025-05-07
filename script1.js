document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchForm = document.getElementById('search-form');
    const compareForm = document.getElementById('compare-form');
    const searchSection = document.getElementById('search-section');
    const compareSection = document.getElementById('compare-section');
    const resultSection = document.getElementById('result-section');
    const comparisonResultSection = document.getElementById('comparison-result-section');
    const loadingElement = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const printBtn = document.getElementById('print-btn');
    const printComparisonBtn = document.getElementById('print-comparison-btn');
    const downloadBtn = document.getElementById('download-btn');
    const backBtn = document.getElementById('back-btn');
    const compareBackBtn = document.getElementById('compare-back-btn');
    const errorBackBtn = document.getElementById('error-back-btn');
    const generationDate = document.getElementById('generation-date');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Student Info Elements
    const studentName = document.getElementById('student-name');
    const studentRoll = document.getElementById('student-roll');
    const studentReg = document.getElementById('student-reg');
    const marksheetNo = document.getElementById('marksheet-no');
    const instituteCode = document.getElementById('institute-code');
    const marksBody = document.getElementById('marks-body');
    const totalMarks = document.getElementById('total-marks');
    const totalPercent = document.getElementById('total-percent');
    const finalGrade = document.getElementById('final-grade');
    const resultStatus = document.getElementById('result-status');
    
    // Comparison Elements
    const student1Name = document.getElementById('student1-name');
    const student1Roll = document.getElementById('student1-roll');
    const student1TotalMarks = document.getElementById('student1-total-marks');
    const student1Percentage = document.getElementById('student1-percentage');
    const student1Grade = document.getElementById('student1-grade');
    const student2Name = document.getElementById('student2-name');
    const student2Roll = document.getElementById('student2-roll');
    const student2TotalMarks = document.getElementById('student2-total-marks');
    const student2Percentage = document.getElementById('student2-percentage');
    const student2Grade = document.getElementById('student2-grade');
    const totalMarksDiff = document.getElementById('total-marks-diff');
    const percentageDiff = document.getElementById('percentage-diff');
    const comparisonBody = document.getElementById('comparison-body');
    
    // Comprehensive subject code mapping based on official codes
    const subjectCodeMapping = {
        // Language Group - First Language
        'ENGA': 'English',
        'BNGA': 'Bengali',
        'HINA': 'Hindi',
        'NEPA': 'Nepali',
        'URDU': 'Urdu',
        'SANT': 'Santhali',
        'ODIA': 'Odia',
        'TELG': 'Telugu',
        'GJRT': 'Gujarati',
        'PNJB': 'Punjabi',
        
        // Language Group - Second Language
        'ENGB': 'English',
        'BNGB': 'Bengali',
        'HINB': 'Hindi',
        'ALTE': 'Alternative English',
        'NEPB': 'Nepali',
        
        // Set I Subjects
        'PHYS': 'Physics',
        'NUTN': 'Nutrition',
        'CHEM': 'Chemistry',
        'GEGR': 'Geography',
        'ECON': 'Economics',
        'ANTH': 'Anthropology',
        'SOWB': 'Science of Well Being',
        'MATH': 'Mathematics',
        'AGRI': 'Agriculture',
        'BIOS': 'Biological Science',
        'STAT': 'Statistics',
        'PSYC': 'Psychology',
        'COMS': 'Computer Science',
        'COMA': 'Modern Computer Application',
        'EVSC': 'Environmental Science',
        'HPED': 'Health & Physical Education',
        'VISA': 'Visual Arts',
        'MUSC': 'Music',
        'CBST': 'Cyber Security',
        'AIDS': 'Artificial Intelligence & Data Science',
        'FSAQ': 'Fisheries & Aquaculture',
        
        // Set II Subjects
        'ACCT': 'Accountancy',
        'BSTD': 'Business Studies',
        'CLPA': 'Commercial Law and Preliminaries of Auditing',
        'CSTX': 'Costing and Taxation',
        'APAI': 'Applied Artificial Intelligence',
        'ENVS': 'Environment Studies',
        'BMBS': 'Business Mathematics and Basic Statistics',
        
        // Set III Subjects
        'POLS': 'Political Science',
        'EDCN': 'Education',
        'JMCN': 'Journalism & Mass Communication',
        'SNSK': 'Sanskrit',
        'PRSN': 'Persian',
        'ARBC': 'Arabic',
        'BMSS': 'Basic Mathematics for Social Sciences',
        'PHIL': 'Philosophy',
        'SOCG': 'Sociology',
        'HIST': 'History',
        'HDRM': 'Human Development & Resource Management',
        
        // Vocational Subjects
        'ITEV': 'IT & ITeS',
        'ATMV': 'Automobile',
        'ORTV': 'Organised Retailing',
        'SEUV': 'Security',
        'HLCV': 'Health Care',
        'ELTV': 'Electronics',
        'THLV': 'Tourism & Hospitality',
        'PLBV': 'Plumbing',
        'CNSV': 'Construction',
        'APLV': 'Apparel',
        'BWLV': 'Beauty & Wellness',
        'AGLV': 'Agriculture (Vocational)',
        'POWV': 'Power',
        'BSIV': 'Banking Financial Services & Insurance',
        'FDPV': 'Food Processing',
        'TELV': 'Telecom',
        'HMFR': 'Home Management & Family Resource'
    };
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show the corresponding section
            if (tabName === 'search') {
                searchSection.style.display = 'block';
                compareSection.style.display = 'none';
            } else if (tabName === 'compare') {
                searchSection.style.display = 'none';
                compareSection.style.display = 'block';
            }
            
            // Hide result sections
            resultSection.style.display = 'none';
            comparisonResultSection.style.display = 'none';
            errorMessage.style.display = 'none';
        });
    });
    
    // Form submission handler for individual search
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const rollNo = document.getElementById('roll-no').value.trim();
        const regNo = document.getElementById('reg-no').value.trim();
        
        // Basic validation
        if (!rollNo || !regNo) {
            showError('Please enter both Roll Number and Registration Number.');
            return;
        }
        
        // Show loading
        searchSection.style.display = 'none';
        loadingElement.style.display = 'flex';
        errorMessage.style.display = 'none';
        
        // Fetch result
        fetchResult(rollNo, regNo, 'individual');
    });
    
    // Form submission handler for comparison
    compareForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const rollNo1 = document.getElementById('roll-no-1').value.trim();
        const regNo1 = document.getElementById('reg-no-1').value.trim();
        const rollNo2 = document.getElementById('roll-no-2').value.trim();
        const regNo2 = document.getElementById('reg-no-2').value.trim();
        
        // Basic validation
        if (!rollNo1 || !regNo1 || !rollNo2 || !regNo2) {
            showError('Please enter Roll Number and Registration Number for both students.');
            return;
        }
        
        // Show loading
        compareSection.style.display = 'none';
        loadingElement.style.display = 'flex';
        errorMessage.style.display = 'none';
        
        // Fetch results for both students
        fetchComparisonResults(rollNo1, regNo1, rollNo2, regNo2);
    });
    
    // Fetch result from API for individual search
    function fetchResult(rollNo, regNo, mode) {
        
        return fetch(`https://boardresultapi.abplive.com/wb/2025/12/${rollNo}/${regNo}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Result not found');
                }
                return response.json();
            })
            .then(data => {
                if (mode === 'individual') {
                    displayResult(data);
                }
                loadingElement.style.display = 'none';
                return data;
            })
            .catch(error => {
                showError('No result found. Please check your Roll Number and Registration Number.');
                loadingElement.style.display = 'none';
                return null;
            });
        
    }
    
    // Fetch results for comparison
    function fetchComparisonResults(rollNo1, regNo1, rollNo2, regNo2) {
        Promise.all([
            fetch(`https://boardresultapi.abplive.com/wb/2025/12/${rollNo1}/${regNo1}`).then(res => res.json()),
            fetch(`https://boardresultapi.abplive.com/wb/2025/12/${rollNo2}/${regNo2}`).then(res => res.json())
        ])
        .then(([student1Data, student2Data]) => {
            displayComparison(student1Data, student2Data);
            loadingElement.style.display = 'none';
        })
        .catch(error => {
            showError('No results found for one or both students. Please check the Roll Numbers and Registration Numbers.');
            loadingElement.style.display = 'none';
        });
        
    }
    
    // Display result data for individual search
    function displayResult(data) {
        // Fill student info
        studentName.textContent = data.name || '-';
        studentRoll.textContent = data.ROll_No || '-';
        studentReg.textContent = data.Reg_No || '-';
        marksheetNo.textContent = data.marksheet_no || '-';
        instituteCode.textContent = data.institute_code || '-';
        
        // Clear previous marks
        marksBody.innerHTML = '';
        
        // Add subject rows
        const subjectCount = 6; // Based on the sample data
        
        for (let i = 1; i <= subjectCount; i++) {
            const subjectCode = data[`sub_code${i}`];
            const theoryMarks = data[`thmarks${i}`] || '-';
            const practicalMarks = data[`prmarks${i}`] || '-';
            const totalSubjectMarks = data[`totalmarks${i}`] || '-';
            const percentage = data[`percent${i}`] || '-';
            const grade = data[`grade${i}`] || '-';
            
            if (subjectCode) {
                const row = document.createElement('tr');
                
                // Subject code cell
                const subjectCell = document.createElement('td');
                const subjectName = subjectCodeMapping[subjectCode] || 'Unknown Subject';
                
                // Create a more informative subject display
                let subjectDisplay = `${subjectCode} (${subjectName})`;
                
                // Determine if it's a language subject
                if (i <= 2 && (subjectCode.endsWith('A') || subjectCode.endsWith('B'))) {
                    if (i === 1) {
                        subjectDisplay += ' <span class="subject-type">First Language</span>';
                    } else if (i === 2) {
                        subjectDisplay += ' <span class="subject-type">Second Language</span>';
                    }
                }
                
                subjectCell.innerHTML = subjectDisplay;
                
                // Theory marks cell
                const theoryCell = document.createElement('td');
                theoryCell.textContent = theoryMarks;
                
                // Practical marks cell
                const practicalCell = document.createElement('td');
                practicalCell.textContent = practicalMarks;
                
                // Total marks cell
                const totalCell = document.createElement('td');
                totalCell.textContent = totalSubjectMarks;
                
                // Percentage cell
                const percentCell = document.createElement('td');
                if (percentage !== '-') {
                    percentCell.textContent = formatPercentage(percentage);
                } else {
                    percentCell.textContent = '-';
                }
                
                // Grade cell
                const gradeCell = document.createElement('td');
                const gradeSpan = document.createElement('span');
                gradeSpan.textContent = grade;
                gradeSpan.className = `grade-badge grade-${getGradeClass(grade)}`;
                gradeCell.appendChild(gradeSpan);
                
                // Append cells to row
                row.appendChild(subjectCell);
                row.appendChild(theoryCell);
                row.appendChild(practicalCell);
                row.appendChild(totalCell);
                row.appendChild(percentCell);
                row.appendChild(gradeCell);
                
                // Append row to table body
                marksBody.appendChild(row);
            }
        }
        
        // Set total marks, percentage and final grade
        totalMarks.textContent = data.totalMarks || '-';
        
        if (data.totalPercent) {
            totalPercent.textContent = formatPercentage(data.totalPercent);
        } else {
            totalPercent.textContent = '-';
        }
        
        // Set final grade with badge
        finalGrade.innerHTML = '';
        const finalGradeSpan = document.createElement('span');
        finalGradeSpan.textContent = data.finalGrade || '-';
        finalGradeSpan.className = `grade-badge grade-${getGradeClass(data.finalGrade)}`;
        finalGrade.appendChild(finalGradeSpan);
        
        // Set result status
        resultStatus.textContent = data.status || '-';
        if (data.status === 'PASS') {
            resultStatus.classList.add('pass');
            resultStatus.classList.remove('fail');
        } else if (data.status === 'FAIL') {
            resultStatus.classList.add('fail');
            resultStatus.classList.remove('pass');
        } else {
            resultStatus.classList.remove('pass', 'fail');
        }
        
        // Set generation date
        const now = new Date();
        generationDate.textContent = now.toLocaleString();
        
        // Show result section
        resultSection.style.display = 'block';
    }
    
    // Display comparison between two students
    function displayComparison(student1, student2) {
        // Fill student info
        student1Name.textContent = student1.name || '-';
        student1Roll.textContent = student1.ROll_No || '-';
        student2Name.textContent = student2.name || '-';
        student2Roll.textContent = student2.ROll_No || '-';
        
        // Fill summary data
        student1TotalMarks.textContent = student1.totalMarks || '-';
        student2TotalMarks.textContent = student2.totalMarks || '-';
        
        student1Percentage.textContent = student1.totalPercent ? formatPercentage(student1.totalPercent) : '-';
        student2Percentage.textContent = student2.totalPercent ? formatPercentage(student2.totalPercent) : '-';
        
        // Create grade badges
        student1Grade.innerHTML = '';
        const grade1Span = document.createElement('span');
        grade1Span.textContent = student1.finalGrade || '-';
        grade1Span.className = `grade-badge grade-${getGradeClass(student1.finalGrade)}`;
        student1Grade.appendChild(grade1Span);
        
        student2Grade.innerHTML = '';
        const grade2Span = document.createElement('span');
        grade2Span.textContent = student2.finalGrade || '-';
        grade2Span.className = `grade-badge grade-${getGradeClass(student2.finalGrade)}`;
        student2Grade.appendChild(grade2Span);
        
        // Calculate differences
        const marks1 = parseInt(student1.totalMarks) || 0;
        const marks2 = parseInt(student2.totalMarks) || 0;
        const marksDiff = marks1 - marks2;
        
        const percent1 = parseFloat(student1.totalPercent) || 0;
        const percent2 = parseFloat(student2.totalPercent) || 0;
        const percentDiff = percent1 - percent2;
        
        // Display differences with appropriate styling
        totalMarksDiff.textContent = marksDiff > 0 ? `+${marksDiff}` : marksDiff;
        totalMarksDiff.className = marksDiff > 0 ? 'summary-diff better' : marksDiff < 0 ? 'summary-diff worse' : 'summary-diff neutral';
        
        percentageDiff.textContent = percentDiff > 0 ? `+${percentDiff.toFixed(2)}` : `${percentDiff.toFixed(2)}`;
        percentageDiff.className = percentDiff > 0 ? 'summary-diff better' : percentDiff < 0 ? 'summary-diff worse' : 'summary-diff neutral';
        
        // Clear previous comparison data
        comparisonBody.innerHTML = '';
        
        // Add subject rows for comparison
        const subjectCount = 6; // Based on the sample data
        
        for (let i = 1; i <= subjectCount; i++) {
            const subjectCode1 = student1[`sub_code${i}`];
            const subjectCode2 = student2[`sub_code${i}`];
            
            // Only compare if both students have the same subject
            if (subjectCode1 && subjectCode2 && subjectCode1 === subjectCode2) {
                const row = document.createElement('tr');
                
                // Subject name cell
                const subjectCell = document.createElement('td');
                const subjectName = subjectCodeMapping[subjectCode1] || 'Unknown Subject';
                subjectCell.textContent = `${subjectCode1} (${subjectName})`;
                
                // Student 1 marks cell
                const marks1Cell = document.createElement('td');
                marks1Cell.textContent = student1[`totalmarks${i}`] || '-';
                
                // Student 2 marks cell
                const marks2Cell = document.createElement('td');
                marks2Cell.textContent = student2[`totalmarks${i}`] || '-';
                
                // Difference cell
                const diffCell = document.createElement('td');
                const marks1 = parseInt(student1[`totalmarks${i}`]) || 0;
                const marks2 = parseInt(student2[`totalmarks${i}`]) || 0;
                const diff = marks1 - marks2;
                
                diffCell.textContent = diff > 0 ? `+${diff}` : diff;
                diffCell.className = diff > 0 ? 'diff-better' : diff < 0 ? 'diff-worse' : 'diff-equal';
                
                // Append cells to row
                row.appendChild(subjectCell);
                row.appendChild(marks1Cell);
                row.appendChild(marks2Cell);
                row.appendChild(diffCell);
                
                // Append row to table body
                comparisonBody.appendChild(row);
            }
        }
        
        // Show comparison result section
        comparisonResultSection.style.display = 'block';
    }
    
    // Helper function to format percentage
    function formatPercentage(percentStr) {
        const num = parseFloat(percentStr);
        return num.toFixed(2);
    }
    
    // Helper function to get grade class for styling
    function getGradeClass(grade) {
        if (!grade) return '';
        
        const gradeMap = {
            'O': 'o',
            'A+': 'a-plus',
            'A': 'a',
            'B+': 'b-plus',
            'B': 'b',
            'C': 'c',
            'D': 'd'
        };
        
        return gradeMap[grade] || '';
    }
    
    // Show error message
    function showError(message) {
        document.getElementById('error-text').textContent = message;
        errorMessage.style.display = 'block';
        searchSection.style.display = 'none';
        compareSection.style.display = 'none';
        resultSection.style.display = 'none';
        comparisonResultSection.style.display = 'none';
        loadingElement.style.display = 'none';
    }
    
    // Print button handlers
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    printComparisonBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Download PDF button handler
    downloadBtn.addEventListener('click', function() {
        // Show loading message
        const originalButtonText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        downloadBtn.disabled = true;
        
        // Use setTimeout to allow the UI to update before starting the PDF generation
        setTimeout(() => {
            generateOptimizedPDF().then(() => {
                // Reset button text
                downloadBtn.innerHTML = originalButtonText;
                downloadBtn.disabled = false;
            }).catch(error => {
                console.error('Error generating PDF:', error);
                downloadBtn.innerHTML = originalButtonText;
                downloadBtn.disabled = false;
                alert('Failed to generate PDF. Please try again.');
            });
        }, 100);
    });
    
    // Generate optimized PDF function (smaller file size)
    async function generateOptimizedPDF() {
        const { jsPDF } = window.jspdf;
        
        try {
            // Create a new PDF document with compression
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });
            
            // Get student data
            const name = studentName.textContent;
            const roll = studentRoll.textContent;
            const regNo = studentReg.textContent;
            const msNo = marksheetNo.textContent;
            const instCode = instituteCode.textContent;
            const total = totalMarks.textContent;
            const percent = totalPercent.textContent;
            const grade = finalGrade.textContent.replace(/\s+/g, '');
            const result = resultStatus.textContent;
            
            // Set font sizes
            const titleSize = 16;
            const subtitleSize = 12;
            const normalSize = 10;
            const smallSize = 8;
            
            // Add header
            pdf.setFontSize(titleSize);
            pdf.setFont('helvetica', 'bold');
            pdf.text('West Bengal Council of Higher Secondary Education', 105, 20, { align: 'center' });
            
            pdf.setFontSize(subtitleSize);
            pdf.text('Higher Secondary Examination Result 2025', 105, 30, { align: 'center' });
            
            // Add student info
            pdf.setFontSize(normalSize);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Student Information', 20, 45);
            
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Name: ${name}`, 20, 55);
            pdf.text(`Roll No: ${roll}`, 20, 62);
            pdf.text(`Registration No: ${regNo}`, 20, 69);
            pdf.text(`Marksheet No: ${msNo}`, 120, 55);
            pdf.text(`Institute Code: ${instCode}`, 120, 62);
            
            // Add marks table
            pdf.setFont('helvetica', 'bold');
            pdf.text('Subject-wise Marks', 20, 80);
            
            // Table headers
            pdf.setFillColor(240, 240, 240);
            pdf.rect(20, 85, 170, 8, 'F');
            pdf.setFontSize(smallSize);
            pdf.text('Subject', 22, 90);
            pdf.text('Theory', 70, 90);
            pdf.text('Practical', 90, 90);
            pdf.text('Total', 115, 90);
            pdf.text('Percentage', 135, 90);
            pdf.text('Grade', 165, 90);
            
            // Table rows
            let yPos = 95;
            const rows = marksBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                pdf.setFont('helvetica', 'normal');
                
                // Get subject code and name
                const subjectText = cells[0].textContent.split('(')[0].trim();
                const subjectName = cells[0].textContent.split('(')[1]?.split(')')[0].trim() || '';
                
                // Format subject display for PDF
                let displayText = subjectText;
                if (subjectName) {
                    displayText += ` - ${subjectName}`;
                }
                
                // Limit subject name length to fit in PDF
                if (displayText.length > 25) {
                    displayText = displayText.substring(0, 22) + '...';
                }
                
                pdf.text(displayText, 22, yPos);
                pdf.text(cells[1].textContent, 70, yPos);
                pdf.text(cells[2].textContent, 90, yPos);
                pdf.text(cells[3].textContent, 115, yPos);
                pdf.text(cells[4].textContent, 135, yPos);
                pdf.text(cells[5].textContent.replace(/\s+/g, ''), 165, yPos);
                
                yPos += 8;
            });
            
            // Add total and result
            pdf.setFillColor(240, 240, 240);
            pdf.rect(20, yPos, 170, 8, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.text('Aggregate', 22, yPos + 6);
            pdf.text(total, 115, yPos + 6);
            pdf.text(percent, 135, yPos + 6);
            pdf.text(grade, 165, yPos + 6);
            
            yPos += 15;
            pdf.text(`Result: ${result}`, 105, yPos, { align: 'center' });
            
            // Add footer
            yPos += 20;
            pdf.setFontSize(smallSize);
            pdf.setFont('helvetica', 'italic');
            pdf.text('This is a computer-generated result. No signature is required.', 105, yPos, { align: 'center' });
            
            yPos += 5;
            pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, yPos, { align: 'center' });
            
            // Get student name for the filename
            const studentNameText = name.trim() || 'result';
            const rollNoText = roll.trim() || '';
            
            // Generate filename
            const filename = `${studentNameText.replace(/\s+/g, '_')}_${rollNoText}_HS_Marksheet.pdf`;
            
            // Save the PDF with compression
            pdf.save(filename);
        } catch (error) {
            console.error('Error in PDF generation:', error);
            throw error;
        }
    }
    
    // Back button handlers
    backBtn.addEventListener('click', function() {
        resultSection.style.display = 'none';
        searchSection.style.display = 'block';
        
        // Reset active tab
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === 'search') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    });
    
    compareBackBtn.addEventListener('click', function() {
        comparisonResultSection.style.display = 'none';
        compareSection.style.display = 'block';
        
        // Reset active tab
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === 'compare') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    });
    
    errorBackBtn.addEventListener('click', function() {
        errorMessage.style.display = 'none';
        
        // Show the last active tab section
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        if (activeTab === 'search') {
            searchSection.style.display = 'block';
        } else if (activeTab === 'compare') {
            compareSection.style.display = 'block';
        }
    });
});