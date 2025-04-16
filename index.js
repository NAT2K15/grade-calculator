const readline = require('readline');
const chalk = require('chalk');
const gradient = require('gradient-string');

// Improved compact title that fits better on screen
const title = `
  _____               _        _____      _      
 / ____|             | |      / ____|    | |     
| |  __ _ __ __ _  __| | ___  | |     ___| | ___ 
| | |_ | '__/ _\` |/ _\` |/ _ \ | |    / __| |/ __|
| |__| | | | (_| | (_| |  __/ | |____| (__| | (__ 
 \_____|_|  \__,_|\__,_|\___|  \_____|\___\_|\___|

`;

// Clear the console for a clean start
console.clear();
console.log(gradient.pastel(title));

const pl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Data structures for different calculator modes
let grades = [];
let weightedAssignments = [];
let categories = [];
let currentMode = '';

// Display the main menu
showMainMenu();

// Main menu to select calculator mode
function showMainMenu() {
    console.clear();
    console.log(gradient.pastel(title));
    console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
    console.log(chalk.yellow('  Welcome to the Advanced Grade Calculator!'));
    console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
    
    console.log(chalk.cyan('  [') + chalk.white('1') + chalk.cyan('] ') + chalk.white('Simple Grade Calculator'));
    console.log(chalk.cyan('  [') + chalk.white('2') + chalk.cyan('] ') + chalk.white('Weighted Grade Calculator'));
    console.log(chalk.cyan('  [') + chalk.white('3') + chalk.cyan('] ') + chalk.white('Exam Score Calculator'));
    console.log(chalk.cyan('  [') + chalk.white('0') + chalk.cyan('] ') + chalk.white('Exit'));
    
    console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
    
    pl.question(chalk.green('➤ Select an option: '), (option) => {
        switch(option) {
            case '1':
                currentMode = 'simple';
                grades = [];
                console.clear();
                console.log(gradient.pastel(title));
                console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
                console.log(chalk.yellow('  Simple Grade Calculator'));
                console.log(chalk.yellow('  Enter your grades one by one. Type a letter when finished.'));
                console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
                addGrade();
                break;
            case '2':
                currentMode = 'weighted';
                weightedAssignments = [];
                console.clear();
                console.log(gradient.pastel(title));
                console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
                console.log(chalk.yellow('  Weighted Grade Calculator'));
                console.log(chalk.yellow('  Enter assignment grades and their weights.'));
                console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
                addWeightedGrade();
                break;
            case '3':
                currentMode = 'exam';
                console.clear();
                console.log(gradient.pastel(title));
                console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
                console.log(chalk.yellow('  Exam Score Calculator'));
                console.log(chalk.yellow('  Calculate what you need on your final exam.'));
                console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
                calculateNeededExamScore();
                break;
            case '0':
                console.log(chalk.yellow('\nThank you for using the Grade Calculator!'));
                pl.close();
                process.exit();
                break;
            default:
                console.log(chalk.red('\nInvalid option. Please try again.'));
                setTimeout(showMainMenu, 1500);
                break;
        }
    });
}

// Helper function to return to main menu
function returnToMenu() {
    console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
    pl.question(chalk.green('Press Enter to return to the main menu...'), () => {
        showMainMenu();
    });
}

