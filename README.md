# Grade Calculator CLI

A powerful, interactive command-line grade calculator for students and teachers. Supports weighted categories, assignment management, and flexible input formats.

![](https://i.imgur.com/ID7KDnU.png)

## Features

- **Simple Grade Calculator**: Enter grades to get average, sum, and assessment.
- **Weighted Grade Calculator**:
  - Organize assignments by category (e.g., Homework, Quizzes, Exams).
  - Assign weights to each category (e.g., Homework 20%, Exams 60%).
  - Add, edit, or remove assignments within categories.
  - Delete entire categories if needed.
  - See a summary of all categories and assignments before calculating.
  - Automatically balances assignment weights within a category.
  - Supports grades as numbers or fractions (e.g., `18/20`).
  - Clear prompts, error messages, and navigation commands (`back`, `done`, etc).
- **Colorful Output**: Uses `chalk` and `gradient-string` for beautiful CLI visuals.

## Installation

1. **Clone or Download** this repository.
2. **Install dependencies**:
   ```sh
   npm install
   ```
3. **Run the app**:
   ```sh
   node .
   ```
   Or use the executable built with `pkg` if available.

## Usage

1. Launch the app: `node .`
2. Choose an option from the main menu:
   - Simple Grade Calculator
   - Weighted Grade Calculator
   - (Future) Exam Score Calculator
3. Follow the prompts:
   - For weighted grades, select or create categories, assign weights, and enter assignments.
   - Use navigation commands at any prompt:
     - `back` – Go back to category selection.
     - `done`/`finish`/`quit` – Finish input and calculate.
     - `d` – Delete a category (when at category selection).
     - `e`/`r`/`a`/`c`/`f` – Edit, Remove, Add more, Change category, or Finish in assignment review.
4. View your results, including detailed breakdowns and color-coded assessments.

## Example

```
$ node .

Weighted Grade Calculator
Enter assignment grades and their weights.

Categories:
[1] Homework (20%)
[2] Exams (60%)
[D] Delete a category
➤ Choose a category number, or type a new category name (or "done" to finish): 1

Assignments in Homework:
[1] HW1 | Grade: 90.00 | Weight: 10.00%
[2] HW2 | Grade: 80.00 | Weight: 10.00%
➤ Assignment/Exam Name for category "Homework" (or type "back" to reselect category, "done" to change category, "finish" to calculate):
...
```

## Dependencies
- [chalk](https://www.npmjs.com/package/chalk)
- [gradient-string](https://www.npmjs.com/package/gradient-string)
- [readline](https://nodejs.org/api/readline.html)

## Building an Executable

If you want a standalone executable:
1. Install [pkg](https://www.npmjs.com/package/pkg):
   ```sh
   npm install -g pkg
   ```
2. Run the build script:
   ```sh
   ./build.bat
   ```
   or manually:
   ```sh
   pkg .
   ```

## License
MIT
