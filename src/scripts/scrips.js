document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('loanForm');
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Obtener valores
                const amount = parseFloat(document.getElementById('amount').value);
                const interest = parseFloat(document.getElementById('interest').value);
                const term = parseInt(document.getElementById('term').value);
                
                // Validar
                if (validateInputs(amount, interest, term)) {
                    // Calcular
                    const results = calculateLoan(amount, interest, term);
                    
                    // Mostrar resultados
                    displayResults(amount, interest, term, results);
                }
            });
            
            function validateInputs(amount, interest, term) {
                let isValid = true;
                
                // Validar monto
                if (isNaN(amount) || amount <= 0) {
                    document.getElementById('amountError').style.display = 'block';
                    isValid = false;
                } else {
                    document.getElementById('amountError').style.display = 'none';
                }
                
                // Validar interés
                if (isNaN(interest) || interest <= 0) {
                    document.getElementById('interestError').style.display = 'block';
                    isValid = false;
                } else {
                    document.getElementById('interestError').style.display = 'none';
                }
                
                // Validar plazo
                if (isNaN(term) || term <= 0) {
                    document.getElementById('termError').style.display = 'block';
                    isValid = false;
                } else {
                    document.getElementById('termError').style.display = 'none';
                }
                
                return isValid;
            }
            
            function calculateLoan(amount, annualInterest, term) {
                const monthlyInterest = annualInterest / 100 / 12;
                const monthlyPayment = amount * 
                    (monthlyInterest * Math.pow(1 + monthlyInterest, term)) / 
                    (Math.pow(1 + monthlyInterest, term) - 1);
                
                let balance = amount;
                let totalInterest = 0;
                const schedule = [];
                
                for (let month = 1; month <= term; month++) {
                    const interestPayment = balance * monthlyInterest;
                    const principalPayment = monthlyPayment - interestPayment;
                    totalInterest += interestPayment;
                    
                    schedule.push({
                        month,
                        payment: monthlyPayment,
                        interest: interestPayment,
                        principal: principalPayment,
                        balance: balance - principalPayment
                    });
                    
                    balance -= principalPayment;
                }
                
                return {
                    monthlyPayment,
                    totalInterest,
                    totalPayment: amount + totalInterest,
                    schedule
                };
            }
            
            function displayResults(amount, interest, term, results) {
                // Mostrar tarjeta de resultados
                document.getElementById('resultsCard').style.display = 'block';
                
                // Actualizar resumen
                document.getElementById('summaryAmount').textContent = formatCurrency(amount);
                document.getElementById('summaryInterest').textContent = interest + '%';
                document.getElementById('summaryTerm').textContent = term + ' meses';
                
                // Actualizar highlights
                document.getElementById('monthlyPayment').textContent = formatCurrency(results.monthlyPayment);
                document.getElementById('totalPayment').textContent = formatCurrency(results.totalPayment);
                document.getElementById('totalInterest').textContent = formatCurrency(results.totalInterest);
                
                // Generar tabla de amortización
                const tbody = document.getElementById('scheduleBody');
                tbody.innerHTML = '';
                
                results.schedule.forEach(item => {
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${item.month}</td>
                        <td class="text-right">${formatCurrency(item.payment)}</td>
                        <td class="text-right">${formatCurrency(item.interest)}</td>
                        <td class="text-right">${formatCurrency(item.principal)}</td>
                        <td class="text-right">${formatCurrency(Math.max(0, item.balance))}</td>
                    `;
                    
                    tbody.appendChild(row);
                });
                
                // Scroll a resultados
                document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth' });
            }
            
            function formatCurrency(value) {
                return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            }
        });