// Weighted Grade Calculator
function addWeightedGrade() {
    // Step 1: Pick or create a category first
    if (categories.length > 0) {
        console.log(chalk.cyan('\nCategories:'));
        categories.forEach((cat, idx) => {
            console.log(chalk.cyan(`[${idx + 1}] ${chalk.white(cat.name)} (${chalk.white(cat.weight + '%')})`));
        });
    }
    // Show delete option if categories exist
    if (categories.length > 0) {
        console.log(chalk.cyan('[D] Delete a category'));
    }
    pl.question(chalk.green('➤ Choose a category number, or type a new category name (or "done" to finish): '), (catInput) => {
        const lower = catInput.trim().toLowerCase();
        if (lower === 'done' || lower === 'finish' || lower === 'quit') {
            if (weightedAssignments.length === 0) {
                console.log(chalk.red('No assignments entered!'));
                returnToMenu();
            } else {
                calculateWeightedAverageWithCategories();
                return; // Prevent further prompts
            }
        }
        // Handle delete category
        if (catInput.trim().toLowerCase() === 'd' && categories.length > 0) {
            pl.question(chalk.green('Enter the number of the category to delete: '), (num) => {
                const idx = parseInt(num) - 1;
                if (isNaN(idx) || idx < 0 || idx >= categories.length) {
                    console.log(chalk.red('Invalid category number.'));
                    return addWeightedGrade();
                }
                const catToDelete = categories[idx].name;
                categories.splice(idx, 1);
                // Remove all assignments in that category
                for (let i = weightedAssignments.length - 1; i >= 0; i--) {
                    if (weightedAssignments[i].category === catToDelete) weightedAssignments.splice(i, 1);
                }
                console.log(chalk.yellow(`Category "${catToDelete}" and all its assignments deleted.`));
                return addWeightedGrade();
            });
            return;
        }
        let catName, catWeight;
        if (!isNaN(catInput) && categories[parseInt(catInput) - 1]) {
            catName = categories[parseInt(catInput) - 1].name;
            catWeight = categories[parseInt(catInput) - 1].weight;
            addAssignmentToCategory(catName);
        } else {
            catName = catInput.trim();
            // If category does not exist, ask for its weight
            if (!categories.find(c => c.name === catName)) {
                // Prevent duplicate category names
                if (categories.find(c => c.name.toLowerCase() === catName.toLowerCase())) {
                    console.log(chalk.red('  Category already exists! Please choose another name.'));
                    return addWeightedGrade();
                }
                pl.question(chalk.green(`  ➤ Weight for category "${catName}" (as a percentage, e.g. 20): `), (w) => {
                    if (isNaN(w) || w.trim() === '') {
                        console.log(chalk.red('  Invalid weight. Please enter a number.'));
                        return addWeightedGrade();
                    }
                    categories.push({ name: catName, weight: parseFloat(w) });
                    addAssignmentToCategory(catName);
                });
            } else {
                addAssignmentToCategory(catName);
            }
        }
    });
}

function addAssignmentToCategory(catName) {
    // Show current assignments in this category
    const catAssignments = weightedAssignments.filter(a => a.category === catName);
    if (catAssignments.length > 0) {
        console.log(chalk.cyan(`\nAssignments in ${catName}:`));
        const catWeight = getCategoryWeight(catName);
        const perAssignmentWeight = catAssignments.length > 0 ? (catWeight / catAssignments.length) : 0;
        catAssignments.forEach((item, idx) => {
            console.log(chalk.cyan(`[${idx + 1}] ${chalk.white(item.name)} | Grade: ${chalk.white(item.grade.toFixed(2))} | Weight: ${chalk.white(perAssignmentWeight.toFixed(2) + '%')}`));
        });
    }
    pl.question(chalk.green(`➤ Assignment/Exam Name for category "${catName}" (or type "back" to reselect category, "done" to change category, "finish" to calculate): `), (name) => {
        const lower = name.trim().toLowerCase();
        if (lower === 'back') {
            return addWeightedGrade();
        }
        if (lower === 'done' || lower === 'change') {
            return addWeightedGrade();
        }
        if (lower === 'finish' || lower === 'quit') {
            if (weightedAssignments.length === 0) {
                console.log(chalk.red('No assignments entered!'));
                returnToMenu();
            } else {
                calculateWeightedAverageWithCategories();
            }
            return;
        }
        if (!isNaN(name)) {
            console.log(chalk.red('Please enter a valid name.'));
            return addAssignmentToCategory(catName);
        }
        pl.question(chalk.green('  ➤ Grade for "' + name + '": '), (gradeInput) => {
            let gradeValue = null;
            if (gradeInput.includes('/')) {
                // Parse as fraction
                const parts = gradeInput.split('/');
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parseFloat(parts[1]) !== 0) {
                    gradeValue = (parseFloat(parts[0]) / parseFloat(parts[1])) * 100;
                } else {
                    console.log(chalk.red('  Invalid fraction. Please enter as number or fraction (e.g., 2.5/5).'));
                    return addAssignmentToCategory(catName);
                }
            } else if (!isNaN(gradeInput) && gradeInput.trim() !== '') {
                gradeValue = parseFloat(gradeInput);
            } else {
                console.log(chalk.red('  Invalid grade. Please enter a number or fraction (e.g., 2.5/5).'));
                return addAssignmentToCategory(catName);
            }
            weightedAssignments.push({
                name: name.trim(),
                grade: parseFloat(gradeValue),
                category: catName
            });
            console.log(chalk.blue(`  Added: ${chalk.white(name)} - Grade: ${chalk.white(gradeValue)} - Category: ${chalk.white(catName)}`));
            // After adding, ask if they want to add more, edit, remove, or finish
            reviewOrAddMore(catName);
        });
    });
}

