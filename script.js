document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchForm = document.getElementById('search-form');
    const searchSection = document.getElementById('search-section');
    const resultSection = document.getElementById('result-section');
    const loadingElement = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const printBtn = document.getElementById('print-btn');
    const downloadBtn = document.getElementById('download-btn');
    const backBtn = document.getElementById('back-btn');
    const errorBackBtn = document.getElementById('error-back-btn');
    const generationDate = document.getElementById('generation-date');
    
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
    
    // Subject code mapping for display names
    const subjectCodeMapping = {
        'BNGA': 'Bengali',
        'ENGB': 'English',
        'HMFR': 'Home Management & Family Resource',
        'NUTN': 'Nutrition',
        'PSYC': 'Psychology',
        'COMA': 'Computer Application',
        'PHYS': 'Physics',
        'CHEM': 'Chemistry',
        'MATH': 'Mathematics',
        'BIOL': 'Biology',
        'HIST': 'History',
        'GEOG': 'Geography',
        'POLS': 'Political Science',
        'ECON': 'Economics',
        'EDCN': 'Education',
        'PHIL': 'Philosophy',
        'SOCG': 'Sociology'
    };
    
    // Form submission handler
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
        fetchResult(rollNo, regNo);
    });
    
    // Fetch result from API
    function fetchResult(rollNo, regNo) {
        // For demo purposes, we'll use the sample data provided
        // In a real application, you would make an actual API call
        
        
        fetch(`https://boardresultapi.abplive.com/wb/2025/12/${rollNo}/${regNo}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Result not found');
                }
                return response.json();
            })
            .then(data => {
                displayResult(data);
            })
            .catch(error => {
                showError('No result found. Please check your Roll Number and Registration Number.');
            })
            .finally(() => {
                loadingElement.style.display = 'none';
            });
        
    }
    
    // Display result data
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
                const subjectName = subjectCodeMapping[subjectCode] || subjectCode;
                subjectCell.textContent = `${subjectCode} (${subjectName})`;
                
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
                    percentCell.textContent = formatPercentage(percentage) + '%';
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
            totalPercent.textContent = formatPercentage(data.totalPercent) + '%';
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
        resultSection.style.display = 'none';
        loadingElement.style.display = 'none';
    }
    
    // Print button handler
    printBtn.addEventListener('click', function() {
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
            const grade = finalGrade.textContent;
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
                
                // Limit subject name length to fit in PDF
                let subjectText = cells[0].textContent;
                if (subjectText.length > 25) {
                    subjectText = subjectText.substring(0, 22) + '...';
                }
                
                pdf.text(subjectText, 22, yPos);
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
            pdf.text(grade.replace(/\s+/g, ''), 165, yPos + 6);
            
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
    });
    
    errorBackBtn.addEventListener('click', function() {
        errorMessage.style.display = 'none';
        searchSection.style.display = 'block';
    });
});