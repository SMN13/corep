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
        .thead{
          position: sticky;
          top: 0px; 
          z-index: 3;
        }
        th:before {
          content: '';
          top: 0;
          left: 0;
          border-top: 1px solid black;
          position: absolute;
          width: 100%;
      }
       th:after {
        content:''; 
        position:absolute; 
        left: 0; 
        bottom: 0; 
        width:100%; 
        border-bottom: 1px solid rgba(0,0,0,0.12);
      }
      .div{
        overflow-y: auto;
        height: calc(100vh - 100px);
        margin-bottom: 100px;
      }
      </style>
    `;

    // Create a container element to let us center the text.
    const div = document.createElement("div");
    div.classList.add('div');
    this._container = element.appendChild(div);

  },
 
  addDownloadButtonListener: function () {
    const downloadButton = this._container.appendChild(document.createElement('button'));
    downloadButton.innerHTML = 'Download as Excel';
    downloadButton.className = 'download-button';
    downloadButton.addEventListener('click', async (event) => {
  
      const uri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
      const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{Worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>';
      const base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) };
      const format = function (s, c) {
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
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = 'td, th { background-color: white; border: 1px solid black; font-weight: normal; font-size: 11pt; font-family: Calibri, sans-serif; mso-number-format: "\\\@"; }';
      document.head.appendChild(style);
  
      const table = document.querySelector('table');
      const rows = table.rows;
  
      // Loop through each cell and set its style
      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        for (let j = 0; j < cells.length; j++) {
          const cell = cells[j];
          cell.setAttribute('style', style);
        }
      }
      
      const XLSX = document.createElement('script');
      XLSX.src = 'https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js';
      document.head.appendChild(XLSX);
      var ctx = { Worksheet: '28', table: table.innerHTML }
      var xl = format(template, ctx);
      const downloadUrl = uri + base64(xl);
      console.log(downloadUrl); // Prints the download URL to the console
      //sleep(1000);
      window.open(downloadUrl, "_blank");
      //const newTab=window.open(downloadUrl, "_blank");
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
        .thead{
          position: sticky;
          top: 0px; 
          z-index: 3;
        }
        th:before {
          content: '';
          top: 0;
          left: 0;
          border-top: 1px solid black;
          position: absolute;
          width: 100%;
      }
        th:after {
        content:''; 
        position:absolute; 
        left: 0; 
        bottom: 0; 
        width:100%; 
        border-bottom: 1px solid rgba(0,0,0,0.12);
      }
      .div{
        overflow-y: auto;
        height: calc(100vh - 100px);
        margin-bottom: 100px;
      }
      </style>
    `;

    generatedHTML += "<table class='table'>";
    generatedHTML += "<thead class='thead'>";
    generatedHTML += "<tr class='table-header'>";
    generatedHTML += `<th class='table-header' colspan='3'><b>COUNTERPARTY</b><hr style="margin: 0;width: 48.78%;height: 0.6px;top: 27px;position: absolute;left: 0;background-color: black;"></th>`;
    generatedHTML += `<th class='table-header' colspan='15' style='height:25px;'><b>ORIGINAL EXPOSURES</b></th>`;
    generatedHTML += `<th class='table-header' rowspan='5'>(-) Value adjustments and provisions</th>`;
    generatedHTML += `<th class='table-header' rowspan='5'>(-) Exposures deducted from CET 1 or Additional Tier 1 items</th>`;
    generatedHTML += `<th class='table-header' rowspan='3' colspan='3'><b>Exposure value before application of exemptions and CRM </b><hr style="margin: 0;position: absolute;width: 25.37%;top: 83px;left: 2260px;background-color: black;height: 0.6px;"></th>`;
    generatedHTML += `<th class='table-header' colspan='8'><b>ELIGIBLE CREDIT RISK MITIGATION (CRM) TECHNIQUES</b><hr style="height: 0.6px;top: 27px;position: absolute;left: 2603px;width: 23.85%;margin: 0;background-color: black;"></th>`;
    generatedHTML += `<th class='table-header' rowspan='5'>(-) Amounts exempted</th>`;
    generatedHTML += `<th class='table-header' rowspan='3' colspan='3'><b>Exposure value after application of exemptions and CRM</b><hr style="margin: 0;height: 0.6px;top: 83px;position: absolute;width: 8.4%;left: 3711.5px;background-color: black;"></th>`;
    generatedHTML += "</tr>";
    generatedHTML += "<tr class='table-header'>";
    generatedHTML += `<th class='table-header' rowspan='4'>Code<hr style="margin: 0;height: 0.6px;position: absolute;width: 100%;left: 0;top: 177px;background-color: black;"></th>`;
    generatedHTML += `<th class='table-header' rowspan='4'>Group or individual</th>`;
    generatedHTML += `<th class='table-header' rowspan='4'>Transactions where there is an exposure to underlying assets</th>`;
    generatedHTML += `<th class='table-header' rowspan='4'><b>Total original exposure</b></th>`;
    generatedHTML += `<th class='table-header' colspan='14' style="height:25px;"><hr style="margin: 0;position: absolute;height: 0.6px;top: 55px;width:37.89%;background-color: #262d33;left: 442px;"></th>`;
    generatedHTML += `<th class='table-header' colspan='6' rowspan='2'>(-) Substitution effect of eligible credit risk mitigation techniques</th>`;
    generatedHTML += `<th class='table-header' rowspan='4'>(-) Funded credit protection other than substitution effect</th>`;
    generatedHTML += `<th class='table-header' rowspan='4'>(-) Real estate</th>`;
    generatedHTML += "</tr>";
    generatedHTML += "<tr>";
    generatedHTML += `<th class='table-header' colspan='1'></th>`;
    generatedHTML += `<th class='table-header' colspan='6' style="height:25px;">Direct exposures<hr style="margin: 0;position: absolute;height: 0.6px;top: 82.5px;width: 36.16%;left: 442px;background-color: black;"></th>`;
    generatedHTML += `<th class='table-header' colspan='6' style="height:25px;">Indirect exposures</th>`;
    generatedHTML += `<th class='table-header' rowspan='3'>Additional exposures arising from transactions where there is an exposure to underlying assets</th>`;
    generatedHTML += "</tr>";
    generatedHTML += "<tr>";
    generatedHTML += `<th class='table-header' rowspan='2'><i>Of which: defaulted</i></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Debt instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Equity instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Derivatives</th>`;
    generatedHTML += `<th class='table-header' colspan='3'>Off balance sheet items<hr style="margin: 0;height: 0.6px;position: absolute;width: 6.52%;top: 133.5px;background-color: black;left: 956px;"></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Debt instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Equity instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>Derivatives</th>`;
    generatedHTML += `<th class='table-header' colspan='3'>Off balance sheet items<hr style="margin: 0;height: 0.6px;position: absolute;width: 6.49%;top: 133.5px;background-color: black;left: 1644.5px;"></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'><b>Total</b></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'><i>Of which: Non-trading book</i></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>% of Tier 1 capital </th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>(-) Debt instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>(-) Equity instruments</th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>(-) Derivatives</th>`;
    generatedHTML += `<th class='table-header' colspan='3'>(-) Off balance sheet items<hr style="margin: 0;height: 0.6px;position: absolute;width: 6.5%;top: 133.5px;background-color: black;left: 3024.7px;"></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'><b>Total</b></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'><i>Of which: Non-trading book</i></th>`;
    generatedHTML += `<th class='table-header' rowspan='2'>% of Tier 1 capital</th>`;
    generatedHTML += "</tr>";
    generatedHTML += "<tr>";
    generatedHTML += `<th class='table-header' rowspan='1'>Loan commitments</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>Financial guarantees</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>Other commit-ments</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>Loan commitments</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>Financial guarantees</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>Other commit-ments</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>(-) Loan commitments</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>(-) Financial guarantees</th>`;
    generatedHTML += `<th class='table-header' rowspan='1'>(-) Other commit-ments</th>`;
    generatedHTML += "</tr>";



    const header=['010','020','030','040','050','060','070','080','090','100','110','120','130','140','150','160','170','180','190','200','210','220','230','240','250','260','270','280','290','300','310','320','330','340','350',];
    // First row is the header
    generatedHTML += "<tr class='table-header'>";
    for (let i=0;i<header.length;i++) {
      generatedHTML += `<th class='table-header'>${header[i]}<hr style="margin: 0;height: 0.6px;position: absolute;width: 100%;left: 0;top: 193px;background-color: black;"></th>`;
    }
    generatedHTML += "</tr>";
    generatedHTML += "</thead>";

    // Next rows are the data
    for (row of data) {
      generatedHTML += "<tr class='table-row'>";
      for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
        generatedHTML += `<td class='table-cell'>${LookerCharts.Utils.htmlForCell(row[field.name])}</td>`;
      }
      generatedHTML += "</tr>";
    }
    generatedHTML += "</table>";

    this._container.innerHTML = generatedHTML; 
    this.addDownloadButtonListener();

    done();
  }
});