function reviewOrAddMore(catName) {
    console.log(chalk.cyan('\n[E] Edit an assignment  [R] Remove an assignment  [A] Add more  [C] Change category  [F] Finish & Calculate'));
    pl.question(chalk.green('Choose an option (E/R/A/C/F): '), (opt) => {
        const o = opt.trim().toLowerCase();
        if (o === 'e') {
            editWeightedAssignment(catName);
            return;
        } else if (o === 'r') {
            removeWeightedAssignment(catName);
            return;
        } else if (o === 'a') {
            return addAssignmentToCategory(catName);
        } else if (o === 'c') {
            return addWeightedGrade();
        } else if (o === 'f') {
            if (weightedAssignments.length === 0) {
                console.log(chalk.red('No assignments entered!'));
                returnToMenu();
            } else {
                calculateWeightedAverageWithCategories();
            }
            return;
        } else {
            return reviewOrAddMore(catName);
        }
    });
}

function editWeightedAssignment(catName) {
    const catAssignments = weightedAssignments.filter(a => a.category === catName);
    if (catAssignments.length === 0) {
        console.log(chalk.red('No assignments to edit in this category.'));
        return reviewOrAddMore(catName);
    }
    pl.question(chalk.green('Enter the number of the assignment to edit: '), (num) => {
        const idx = parseInt(num) - 1;
        if (isNaN(idx) || idx < 0 || idx >= catAssignments.length) {
            console.log(chalk.red('Invalid assignment number.'));
            return reviewOrAddMore(catName);
        }
        const item = catAssignments[idx];
        pl.question(chalk.green(`New name (or Enter to keep "${item.name}"): `), (newName) => {
            if (newName.trim() !== '') item.name = newName.trim();
            pl.question(chalk.green(`New grade (or Enter to keep ${item.grade}): `), (newGrade) => {
                if (newGrade.trim() !== '') {
                    if (newGrade.includes('/')) {
                        const parts = newGrade.split('/');
                        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parseFloat(parts[1]) !== 0) {
                            item.grade = (parseFloat(parts[0]) / parseFloat(parts[1])) * 100;
                        } else {
                            console.log(chalk.red('Invalid fraction.')); return reviewOrAddMore(catName);
                        }
                    } else if (!isNaN(newGrade)) {
                        item.grade = parseFloat(newGrade);
                    } else {
                        console.log(chalk.red('Invalid grade.')); return reviewOrAddMore(catName);
                    }
                }
                reviewOrAddMore(catName);
            });
        });
    });
}

