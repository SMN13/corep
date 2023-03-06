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
    // Insert a <style> tag with some styles we'll use later.
    element.innerHTML = `
        <style>
          .table {
            font-size: ${config.font_size}px;
            border: 1px solid black;
            border-collapse: collapse;
            margin:auto;
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
            background-clip: padding-box;
          }
          .table-cell {
            padding: 5px;
            border-bottom: 1px solid #ccc;
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
          .text-cell {
            mso-number-format: \@;
          }
        </style>
      `;
    // Create a container element to let us center the text.
    this._container = element.appendChild(document.createElement("div"));
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = 'sandbox allow-downloads';
    document.head.appendChild(meta);
  },

  addDownloadButtonListener: function () {
    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = 'Download as Excel';
    downloadButton.className = 'download-button';   
    this._container.prepend(downloadButton);
    downloadButton.addEventListener('click', (event) => {
          var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{Worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
            , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function (s, c) {
              const regex = /style="([^"]*)"/g;
              return s.replace(/{(\w+)}/g, function (m, p) {
                const cellHtml = c[p];
                const cellHtmlWithStyle = cellHtml.replace(regex, function (m, p1) {
                  return 'style="' + p1 + '"';
                });
                return cellHtmlWithStyle;
              });
            };
         // Create a new style element and set the default styles
        var table = document.querySelector('table');  
      // table.style.type = 'text/css';
      // table.style.innerHTML = 'td, th { background-color: white; border: 1px solid black; font-weight: normal; font-size: 11pt; font-family: Calibri; mso-number-format: "\\\@"; }';
         
      var rows = table.rows;
        for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].cells;
        for (var j = 0; j < cells.length; j++) {
          var cell = cells[j];
          
        //   cell.setAttribute('style');
         }
        }
          const XLSX = document.createElement('script');
          XLSX.src = 'https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js';
          document.head.appendChild(XLSX);
          var ctx = { Worksheet: '26', table: table.innerHTML }
          var xl = format(template, ctx);
          const downloadUrl = uri + base64(xl);
          console.log(downloadUrl); // Prints the download URL to the console
          //sleep(1000);
          //window.open(downloadUrl);
          window.open(downloadUrl, "_blank");
          //setTimeout(window.open(downloadUrl, 'Download'),1000);
        });
      },

  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {
    console.log(config);
    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({ title: "No Dimensions", message: "This chart requires dimensions." });
      return;
    }

    /* Code to generate table
     * In keeping with the spirit of this little visualization plugin,
     * it's done in a quick and dirty way: piece together HTML strings.
     */
    var generatedHTML = `
      <style>
        .table {
          font-size: ${config.font_size}px;
          border: 1px solid black;
          border-collapse: collapse;
          margin:auto;
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
          background-clip: padding-box;
        }
        .table-cell {
          padding: 5px;
          border-bottom: 1px solid #ccc;
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
        .table-row {
          border: 1px solid black;
          border-collapse: collapse;
        }
        .text-cell {
            mso-number-format: \@;
          }
  </style>
  `;
    var k = 0;
    for (column_type of ["dimension_like", "measure_like", "table_calculations"]) {
      for (field of queryResponse.fields[column_type]) {
        for (row of data) {
          k++;
        }
        break
      }
    }

    generatedHTML += "<p style='font-family:Verdana;width:100%;font-weight:bold;font-size:14px;align-items:center;text-align:left;border:1px solid black;padding: 5px;background-color: #eee;'>C 26.00 - Large Exposures limits (LE Limits)</p>";
    generatedHTML += "<p style='font-family:Verdana;font-size:10px;align-items: center;text-align: right;padding: 5px;'>* All values reported are in millions </p>";
    generatedHTML += `<table class='table'>`;
    generatedHTML += "<tr class='table-header'>";
    generatedHTML += `<th class='table-header' rowspan='2' colspan='2' style='border: 1px solid black;background-color: #eee;color: #eee'>t</th>`;
    generatedHTML += `<th class='table-header' rowspan='1' colspan='${k}' style='height: 40px;border: 1px solid black;background-color: #eee;font-family: Verdana;'><b>Applicable<br>limit</br></b></th>`;
    generatedHTML += "</tr>";

    generatedHTML += "<tr class='table-header'>";
    generatedHTML += `<th class='table-header text-cell' colspan='${k}' style='border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'> 010 </th>`;
    generatedHTML += "</tr>";

    const header = ['Non institutions', 'Institutions', 'Institutions in %', 'Globally Systemic Important Institutions (G-SIIs)'];

    // Loop through the different types of column types looker exposes
    let i = 0;
    const header1 = ['010', '020', '030', '040'];
    for (column_type of ["dimension_like", "measure_like", "table_calculations"]) {

      // Look through each field (i.e. row of data)
      for (field of queryResponse.fields[column_type]) {
        // First column is the label
        generatedHTML += `<tr><th class='table-header' style='border: 1px solid black;width:35px;background-color: #eee;font-family: Verdana;font-weight: normal;'>${header1[i]}</th>`;
        generatedHTML += `<th class='table-header' style='text-align: left; padding: 5px;width:350px;border: 1px solid black;background-color: #eee;font-family: Verdana;font-weight: normal;'>${header[i]}</th>`;
        // Next columns are the data
        for (row of data) {
          generatedHTML += `<td class='table-cell' style='border: 1px solid black;'>${LookerCharts.Utils.htmlForCell(row[field.name])}</td>`
        }
        generatedHTML += '</tr>';
        i++;
      }
    }
    generatedHTML += "</table>";
    this._container.innerHTML = generatedHTML;
    this.addDownloadButtonListener();

    done();
  }

});
