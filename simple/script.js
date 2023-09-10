const rows_per_rect = get_css_variable("--rows-per-rect");
const cols_per_rect = get_css_variable("--cols-per-rect");

let calendar = document.getElementById("calendar");

const life_expectancy = 80;
let numDecades = Math.floor(life_expectancy / 10);
populate_calendar(numDecades);

// fill_calendar("18/09/1987");

/**
* Fill every week, counting from the given bday
* bday format: dd/mm/yyyy
*/
function fill_calendar(bday) {
    // convert from dd/mm/yy to mm/dd/yy
    let [day, month, year] = bday.split("/");
    bday = new Date(`${month}/${day}/${year}`);

    let now = new Date();
    let day_diff = (now - bday) / (1000 * 3600 * 24);

    // 52*7 = 364: each year misses 1 day.
    // adjusting this error
    let years = Math.floor(day_diff / 365);
    let remaining_weeks = Math.floor((day_diff % 365) / 7);

    let num_weeks = years * 26 * 2 + remaining_weeks;

    for (let week = 0; week < num_weeks; week++) {
        paint_week(week);
    }
}

/**
* Fill week cell
*/
function paint_week(num) {
    const week = document.getElementById(`week-${num}`);
    if (week != null) {
        week.style.backgroundColor = get_css_variable("--color-dark-gray");
    }
}

/**
* Set week IDs
*/
function set_ids(numDecades) {
    const weeks_per_year = cols_per_rect * 2;
    const weeks_per_decade = weeks_per_year * 10;

    for (let decade = 0; decade < numDecades; decade++) {
        const decade_weeks = decade * weeks_per_decade;
        for (let rect = 0; rect < 2; rect++) {
            const r = document.getElementById(`rect-${decade}-${rect}`);
            const rect_weeks = rect * cols_per_rect;
            r.childNodes.forEach((cell, index) => {
                let rect_rows = Math.floor(index / 26);
                let offset = index % cols_per_rect;
                let id =
                    decade_weeks + rect_rows * weeks_per_year + rect_weeks + offset;
                cell.id = `week-${id}`;
            });
        }
    }
}

/**
* Fill calendar with week cells
*/
function populate_calendar(numDecades) {
    for (let i = 0; i < numDecades; i++) {
        spawn_decade(i);
    }

    set_ids(numDecades);
}

/**
* Instantiate 2 rectangles
*/
function spawn_decade(decade) {
    for (let i = 0; i < 2; i++) {
        const rect = spawn_rectangle(rows_per_rect, cols_per_rect);
        rect.id = `rect-${decade}-${i}`;
        calendar.appendChild(rect);
    }
}

/**
* Smaller set of cells
*/
function spawn_rectangle(rows, cols) {
    const rect = document.createElement("div");
    rect.classList.add("rect-container");

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            rect.appendChild(spawn_cell());
        }
    }
    return rect;
}

/**
* Cell: single week square
*/
function spawn_cell() {
    const div = document.createElement("div");
    div.classList.add("week-cell");
    div.textContent = "?"; // Add this line to include a question mark
    return div;
}

/**
* wrapper to get CSS variables
*/
function get_css_variable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(
        name
    );
}

function countCells() {
    const cells = document.querySelectorAll('.week-cell');
    const actualWeeks = life_expectancy * 52;  // Assuming 52 weeks per year
    console.log("Total number of cells:", cells.length);
    console.log("Actual number of weeks:", actualWeeks);
  }

countCells();


document.querySelector(".tooltip").addEventListener("mouseover", function() {
    document.getElementById("tooltip-content-id").style.display = "block";
  });

  document.querySelector(".tooltip").addEventListener("mouseout", function() {
    document.getElementById("tooltip-content-id").style.display = "none";
  });

  // Optionally, you can add this to make it work on click as well
  document.querySelector(".tooltip").addEventListener("click", function() {
    const tooltip = document.getElementById("tooltip-content-id");
    tooltip.style.display = (tooltip.style.display === "none" || tooltip.style.display === "") ? "block" : "none";
  });


document.getElementById("generateBtn").addEventListener("click", function() {
    const birthdayInput = document.getElementById("birthday").value;
    const [year, month, day] = birthdayInput.split("-");
    const formattedBirthday = `${day}/${month}/${year}`;
    fill_calendar(formattedBirthday);
  });



document.getElementById("downloadBtn").addEventListener("click", () => {
// Hide elements
    const tooltip = document.querySelector('.tooltip');
    const inputContainer = document.querySelector('.input-container');

    const originalTooltipDisplay = tooltip.style.display;
    const originalInputContainerDisplay = inputContainer.style.display;

    tooltip.style.display = 'none';
    inputContainer.style.display = 'none';

    html2canvas(document.querySelector(".content")).then((canvas) => {
        // Show elements again
        tooltip.style.display = originalTooltipDisplay;
        inputContainer.style.display = originalInputContainerDisplay;

        let anchorTag = document.createElement("a");
        document.body.appendChild(anchorTag);
        anchorTag.download = "mementoMori.png";
        anchorTag.href = canvas.toDataURL();
        anchorTag.target = '_blank';
        anchorTag.click();
    });
});