function removeWeightedAssignment(catName) {
    const catAssignments = weightedAssignments.filter(a => a.category === catName);
    if (catAssignments.length === 0) {
        console.log(chalk.red('No assignments to remove in this category.'));
        return reviewOrAddMore(catName);
    }
    pl.question(chalk.green('Enter the number of the assignment to remove: '), (num) => {
        const idx = parseInt(num) - 1;
        if (isNaN(idx) || idx < 0 || idx >= catAssignments.length) {
            console.log(chalk.red('Invalid assignment number.'));
            return reviewOrAddMore(catName);
        }
        // Remove from main array
        const globalIdx = weightedAssignments.findIndex(a => a.category === catName && a.name === catAssignments[idx].name && a.grade === catAssignments[idx].grade);
        if (globalIdx !== -1) weightedAssignments.splice(globalIdx, 1);
        reviewOrAddMore(catName);
    });
}


function getCategoryWeight(catName) {
    const cat = categories.find(c => c.name === catName);
    return cat ? cat.weight : 0;
}

function editWeightedAssignment() {
    pl.question(chalk.green('Enter the number of the assignment to edit: '), (num) => {
        const idx = parseInt(num) - 1;
        if (isNaN(idx) || idx < 0 || idx >= weightedAssignments.length) {
            console.log(chalk.red('Invalid assignment number.'));
            return addWeightedGrade();
        }
        const item = weightedAssignments[idx];
        pl.question(chalk.green(`New name (or Enter to keep "${item.name}"): `), (newName) => {
            if (newName.trim() !== '') item.name = newName.trim();
            pl.question(chalk.green(`New grade (or Enter to keep ${item.grade}): `), (newGrade) => {
                if (newGrade.trim() !== '') {
                    if (newGrade.includes('/')) {
                        const parts = newGrade.split('/');
                        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parseFloat(parts[1]) !== 0) {
                            item.grade = (parseFloat(parts[0]) / parseFloat(parts[1])) * 100;
                        } else {
                            console.log(chalk.red('Invalid fraction.')); return addWeightedGrade();
                        }
                    } else if (!isNaN(newGrade)) {
                        item.grade = parseFloat(newGrade);
                    } else {
                        console.log(chalk.red('Invalid grade.')); return addWeightedGrade();
                    }
                }
                pl.question(chalk.green(`New category (or Enter to keep "${item.category}"): `), (newCat) => {
                    if (newCat.trim() !== '') item.category = newCat.trim();
                    addWeightedGrade();
                });
            });
        });
    });
}

function removeWeightedAssignment() {
    pl.question(chalk.green('Enter the number of the assignment to remove: '), (num) => {
        const idx = parseInt(num) - 1;
        if (isNaN(idx) || idx < 0 || idx >= weightedAssignments.length) {
            console.log(chalk.red('Invalid assignment number.'));
            return addWeightedGrade();
        }
        weightedAssignments.splice(idx, 1);
        addWeightedGrade();
    });
}

