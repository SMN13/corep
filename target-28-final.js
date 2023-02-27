looker.plugins.visualizations.add({
    // Id and Label are legacy properties that no longer have any function besides documenting
    // what the visualization used to have. The properties are now set via the manifest
    // form within the admin/visualizations page of Looker
    id: "looker_table",
    label: "Table",
    options: {
        font_size: {
            type: "number",
            label: "Font Size (px)",
            default: 11
        }
    },
    // Set up the initial state of the visualization
    create: function (element, config) {
        console.log(config);
        element.innerHTML = `
      <style>
        #table {
          font-size: ${config.font_size}px;
          border: 1px solid black;
          border-collapse: collapse;
          top :0;
          z-index : 1;
          margin-top:-20px;
        }
      </style>
    `;
        // Create a container element to let us center the text.
        this._container = element.appendChild(document.createElement("div"));
        var table = generateTableHeader();
        element.appendChild(table);
        //element.innerHTML=table;

        //this._container.innerHTML = table;
    },

    updateAsync: function (data, element, config, queryResponse, details, done) {
        console.log(config);
        // Clear any errors from previous updates
        this.clearErrors();

        // Throw some errors and exit if the shape of the data isn't what this chart needs
        if (queryResponse.fields.dimensions.length == 0) {
            this.addError({ title: "No Dimensions", message: "This chart requires dimensions." });
            return;
        }

        // Remove any previous data from the table

        // Create a new table
        var table = document.createElement('table');
        table.id = "data_table";
        table.classList.add('table');

        // Create the table header
        var headerRow = document.createElement('tr');
        headerRow.classList.add('table-header');
        for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
            var headerCell = document.createElement('th');
            headerCell.innerHTML = field.label_short;
            headerRow.appendChild(headerCell);
        }
        table.appendChild(headerRow);

        // Create the table body
        var tableBody = document.createElement('tbody');
        tableBody.classList.add('table-body');

        // Loop through the data
        for (row of data) {
            var tableRow = document.createElement('tr');
            tableRow.classList.add('table-row');
            for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
                var tableCell = document.createElement('td');
                tableCell.innerHTML = LookerCharts.Utils.htmlForCell(row[field.name]);
                tableRow.appendChild(tableCell);
            }
            tableBody.appendChild(tableRow);
        }

        //     table.appendChild(tableBody);
        element.innerHTML = '';
        //     element.appendChild(table);
        //     element.innerHTML+=table.outerHTML;
        let table_data = document.getElementById("table");
        table_data.appendChild(tableBody);

        done();
    }
});

function generateTableHeader() {
    // creates a <table> element and a <tbody> element
    const tbl = document.createElement('table')
    tbl.id = "table";
    tbl.style.position = "absolute";
    tbl.style.top = "0px";
    const tblBody = document.createElement('tbody')
    tblBody.style.position="sticky";
    tblBody.style.top="0px";

    // creating all cells
    for (let i = 0; i < 7; i++) {
        // creates a table row
        const row = document.createElement('tr')

        for (let j = 0; j < 35; j++) {
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            const cell = document.createElement('th')
            if (i == 0) {
                if (j == 0) {
                    cell.setAttribute('colspan', 3)
                    //j = j + 2
                }
                if (j == 1) {
                    cell.setAttribute('colspan', 15)
                    //j = j + 14
                }
                if (j == 2) {
                    cell.setAttribute('rowspan', 35)
                }
                if (j == 3) {
                    cell.setAttribute('rowspan', 35)
                }
                if (j == 4) {
                    cell.setAttribute('colspan', 3)
                    cell.setAttribute('rowspan', 5)
                }
                if (j == 5) {
                    cell.setAttribute('colspan', 8)
                    //j = j + 7
                }
                if (j == 6) {
                    cell.setAttribute('rowspan', 35)
                }
                if (j == 7) {
                    cell.setAttribute('colspan', 3)
                    cell.setAttribute('rowspan', 5)
                }
                if (j > 7) {
                    break
                }
            }
            if (i == 1) {
                if (j == 0 || j == 1 || j == 2) {
                    cell.setAttribute('rowspan', 6)
                    // i = i + 3
                }
                if (j == 4) {
                    cell.setAttribute('rowspan', 4)
                    cell.setAttribute('colspan', 6)
                }
                if (j == 5 || j == 6) {
                    cell.setAttribute('rowspan', 6)
                }
                if (j == 3) {
                    cell.setAttribute('colspan', 15)
                    cell.setAttribute('rowspan', 2)
                }
                if (j > 6) {
                    break
                }
            }
            if (i == 2) {
                if (j == 0) {
                    cell.setAttribute('colspan', 15)
                }
                if (j >= 0) {
                    break
                }
            }
            if (i == 3) {
                if (j == 0) {
                    cell.setAttribute('rowspan', 4)
                }
                if (j == 1) {
                    cell.setAttribute('rowspan', 2)
                }
                if (j == 2) {
                    cell.setAttribute('rowspan', 2)
                    cell.setAttribute('colspan', 6)
                }
                if (j == 3) {
                    cell.setAttribute('rowspan', 2)
                    cell.setAttribute('colspan', 6)
                }
                if (j == 4) {
                    cell.setAttribute('rowspan', 4)
                }
                if (j > 4) {
                    break
                }
            }

            if (i == 4) {
                if (j >= 0) {
                    break
                }
            }
            if (i == 5) {
                if (
                    j == 0 ||
                    j == 1 ||
                    j == 2 ||
                    j == 3 ||
                    j == 5 ||
                    j == 6 ||
                    j == 7 ||
                    j == 9 ||
                    j == 10 ||
                    j == 11 ||
                    j == 12 ||
                    j == 13 ||
                    j == 14 ||
                    j == 16 ||
                    j == 17 ||
                    j == 18
                ) {
                    cell.setAttribute('rowspan', 2)
                }
                if (j == 4 || j == 8 || j == 15) {
                    cell.setAttribute('colspan', 3)
                }
                if (j > 18) {
                    break
                }
            }

            if (i == 6) {
                if (j > 8) {
                    break
                }
            }

            const cellText = document.createTextNode(
                `cell in row ${i}, column ${j}`
            )
            cell.appendChild(cellText)
            row.appendChild(cell)
        }

        // add the row to the end of the table body
        tblBody.appendChild(row)
    }

    // put the <tbody> in the <table>
    tbl.appendChild(tblBody)
    // appends <table> into <body>
    document.body.appendChild(tbl)
    // sets the border attribute of tbl to '2'
    tbl.style.border="1px solid black";
    tbl.style.border-collapse="collapse";
}
