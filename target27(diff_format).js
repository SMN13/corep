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
      .table {
        font-size: ${config.font_size}px;
        border: 1px solid black;
        border-collapse: collapse;
        margin: auto;
      }
      .table-header {
        background-color: #eee;
        border: 1px solid black;
        border-collapse: collapse;
        font-weight: normal;
        font-family: 'Verdana';
        font-size: 11px;
        align-items: center;
        text-align: center;
        margin: auto;
        width: 90px;
      }
      .table-cell {
        padding: 5px;
        border-bottom: 1px solid #ccc;
        border: 1px solid black;
        border-collapse: collapse;
        font-family: 'Verdana';
        font-size: 11px;
        align-items: center;
        text-align: center;
        margin: auto;
        width: 90px;
      }
       .table-row {
        border: 1px solid black;
        border-collapse: collapse;
      }
      </style>
    `;
        // Create a container element to let us center the text.
        this._container = element.appendChild(document.createElement("div"));
        var table = generateTableHeader();
        element.appendChild(table);
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

        // Create a new table
        var table = document.createElement('table');
        table.id = "data_table";
        table.classList.add('table');

        // Create the table body
        var tableBody = document.createElement('tbody');

        // Loop through the data
        for (row of data) {
            var tableRow = document.createElement('tr');
            tableRow.classList.add('table-row');
            for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
                var tableCell = document.createElement('td');
                tableCell.classList.add('table-cell');
                tableCell.style.border = "1px solid black";
                tableCell.style.borderCollapse = "collapse";
                tableCell.innerHTML = LookerCharts.Utils.htmlForCell(row[field.name]);
                tableRow.appendChild(tableCell);
            }
            tableBody.appendChild(tableRow);
        }
        let table_data = document.getElementById("table");
        table_data.appendChild(tableBody);

        done();
    }
});

function generateTableHeader() {
    // creates a <table> element and a <tbody> element
    const tbl = document.createElement('table')
    tbl.classList.add('table');
    tbl.id = "table";
    tbl.style.position = "absolute";
    tbl.style.top = "0px";
    tbl.style.margin = 'auto';
    const tblBody = document.createElement('tbody');
    tblBody.style.position = "sticky";
    tblBody.style.top = "0px";

    let k = 0;

    // creating all cells
    for (let i = 0; i < 2; i++) {
        // creates a table row
        const row = document.createElement('tr')
        row.classList.add('table-row');

        for (let j = 0; j < 8; j++) {
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            const cell = document.createElement('th')
            cell.classList.add('table-header');
            cell.style.border = "1px solid black";
            cell.style.borderCollapse = "collapse";
            cell.style.backgroundColor = "#eee";
            if (i == 0) {
                if (j == 0) {
                    cell.setAttribute('colspan', 8)
                    cell.setAttribute('height', '19px')
                    cell.style.fontWeight = 'bold'
                    //j = j + 2
                }
                if (j > 0) {
                    break
                }
            }
            if (i == 1) {
                if (j == 0 || j == 1 || j == 2 || j == 3 || j == 4 || j == 5 || j == 6 || j == 7) {
                    cell.setAttribute('height', '100px')
                    // i = i + 3
                }
            }
            const headers = ['COUNTERPARTY IDENTIFICATION', 'Code', 'Type of Code', 'Name',
                'National Code', 'Residence of the Counterparty', 'Sector of the Counterparty', 'NACE Code',
                'Type of Counterparty']
            const cellText = document.createTextNode(
                `${headers[k]}`
            )
            k++;
            cell.appendChild(cellText)
            row.appendChild(cell)
        }
        // add the row to the end of the table body
        tblBody.appendChild(row)
    }

    const next_row = document.createElement('tr')
    const header = ['011', '015', '021', '035', '040', '050', '060', '070'];
    for (let i = 0; i < header.length; i++) {
        const next_cell = document.createElement('th')
        next_cell.classList.add('table-header');
        next_cell.style.border = "1px solid black";
        next_cell.style.borderCollapse = "collapse";
        next_cell.style.backgroundColor = "#eee";
        const cell_data = document.createTextNode(
            `${header[i]}`
        )
        next_cell.appendChild(cell_data)
        next_row.appendChild(next_cell)
    }
    tblBody.appendChild(next_row)
    // put the <tbody> in the <table>
    tbl.appendChild(tblBody)
    // appends <table> into <body>
    document.body.appendChild(tbl)
    tbl.style.border = "1px solid black";
    tbl.style.borderCollapse = "collapse";
}