// Category-based weighted average calculation
function calculateWeightedAverageWithCategories() {
    // Show summary before calculation
    console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━ SUMMARY ━━━━━━━━━━━━━━━━━━━━━━'));
    categories.forEach((cat, idx) => {
        const catAssignments = weightedAssignments.filter(a => a.category === cat.name);
        console.log(chalk.yellow(`[${idx + 1}] ${cat.name} (${cat.weight}%)`));
        if (catAssignments.length === 0) {
            console.log(chalk.red('  (No assignments in this category)'));
        } else {
            const perWeight = (cat.weight / catAssignments.length).toFixed(2);
            catAssignments.forEach((item, i) => {
                console.log(chalk.cyan(`  [${i + 1}] ${chalk.white(item.name)} | Grade: ${chalk.white(item.grade.toFixed(2))} | Weight: ${chalk.white(perWeight + '%')}`));
            });
        }
    });
    pl.question(chalk.green('Proceed to calculate? (y/n): '), (ans) => {
        if (ans.trim().toLowerCase() !== 'y') {
            return addWeightedGrade();
        }
        showSpinner(chalk.magenta('Calculating weighted average...'), 1500, () => {
            // Group assignments by category
            let catMap = {};
            weightedAssignments.forEach(item => {
                if (!catMap[item.category]) catMap[item.category] = [];
                catMap[item.category].push(item.grade);
            });
            let totalWeight = 0;
            let weightedSum = 0;
            console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
            console.log(chalk.magenta('\n📊 CATEGORY WEIGHTED RESULTS 📊\n'));
            // Print table
            console.log(chalk.yellow('Your categories:'));
            console.log(chalk.cyan('┌──────────────┬────────┬─────────┐'));
            console.log(chalk.cyan('│ Category     │ Avg    │ Weight  │'));
            console.log(chalk.cyan('├──────────────┼────────┼─────────┤'));
            Object.keys(catMap).forEach(cat => {
                const avg = catMap[cat].reduce((a, b) => a + b, 0) / catMap[cat].length;
                const weight = getCategoryWeight(cat);
                totalWeight += weight;
                weightedSum += avg * (weight / 100);
                const gradeColor = getGradeColor(avg);
                console.log(
                    chalk.cyan('│ ') + chalk.white(cat.padEnd(12)) +
                    chalk.cyan(' │ ') + gradeColor(avg.toFixed(1).padEnd(6)) +
                    chalk.cyan(' │ ') + chalk.white((weight + '%').padEnd(7)) + chalk.cyan(' │')
                );
            });
            console.log(chalk.cyan('├──────────────┼────────┼─────────┤'));
            console.log(chalk.cyan('│ ') + chalk.yellow('TOTAL WEIGHT').padEnd(12) + chalk.cyan(' │ ') + chalk.yellow('      ') + chalk.cyan(' │ ') + chalk.yellow(totalWeight.toFixed(1).padEnd(7)) + chalk.cyan(' │'));
            console.log(chalk.cyan('└──────────────┴────────┴─────────┘'));
            if (totalWeight < 100) {
                const missing = 100 - totalWeight;
                const currentPortionAverage = (totalWeight > 0) ? (weightedSum / (totalWeight / 100)) : 0;
                console.log(chalk.yellow(`\nYour average for the ${totalWeight.toFixed(1)}% of the course you've entered is: `)
                    + getGradeColor(currentPortionAverage)(currentPortionAverage.toFixed(2)));
                console.log(chalk.red(`⚠️  You are missing ${missing.toFixed(1)}% of the course weight.`));
            } else if (totalWeight > 100) {
                console.log(chalk.red(`\n⚠️  Warning: Total weight is ${totalWeight}%. It should be 100%.`));
                console.log(chalk.yellow(`Weighted Average (using all weights): `) + getGradeColor(weightedSum)(weightedSum.toFixed(2)));
            } else {
                console.log(chalk.yellow(`\nWeighted Average: `) + getGradeColor(weightedSum)(weightedSum.toFixed(2)));
            }
            // Show grade assessment (always use the weightedSum as the assessment)
            console.log('\n' + getGradeAssessment(weightedSum));
            // Reset for next use
            categories = [];
            weightedAssignments = [];
            returnToMenu();
        });
    });

    pl.question(chalk.green('➤ Assignment/Exam Name (or type "done", "finish", or "quit" to stop): '), (name) => {
        const lower = name.trim().toLowerCase();
        if (lower === 'done' || lower === 'finish' || lower === 'quit') {
            if (weightedAssignments.length === 0) {
                console.log(chalk.red('No assignments entered!'));
                returnToMenu();
            } else {
                calculateWeightedAverage();
            }
            return;
        }
        if (!isNaN(name)) {
            // If user enters a number, prompt again for a string
            console.log(chalk.red('Please enter a valid name.'));
            return addWeightedGrade();
        }
        pl.question(chalk.green('  ➤ Grade for "' + name + '": '), (gradeInput) => {
            let gradeValue = null;
            if (gradeInput.includes('/')) {
                // Parse as fraction
                const parts = gradeInput.split('/');
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parseFloat(parts[1]) !== 0) {
                    gradeValue = (parseFloat(parts[0]) / parseFloat(parts[1])) * 100;
                } else {
                    console.log(chalk.red('  Invalid fraction. Please enter as number or fraction (e.g., 2.5/5).'));
                    return addWeightedGrade();
                }
            } else if (!isNaN(gradeInput) && gradeInput.trim() !== '') {
                gradeValue = parseFloat(gradeInput);
            } else {
                console.log(chalk.red('  Invalid grade. Please enter a number or fraction (e.g., 2.5/5).'));
                return addWeightedGrade();
            }
            pl.question(chalk.green('  ➤ Weight for "' + name + '" (as a percentage, e.g. 20): '), (weight) => {
                if (isNaN(weight) || weight.trim() === '') {
                    console.log(chalk.red('  Invalid weight. Please enter a number.'));
                    return addWeightedGrade();
                }
                weightedAssignments.push({
                    name: name.trim(),
                    grade: parseFloat(gradeValue),
                    weight: parseFloat(weight)
                });
                console.log(chalk.blue(`  Added: ${chalk.white(name)} - Grade: ${chalk.white(gradeValue)} - Weight: ${chalk.white(weight)}%`));
                addWeightedGrade();
            });
        });
    });
}

function calculateWeightedAverage() {
    showSpinner(chalk.magenta('Calculating weighted average...'), 1500, () => {
        let totalWeight = 0;
        let weightedSum = 0;
        console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log(chalk.magenta('\n📊 WEIGHTED RESULTS 📊\n'));
        // Print table
        console.log(chalk.yellow('Your assignments/exams:'));
        console.log(chalk.cyan('┌──────────────┬────────┬─────────┐'));
        console.log(chalk.cyan('│ Name         │ Grade  │ Weight  │'));
        console.log(chalk.cyan('├──────────────┼────────┼─────────┤'));
        weightedAssignments.forEach((item) => {
            totalWeight += item.weight;
            weightedSum += item.grade * (item.weight / 100);
            const gradeColor = getGradeColor(item.grade);
            console.log(
                chalk.cyan('│ ') + chalk.white(item.name.padEnd(12)) +
                chalk.cyan(' │ ') + gradeColor(item.grade.toFixed(1).padEnd(6)) +
                chalk.cyan(' │ ') + chalk.white((item.weight + '%').padEnd(7)) + chalk.cyan(' │')
            );
        });
        console.log(chalk.cyan('├──────────────┼────────┼─────────┤'));
        console.log(chalk.cyan('│ ') + chalk.yellow('TOTAL WEIGHT').padEnd(12) + chalk.cyan(' │ ') + chalk.yellow('      ') + chalk.cyan(' │ ') + chalk.yellow(totalWeight.toFixed(1).padEnd(7)) + chalk.cyan(' │'));
        console.log(chalk.cyan('└──────────────┴────────┴─────────┘'));

        if (totalWeight < 100) {
            const missing = 100 - totalWeight;
            // Calculate the "current average" for the portion entered
            const currentPortionAverage = (totalWeight > 0) ? (weightedSum / (totalWeight / 100)) : 0;
            console.log(chalk.yellow(`\nYour average for the ${totalWeight.toFixed(1)}% of the course you've entered is: `)
                + getGradeColor(currentPortionAverage)(currentPortionAverage.toFixed(2)));
            console.log(chalk.red(`⚠️  You are missing ${missing.toFixed(1)}% of the course weight.`));
        } else if (totalWeight > 100) {
            console.log(chalk.red(`\n⚠️  Warning: Total weight is ${totalWeight}%. It should be 100%.`));
            console.log(chalk.yellow(`Weighted Average (using all weights): `) + getGradeColor(weightedSum)(weightedSum.toFixed(2)));
        } else {
            console.log(chalk.yellow(`\nWeighted Average: `) + getGradeColor(weightedSum)(weightedSum.toFixed(2)));
        }
        // Show grade assessment (always use the weightedSum as the assessment)
        console.log('\n' + getGradeAssessment(weightedSum));
        returnToMenu();
    });
}

// Exam Score Calculator
function calculateNeededExamScore() {
    pl.question(chalk.green('➤ Current overall grade (excluding final exam): '), (current) => {
        if (isNaN(current) || current.trim() === '') {
            console.log(chalk.red('  Invalid grade. Please enter a number.'));
            return calculateNeededExamScore();
        }
        pl.question(chalk.green('➤ Weight of final exam (as a percentage, e.g. 40): '), (weight) => {
            if (isNaN(weight) || weight.trim() === '') {
                console.log(chalk.red('  Invalid weight. Please enter a number.'));
                return calculateNeededExamScore();
            }
            pl.question(chalk.green('➤ Desired final course grade: '), (desired) => {
                if (isNaN(desired) || desired.trim() === '') {
                    console.log(chalk.red('  Invalid desired grade. Please enter a number.'));
                    return calculateNeededExamScore();
                }
                showSpinner(chalk.magenta('Calculating required exam mark...'), 1500, () => {
                    const currentNum = parseFloat(current);
                    const weightNum = parseFloat(weight);
                    const desiredNum = parseFloat(desired);
                    if (weightNum <= 0 || weightNum > 100) {
                        console.log(chalk.red('  Exam weight must be between 0 and 100.'));
                        return returnToMenu();
                    }
                    const weightFraction = weightNum / 100;
                    // Formula: requiredExam = (desired - current * (1 - weightFraction)) / weightFraction
                    const requiredExam = (desiredNum - currentNum * (1 - weightFraction)) / weightFraction;
                    console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
                    console.log(chalk.magenta('\n📊 REQUIRED EXAM MARK 📊\n'));
                    if (requiredExam > 100) {
                        console.log(chalk.red(`You need a ${requiredExam.toFixed(2)}% on the final exam to reach your goal. This is above 100%!`));
                    } else if (requiredExam < 0) {
                        console.log(chalk.green(`You need a ${requiredExam.toFixed(2)}% on the final exam. You have already secured your desired grade!`));
                    } else {
                        console.log(chalk.yellow(`You need a ${requiredExam.toFixed(2)}% on the final exam to achieve a final grade of ${desiredNum}%.`));
                    }
                    returnToMenu();
                });
            });
        });
    });
}


// Simple grade calculator functions
function addGrade() {
    pl.question(chalk.green('➤ Add a grade to the list ') + chalk.gray('(or type any letter to finish): '), (grade) => {
        if(isNaN(grade)) {
            calculateAverage();
        } else {
            const numGrade = parseFloat(grade);
            grades.push(numGrade);
            console.log(chalk.blue(`  Grade ${chalk.white(numGrade)} added! ${getGradeEmoji(numGrade)} [Total: ${grades.length} grades]`));
            addGrade();
        }
    });
}

function getGradeEmoji(grade) {
    if (grade >= 90) return '🌟';
    if (grade >= 80) return '😃';
    if (grade >= 70) return '😊';
    if (grade >= 60) return '😐';
    return '😢';
}

function showSpinner(message, duration, callback) {
    const spinnerChars = ['|', '/', '-', '\\'];
    let i = 0;
    process.stdout.write(message);
    const spinner = setInterval(() => {
        process.stdout.write('\r' + message + ' ' + spinnerChars[i++ % spinnerChars.length]);
    }, 100);
    setTimeout(() => {
        clearInterval(spinner);
        process.stdout.write('\r' + ' '.repeat(message.length + 2) + '\r'); // Clear spinner line
        callback();
    }, duration);
}

function calculateAverage() {
    showSpinner(chalk.magenta('Calculating average...'), 1500, () => {
        console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log(chalk.magenta('\n📊 RESULTS 📊\n'));
        
        if (grades.length === 0) {
            console.log(chalk.red('No grades were entered!'));
            process.exit();
        }
        
        let sum = 0;
        for (let i = 0; i < grades.length; i++) {
            sum += grades[i];
        }
        
        const average = sum / grades.length;
        
        // Print grades in a nice table format
        console.log(chalk.yellow('Your grades:'));
        console.log(chalk.cyan('┌─────────┬────────┐'));
        console.log(chalk.cyan('│ ') + chalk.white(' # ') + chalk.cyan('     │ ') + chalk.white(' Grade ') + chalk.cyan(' │'));
        console.log(chalk.cyan('├─────────┼────────┤'));
        
        grades.forEach((grade, index) => {
            const gradeColor = getGradeColor(grade);
            console.log(chalk.cyan('│ ') + chalk.white(` ${(index + 1).toString().padEnd(7)} `) + 
                       chalk.cyan('│ ') + gradeColor(` ${grade.toFixed(1).padEnd(6)} `) + chalk.cyan(' │'));
        });
        
        console.log(chalk.cyan('├─────────┼────────┤'));
        console.log(chalk.cyan('│ ') + chalk.yellow(' TOTAL   ') + chalk.cyan('│ ') + chalk.yellow(` ${grades.length.toString().padEnd(6)} `) + chalk.cyan(' │'));
        console.log(chalk.cyan('│ ') + chalk.yellow(' SUM     ') + chalk.cyan('│ ') + chalk.yellow(` ${sum.toFixed(1).padEnd(6)} `) + chalk.cyan(' │'));
        console.log(chalk.cyan('│ ') + chalk.yellow(' AVERAGE ') + chalk.cyan('│ ') + getGradeColor(average)(` ${average.toFixed(2).padEnd(6)} `) + chalk.cyan(' │'));
        console.log(chalk.cyan('└─────────┴────────┘'));
        
        // Show grade assessment
        console.log('\n' + getGradeAssessment(average));
        
        console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
        returnToMenu();
    });
}

function getGradeColor(grade) {
    if (grade >= 90) return chalk.green;
    if (grade >= 80) return chalk.blue;
    if (grade >= 70) return chalk.yellow;
    if (grade >= 60) return chalk.magenta;
    return chalk.red;
}

function getGradeAssessment(average) {
    // Simple ASCII art messages instead of figlet
    const excellent = `
  _____         _ _         _   _ 
 | ____|_  ____| | | ___ _ | | | |
 |  _| \ \/ / _\ | |/ _ \ | | | |
 | |___ >  < (_| | |  __/ |_| |_|
 |_____/_/\_\__,_|_|\___|\___/(_)

`;

    const greatJob = `
   ____                _     _       _     _ 
  / ___|_ __ ___  __ _| |_  | | ___ | |__ | |
 | |  _| '__/ _ \/ _\ | __| | |/ _ \| '_ \| |
 | |_| | | |  __/ (_| | |_  | | (_) | |_) |_|
  \____|_|  \___|\__,_|\__| |_|\___/|_.__/(_)

`;

    const goodWork = `
   ____                 _  __        __         _     _ 
  / ___| ___   ___   __| | \ \      / /__  _ __| | __| |
 | |  _ / _ \ / _ \ / _\ |  \ \ /\ / / _ \| '__| |/ _\ |
 | |_| | (_) | (_) | (_| |   \ V  V / (_) | |  | | (_| |
  \____|\___/ \___/ \__,_|    \_/\_/ \___/|_|  |_|\__,_|

`;

    const passed = `
  ____                        _ _ 
 |  _ \ __ _ ___ ___  ___  __| | |
 | |_) / _\ / __/ __|/ _ \/ _\ | |
 |  __/ (_| \__ \__ \  __/ (_| |_|
 |_|   \__,_|___/___/\___|\__,_(_)

`;

    const tryAgain = `
  _____               _                _       _ 
 |_   _| _ _  _    / \   __ _  __ _(_)_ __  | |
   | || '_| || |  / _ \ / _\ |/ _\ | | '_ \ |_|
   | || |  \_, | / ___ \ (_| | (_| | | | | |(_)
   |_||_|  |__/ /_/   \_\__, |\__,_|_|_| |_|
                         |___/

`;

    if (average >= 90) return gradient.pastel(excellent);
    if (average >= 80) return gradient.summer(greatJob);
    if (average >= 70) return gradient.atlas(goodWork);
    if (average >= 60) return gradient.fruit(passed);
    return gradient.vice(tryAgain);
}
